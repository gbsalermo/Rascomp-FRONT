import { shallowRef } from 'vue'

// Canal EXCLUSIVAMENTE de desenvolvimento local. Nada é persistido, salvo ou publicado.
export type PreviewFrame = { zoom:number; width:number; height:number; x:number; y:number; fit:'cover'|'contain' }
export type PreviewImage = { src:string; name?:string; frame?:PreviewFrame }
export type PreviewHero = { id:string; title:string; eyebrow:string; description:string; cta:string; href:string; showButton:boolean; active:boolean; image?:PreviewImage }
export type PreviewRobot = PreviewImage & { id:number; name:string; labelPosition:'overlay'|'below' }
export type PreviewDraft = {
  heroes: PreviewHero[]
  about: PreviewImage[]
  board: {role:string;image?:PreviewImage}[]
  volunteers: PreviewImage[]
  awards: {id:number;title:string;place:string;event:string;description:string;year:string;active:boolean;image?:PreviewImage}[]
  robots: {banner?:PreviewImage;categories:Record<string,PreviewRobot[]>}
  events: {id:string;title:string;date:string;endDate:string;location:string;description:string;type:string;active:boolean;image?:PreviewImage}[]
  sponsors: {id:number;name:string;url:string;image?:PreviewImage}[]
  competition: {sectionImage?:PreviewImage;sectionText:string;heroEnabled:boolean;heroImage?:PreviewImage;subtitle:string;description:string;showExtra:boolean;extraLabel:string;extraDestination:string}
  footer: {email:string;instagram:string;instagramHandle:string;whatsapp:string;whatsappLabel:string;campusDetail:string;contactIntro:string;supportTitle:string;supportMessage:string;links:{id:string;label:string;url:string}[]} | null
}
export const localMediaDraft = shallowRef<PreviewDraft|null>(null)
export const mediaPreviewMode = import.meta.env.DEV &&
  ['localhost','127.0.0.1'].includes(window.location.hostname) &&
  new URLSearchParams(window.location.search).get('rascomp_media_preview') === '1'

const allowedOrigins = ['http://localhost:5173','http://127.0.0.1:5173']
const objectUrls:string[]=[]
function releaseUrls() {for(const url of objectUrls)URL.revokeObjectURL(url);objectUrls.length=0}
function srcFor(value:string,files:Record<string,Blob>):string {
  if(value.startsWith('rascomp-file:')) {
    const blob=files[value.slice('rascomp-file:'.length)]
    if(!blob || !blob.type.startsWith('image/'))return ''
    const url=URL.createObjectURL(blob);objectUrls.push(url);return url
  }
  if(value.startsWith('http://localhost:5173/') || value.startsWith('http://127.0.0.1:5173/'))return value
  return ''
}
function decodeDraft(draft:PreviewDraft,files:Record<string,Blob>):PreviewDraft {
  // O transporte de imagens não pode alterar texto/URLs da API; apenas recria src locais.
  const visit=(value:unknown):unknown=>{
    if(Array.isArray(value))return value.map(visit)
    if(value && typeof value==='object'){
      const copy:Record<string,unknown>={}
      for(const [key,v] of Object.entries(value)){
        copy[key]=key==='src' && typeof v==='string' ? srcFor(v,files) : visit(v)
      }
      return copy
    }
    return value
  }
  return visit(draft) as PreviewDraft
}
export function startLocalMediaPreview() {
  if(!mediaPreviewMode || !window.opener)return ()=>{}
  const source=window.opener
  const token=new URLSearchParams(window.location.hash.slice(1)).get('preview')
  if(!token || !/^[\w-]{16,90}$/.test(token))return ()=>{}
  const referrerOrigin=(()=>{try{return new URL(document.referrer).origin}catch{return ''}})()
  const parentOrigin=allowedOrigins.find(origin=>origin===referrerOrigin) || allowedOrigins[0]!
  const onMessage=(event:MessageEvent)=>{
    if(event.source!==source || !allowedOrigins.includes(event.origin))return
    const message=event.data
    if(!message || message.type!=='rascomp:media-draft' || message.token!==token)return
    if(typeof message.draft!=='object' || !message.draft || !Array.isArray(message.draft.heroes))return
    releaseUrls()
    localMediaDraft.value=decodeDraft(message.draft as PreviewDraft,message.files ?? {})
  }
  window.addEventListener('message',onMessage)
  source.postMessage({type:'rascomp:media-ready',token},parentOrigin)
  return ()=>{window.removeEventListener('message',onMessage);releaseUrls()}
}
export function previewImageStyle(frame?:PreviewFrame) {
  if(!frame)return undefined
  return {
    objectFit:frame.fit,objectPosition:`${frame.x}% ${frame.y}%`,
    width:`${frame.width}%`,height:`${frame.height}%`,
    maxWidth:'none',maxHeight:'none',
    transform:`translate(${(frame.x-50)*.7}%,${(frame.y-50)*.7}%) scale(${frame.zoom/100})`
  }
}
