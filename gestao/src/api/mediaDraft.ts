import {mediaApi} from './media'

type LocalImage={id:number;name:string;src?:string;persisted?:boolean}
const sourceCache=new Map<string,number>()
const photoIdFields=new Set(['photoId','robotBannerId','competitionBannerId','competitionHeroPhotoId'])
const photoIdArrays=new Set(['aboutPhotos','volunteerPhotos','sumo','mini-sumo','hockey','follow-line'])
function sourceId(src:string){
  const match=/\/api\/v1\/(?:public\/)?media\/assets\/(\d+)\/content/.exec(src)
  return match?Number(match[1]):undefined
}
export async function prepareEditorialUpload(
  original:Record<string,unknown>,
  state:Record<string,unknown>,
  photos:LocalImage[],
  onStored:(id:number,name:string,source:string,blob:Blob)=>void
){
  const draft=JSON.parse(JSON.stringify(original)) as Record<string,unknown>
  const aliases=new Map<number,number>()
  async function imageSource(src:string){
    const id=sourceId(src)
    if(id!==undefined)return mediaApi.publicUrl(id)
    const stored=sourceCache.get(src)
    if(stored!==undefined)return mediaApi.publicUrl(stored)
    const localAsset=photos.find(photo=>photo.persisted && photo.src && new URL(photo.src,location.origin).href===new URL(src,location.origin).href)
    if(localAsset)return mediaApi.publicUrl(localAsset.id)
    const url=new URL(src,location.origin)
    // Assets institucionais que já estão publicados na Landing são referências
    // estáticas legítimas: não exigem reupload ao salvar um rascunho editorial.
    // A exceção é restrita ao domínio oficial e à pasta de mídia da Landing.
    if(url.origin==='https://rasufrb.site' && url.pathname.startsWith('/media/assets/'))
      return url.href
    if(url.protocol!=='blob:' && url.origin!==location.origin)
      throw Error('Imagem externa não importada: '+url.hostname+url.pathname+'. Importe-a para a Biblioteca antes de salvar o rascunho.')
    const response=await fetch(url.href)
    if(!response.ok)throw Error('Falha ao ler imagem original: HTTP '+response.status)
    const blob=await response.blob()
    if(!blob.type.startsWith('image/'))throw Error('Arquivo não é uma imagem válida')
    const local=photos.find(p=>p.src&&new URL(p.src,location.origin).href===url.href)
    const entry=await mediaApi.upload(new File([blob],local?.name||'imagem.jpg',{type:blob.type}),false)
    sourceCache.set(src,entry.id)
    if(local)aliases.set(local.id,entry.id)
    onStored(entry.id,entry.name,src,blob)
    return mediaApi.publicUrl(entry.id)
  }
  async function migrate(node:unknown):Promise<void>{
    if(Array.isArray(node)){for(const child of node)await migrate(child);return}
    if(!node||typeof node!=='object')return
    for(const [key,value]of Object.entries(node)){
      if(key==='src'&&typeof value==='string') (node as Record<string,unknown>)[key]=await imageSource(value)
      else await migrate(value)
    }
  }
  // Migrar apenas mídias de seções editadas; as demais continuam estáticas.
  const changed=new Set(Array.isArray(draft.__editedSections)?draft.__editedSections as string[]:[])
  const sectionFields:Record<string,string[]>={
    heroes:['heroes'],about:['about'],team:['board','volunteers','awards'],
    robots:['robots'],events:['events'],sponsors:['sponsors'],
    competition:['competition'],footer:['footer']
  }
  for(const [section,fields] of Object.entries(sectionFields)){
    if(!changed.has(section))continue
    for(const field of fields)await migrate(draft[field])
  }
  function remap(node:unknown,key=''):unknown {
    if(Array.isArray(node))return node.map(x=>photoIdArrays.has(key)&&typeof x==='number'?aliases.get(x)??x:remap(x))
    if(!node||typeof node!=='object')return node
    const result:Record<string,unknown>={}
    for(const [field,value]of Object.entries(node)){
      if(photoIdFields.has(field)&&typeof value==='number')result[field]=aliases.get(value)??value
      else if((field==='robotTitles'||field==='robotTitleLocations')&&value&&typeof value==='object')
        result[field]=Object.fromEntries(Object.entries(value).map(([id,text])=>[String(aliases.get(Number(id))??id),text]))
      else if(field==='imageAdjustments'&&value&&typeof value==='object'){
        // O enquadramento de Sobre/Robôs usa o ID da foto na chave.
        // Ao importar o arquivo ao R2, remapear também essa chave;
        // do contrário o ajuste salvo aponta para o ID local anterior.
        result[field]=Object.fromEntries(Object.entries(value).map(([key,frame])=>{
          const updated=key.replace(/:(\\d+)(?=:|$)/g,(part,id)=>{
            const next=aliases.get(Number(id))
            return next===undefined?part:':'+next
          })
          return [updated,frame]
        }))
      }
      else result[field]=remap(value,field)
    }
    return result
  }
  draft._editorState=remap(state)
  return draft
}
