<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// Espelho EDITORIAL do Footer atual, não um serviço de persistência.
// Os créditos, logos oficiais e textos institucionais fixos não são configuráveis.
type FooterLink = { id:string; label:string; url:string }
type FooterDraft = {
  email:string
  instagram:string
  instagramHandle:string
  whatsapp:string
  whatsappLabel:string
  campusDetail:string
  contactIntro:string
  supportTitle:string
  supportMessage:string
  links: FooterLink[]
}
const original: FooterDraft = {
  email:'ieeerasufrb@gmail.com',
  instagram:'https://www.instagram.com/ieeerasufrb/',
  instagramHandle:'@ieeerasufrb',
  whatsapp:'https://wa.me/5573981264674',
  whatsappLabel:'+55 73 98126-4674',
  campusDetail:'Cruz das Almas, BA — Brasil',
  contactIntro:'Tem dúvidas, sugestões ou quer saber mais sobre a RAS UFRB? Entre em contato conosco.',
  supportTitle:'Apoie o projeto.',
  supportMessage:'Quer contribuir com nossas ações, eventos e iniciativas? Fale conosco e ajude a fortalecer a robótica e a tecnologia na comunidade.',
  links:[
    {id:'ufrb',label:'UFRB',url:'https://www.ufrb.edu.br/'},
    {id:'ieee',label:'IEEE',url:'https://www.ieee.org/'},
    {id:'ieee-ras',label:'IEEE RAS',url:'https://www.ieee-ras.org/'},
    {id:'ieee-br',label:'IEEE Brasil',url:'https://www.ieee.org.br/'}
  ]
}
function copy():FooterDraft {return {...original,links:original.links.map(link=>({...link}))}}
defineExpose({
  getPreviewData:()=>JSON.parse(JSON.stringify(footer.value)) as FooterDraft,
  setPreviewData:(saved:Partial<FooterDraft>)=>{
    if(!saved||typeof saved!=='object')return
    footer.value={...copy(),...saved,links:Array.isArray(saved.links)?saved.links:copy().links}
  }
})
const footer=ref<FooterDraft>(copy())
const isHttpUrl=(url:string)=>{try {let parsed=new URL(url);return ['https:','http:'].includes(parsed.protocol)}catch{return false}}
function testPreview() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(footer.value.email.trim())) {
    ElMessage.warning('Informe um endereço de e-mail válido.');return
  }
  if (![footer.value.instagram,...footer.value.links.map(link=>link.url)].every(isHttpUrl)) {
    ElMessage.warning('Utilize URLs válidas que comecem com https:// ou http://.');return
  }
  if (!/^https:\/\/wa\.me\/[0-9]+\/?$/.test(footer.value.whatsapp.trim())) {
    ElMessage.warning('O WhatsApp deve usar um link https://wa.me/ seguido do número.');return
  }
  ElMessage.success('Prévia local validada. Nenhuma informação do Footer foi publicada.')
}
function restore() {
 footer.value=copy()
 ElMessage.success('Dados do Footer restaurados aos valores padrão encontrados no código da Landing.')
}
</script>

