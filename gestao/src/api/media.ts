import { http, API_URL } from './http'

export type ApiMediaPhoto = {id:number;name:string;src:string;albums:number[];published:boolean;size:number;contentType:string}
export type ApiMediaAlbum = {id:number;name:string;description:string;coverId?:number|null}
export type MediaWorkspace = {
  photos:ApiMediaPhoto[];albums:ApiMediaAlbum[];
  editorialDraft:Record<string,unknown>;featuredPhotoIds:number[];version:number
}
const base='/api/v1/media'
export const mediaApi = {
  workspace:()=>http.get<MediaWorkspace>(base+'/workspace').then(r=>r.data),
  async upload(file:File,published=false):Promise<ApiMediaPhoto>{
    const data=new FormData()
    data.append('file',file)
    data.append('galleryDraft',String(published))
    const response=await http.post<ApiMediaPhoto>(base+'/assets',data,{
      headers:{'Content-Type':undefined},timeout:120000
    })
    return response.data
  },
  image:async(id:number)=>http.get<Blob>(base+'/assets/'+id+'/content',{responseType:'blob'}).then(r=>r.data),
  visibility:(id:number,published:boolean)=>http.patch(base+'/assets/'+id+'/visibility',{published}),
  albumsForPhoto:(id:number,albumIds:number[])=>http.put(base+'/assets/'+id+'/albums',{albumIds}),
  bulkAlbums:(assetIds:number[],albumIds:number[])=>http.post(base+'/assets/albums',{assetIds,albumIds}),
  deletePhoto:(id:number)=>http.delete(base+'/assets/'+id),
  createAlbum:(name:string,description='')=>http.post<{id:number}>(base+'/albums',{name,description}).then(r=>r.data.id),
  updateAlbum:(id:number,name:string,description:string,coverId?:number)=>http.put(base+'/albums/'+id,{name,description,coverId:coverId??null}),
  deleteAlbum:(id:number)=>http.delete(base+'/albums/'+id),
  saveDraft:(draft:unknown)=>http.put(base+'/draft',draft),
  saveFeatured:(ids:number[])=>http.put(base+'/featured',ids),
  publish:(expectedVersion:number)=>http.post<{version:number}>(base+'/publish',{expectedVersion}).then(r=>r.data),
  publishGallery:(expectedVersion:number)=>http.post<{version:number}>(base+'/publish/gallery',{expectedVersion}).then(r=>r.data),
  privatePath:(id:number)=>base+'/assets/'+id+'/content',
  publicUrl:(id:number)=>API_URL+'/api/v1/public/media/assets/'+id+'/content'
}
