<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../store'
import { http } from '../api/http'

type DocumentItem = { id:number; type:string; title:string; description:string; competitionId:number|null; filename:string; version:number; published:boolean; updatedAt:string }
const auth=useAuthStore()
const docs=ref<DocumentItem[]>([])
const loading=ref(false)
const editing=ref(false)
const type=ref('MANUAL')
const title=ref('')
const description=ref('')
const file=ref<File|null>(null)
const competitionId=ref('')
const types:Record<string,string>={MANUAL:'Manual do Usuário',CONDUTA:'Regras de Conduta',COMPETICAO:'Regras da Competição'}
async function refresh(){
 loading.value=true
 try {const {data}=await http.get<DocumentItem[]>(auth.isDev?'/api/v1/ajuda/admin':'/api/v1/ajuda');docs.value=data}
 catch {ElMessage.error('Não foi possível carregar os documentos.')}
 finally {loading.value=false}
}
async function upload(){
 if(!file.value||!title.value.trim()){ElMessage.warning('Informe um título e selecione um PDF.');return}
 const body=new FormData()
 body.append('type',type.value);body.append('title',title.value);body.append('description',description.value)
 if(competitionId.value)body.append('competitionId',competitionId.value)
 body.append('file',file.value)
 editing.value=true
 try {
  await http.post('/api/v1/ajuda/admin',body,{headers:{'Content-Type':'multipart/form-data'},timeout:60000})
  title.value='';description.value='';competitionId.value='';file.value=null
  const input=document.getElementById('help-file') as HTMLInputElement|null;if(input)input.value=''
  ElMessage.success('Documento salvo como rascunho. Publique para disponibilizar aos participantes.')
  await refresh()
 }catch {ElMessage.error('Não foi possível enviar o PDF.')}finally{editing.value=false}
}
async function publication(doc:DocumentItem) {
 try{
  await ElMessageBox.confirm(doc.published?'Retirar este documento do Portal?':'Publicar este documento para participantes?','Confirmar publicação')
  await http.patch('/api/v1/ajuda/admin/'+doc.id+'/publication',{published:!doc.published})
  await refresh()
 }catch(e:any){if(e!=='cancel'&&e!=='close')ElMessage.error('Falha ao alterar publicação.')}
}
async function openDocument(doc:DocumentItem){
 try{
  const {data}=await http.get('/api/v1/ajuda/'+doc.id+'/file',{responseType:'blob'})
  const url=URL.createObjectURL(new Blob([data],{type:'application/pdf'}))
  const anchor=document.createElement('a');anchor.href=url;anchor.target='_blank';anchor.rel='noopener noreferrer'
  document.body.appendChild(anchor);anchor.click();anchor.remove()
  setTimeout(()=>URL.revokeObjectURL(url),60000)
 }catch {ElMessage.error('Documento indisponível.')}
}
onMounted(refresh)
</script>

<template>
 <div class="help-page">
  <header class="help-intro"><h1>{{ auth.isDev ? 'Documentos e ajuda' : 'Regras e Ajuda' }}</h1>
   <p>{{ auth.isDev ? 'Publique os documentos oficiais para o Portal do Participante.' : 'Consulte o manual e as orientações oficiais disponíveis.' }}</p>
  </header>
  <section v-if="auth.isDev" class="help-panel">
   <h2>Adicionar documento</h2>
   <div class="help-form">
    <label>Tipo<select v-model="type"><option v-for="(name,key) in types" :key="key" :value="key">{{ name }}</option></select></label>
    <label>Título<input v-model="title" maxlength="180" placeholder="Nome do documento"></label>
    <label>Descrição<input v-model="description" maxlength="1000" placeholder="Resumo opcional"></label>
    <label>Competição (ID opcional)<input v-model="competitionId" inputmode="numeric" type="number" min="1" placeholder="Vazio = documento geral"></label>
    <label>Arquivo PDF (até 10 MB)<input id="help-file" type="file" accept="application/pdf,.pdf" @change="file=($event.target as HTMLInputElement).files?.[0]||null"></label>
    <button class="help-primary" :disabled="editing" @click="upload">{{ editing ? 'Enviando...' : 'Salvar rascunho' }}</button>
   </div>
  </section>
  <section v-for="(name,key) in types" :key="key" class="help-panel">
   <h2>{{ name }}</h2>
   <div v-if="!docs.some(d=>d.type===key)" class="help-empty">Nenhum documento disponível nesta categoria.</div>
   <article v-for="doc in docs.filter(d=>d.type===key)" :key="doc.id" class="help-document">
    <div><strong>{{ doc.title }}</strong><p v-if="doc.description">{{ doc.description }}</p>
     <small>PDF · {{ doc.competitionId ? 'Competição '+doc.competitionId : 'Geral' }} · Atualizado em {{ new Date(doc.updatedAt).toLocaleDateString('pt-BR') }}</small>
     <small v-if="auth.isDev"> · {{ doc.published ? 'Publicado' : 'Rascunho' }}</small>
    </div>
    <div class="help-actions"><button @click="openDocument(doc)">Visualizar PDF</button>
     <button v-if="auth.isDev" @click="publication(doc)">{{ doc.published?'Despublicar':'Publicar' }}</button></div>
   </article>
  </section>
  <p v-if="loading" role="status">Carregando documentos...</p>
 </div>
</template>

<style scoped>
.help-page{max-width:1100px;margin:0 auto;display:grid;gap:20px}
.help-intro h1{font-size:clamp(1.5rem,3vw,2rem);margin:0 0 8px}
.help-intro p,.help-empty{color:var(--el-text-color-secondary)}
.help-panel{background:var(--el-bg-color,#fff);border:1px solid var(--el-border-color-light,#ddd);border-radius:14px;padding:22px}
.help-panel h2{font-size:1.13rem;margin:0 0 16px}
.help-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;align-items:end}
.help-form label{display:grid;gap:6px;font-size:.86rem;font-weight:600}
.help-form input,.help-form select{width:100%;min-height:40px;border:1px solid #c9c4d0;border-radius:7px;padding:8px;background:var(--el-bg-color,#fff);color:inherit}
.help-form input[type=file]{padding:6px}
.help-primary,.help-actions button{border:1px solid #78244e;background:#78244e;color:#fff;border-radius:8px;padding:10px 14px;cursor:pointer}
.help-primary:disabled{opacity:.6;cursor:wait}
.help-document{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 0;border-top:1px solid var(--el-border-color-light,#eee)}
.help-document p{margin:6px 0}.help-document small{color:var(--el-text-color-secondary);font-size:.75rem}
.help-actions{display:flex;flex-wrap:wrap;gap:8px;flex-shrink:0}
@media(max-width:700px){.help-panel{padding:16px}.help-document{align-items:stretch;flex-direction:column}}
</style>