<template>
  <div class="footer-editor">
    <div class="footer-editor-heading">
      <h3>Informações editáveis do Footer</h3>
      <p>Atualize os contatos, endereços, links e mensagens que podem mudar. A marca, a identidade institucional e os créditos permanecem protegidos.</p>
    </div>
    <div class="footer-editor-panel">
      <h4>Contato e localização</h4>
      <div class="footer-editor-grid">
        <el-form-item label="E-mail de contato"><el-input v-model="footer.email" placeholder="contato@exemplo.com" /></el-form-item>
        <el-form-item label="Localização exibida"><el-input v-model="footer.campusDetail" maxlength="120"/></el-form-item>
        <el-form-item label="Instagram — endereço"><el-input v-model="footer.instagram" placeholder="https://www.instagram.com/..." /></el-form-item>
        <el-form-item label="Instagram — nome visível"><el-input v-model="footer.instagramHandle" placeholder="@perfil" /></el-form-item>
        <el-form-item label="WhatsApp — link"><el-input v-model="footer.whatsapp" placeholder="https://wa.me/55..." /></el-form-item>
        <el-form-item label="WhatsApp — número visível"><el-input v-model="footer.whatsappLabel" placeholder="+55 ..." /></el-form-item>
        <el-form-item label="Texto da coluna de contato" class="full"><el-input v-model="footer.contactIntro" type="textarea" :rows="2" maxlength="320" show-word-limit /></el-form-item>
      </div>
    </div>

    <div class="footer-editor-panel">
      <h4>Apoio ao projeto</h4>
      <div class="footer-editor-grid">
        <el-form-item label="Chamada"><el-input v-model="footer.supportTitle" maxlength="70"/></el-form-item>
        <el-form-item class="full" label="Mensagem de apoio"><el-input v-model="footer.supportMessage" type="textarea" :rows="2" maxlength="400" show-word-limit/></el-form-item>
      </div>
    </div>

    <div class="footer-editor-panel">
      <h4>Endereços dos links institucionais</h4>
      <p>Os nomes e as instituições permanecem fixos; apenas os endereços podem ser atualizados.</p>
      <div class="footer-editor-grid">
        <el-form-item v-for="link in footer.links" :key="link.id" :label="link.label">
          <el-input v-model="link.url" placeholder="https://"/>
        </el-form-item>
      </div>
    </div>

    <div class="footer-editor-panel footer-editor-preview">
      <div class="footer-preview-eyebrow">PRÉVIA SIMPLIFICADA DO FOOTER</div>
      <div class="footer-preview-columns">
        <div>
          <strong>IEEE RAS UFRB</strong>
          <small>UFRB — Campus Cruz das Almas</small>
          <span>{{ footer.campusDetail || 'Localização não informada' }}</span>
        </div>
        <div>
          <strong>Links úteis</strong>
          <span v-for="link in footer.links" :key="link.id">{{ link.label }} ↗</span>
        </div>
        <div>
          <strong>{{ footer.supportTitle || 'Apoie o projeto' }}</strong>
          <span>{{ footer.supportMessage }}</span>
        </div>
        <div>
          <strong>Fale conosco</strong>
          <span>{{ footer.contactIntro }}</span>
          <span>{{ footer.email }}</span>
          <span>{{ footer.instagramHandle }}</span>
          <span>{{ footer.whatsappLabel }}</span>
        </div>
      </div>
      <div class="footer-preview-bottom">© RAS UFRB · Créditos e identidade visual fixos</div>
    </div>

    <div class="footer-editor-actions">
      <el-button type="primary" @click="testPreview">Validar prévia local</el-button>
      <el-button @click="restore">Restaurar dados originais</el-button>
    </div>
    <p class="footer-editor-warning">Interface de teste: estas edições ainda não alteram os arquivos da Landing nem a produção. Contatos e links reais continuam vindos do Footer atual até a implantação do CMS.</p>
  </div>
</template>

<style scoped>
.footer-editor{display:flex;flex-direction:column;gap:15px}
.footer-editor-heading h3,.footer-editor-panel h4{font-size:16px;letter-spacing:-.02em;margin:0 0 7px}
.footer-editor-heading p,.footer-editor-panel p{font-size:12px;line-height:1.6;color:#847785;margin:0 0 9px}
.footer-editor-panel{background:#fff;border:1px solid #ebe4ea;border-radius:12px;padding:17px;min-width:0}
.footer-editor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 14px}
.footer-editor-grid .full{grid-column:1/-1}
.footer-editor-grid :deep(.el-form-item){min-width:0;display:flex;flex-direction:column;align-items:stretch;margin-bottom:15px}
.footer-editor-grid :deep(.el-form-item__label){justify-content:flex-start;line-height:1.4;padding-bottom:6px}
.footer-editor-preview{background:linear-gradient(120deg,#401a36,#6f255c);color:white}
.footer-preview-eyebrow{font-size:10px;letter-spacing:.1em;color:#f2bfd7;font-weight:800;margin-bottom:17px}
.footer-preview-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.footer-preview-columns>div{display:flex;flex-direction:column;gap:9px;min-width:0}
.footer-preview-columns strong{font-size:13px;color:#fff}
.footer-preview-columns span,.footer-preview-columns small{font-size:11px;color:#f5e4ee;line-height:1.4;overflow-wrap:anywhere}
.footer-preview-bottom{margin-top:20px;padding-top:12px;border-top:1px solid #ffffff24;font-size:10px;color:#f4cbde}
.footer-editor-actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap}
.footer-editor-actions span,.footer-editor-warning{font-size:11px;color:#857888;line-height:1.5}
@media(min-width:1250px){.footer-preview-columns{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:680px){.footer-editor-grid,.footer-preview-columns{grid-template-columns:1fr}.footer-editor-panel{padding:13px}}
</style>
