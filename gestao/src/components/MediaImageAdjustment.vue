<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
export type ImageAdjustment = {
  zoom: number
  width: number
  height: number
  x: number
  y: number
  fit: 'cover' | 'contain'
}
const defaults = (): ImageAdjustment => ({zoom:100,width:100,height:100,x:50,y:50,fit:'cover'})
const props=defineProps<{modelValue:boolean;src?:string;label:string;adjustment?:ImageAdjustment}>()
const emit=defineEmits<{(event:'update:modelValue',value:boolean):void;(event:'save',value:ImageAdjustment):void}>()
const values=reactive<ImageAdjustment>(defaults())
watch(()=>props.modelValue,open=>{
  if (!open) return
  Object.assign(values,defaults(),props.adjustment ?? {})
},{immediate:true})
const previewStyle=computed(()=>({
  width:values.width+'%',
  height:values.height+'%',
  maxWidth:'none',
  maxHeight:'none',
  objectFit:values.fit,
  objectPosition:values.x+'% '+values.y+'%',
  transform:`translate(${(values.x-50)*.7}%,${(values.y-50)*.7}%) scale(${values.zoom/100})`,
  transformOrigin:'center'
}))
function reset(){Object.assign(values,defaults())}
function save(){
  emit('save',{zoom:values.zoom,width:values.width,height:values.height,x:values.x,y:values.y,fit:values.fit})
  emit('update:modelValue',false)
}
</script>
<template>
  <el-dialog class="media-image-adjustment-dialog" :model-value="modelValue" :title="'Enquadramento — '+label"
    width="min(780px,96vw)" append-to-body @close="emit('update:modelValue',false)">
    <p class="image-adjustment-help">Ajuste apenas a apresentação desta imagem. O original é preservado e outros usos não serão afetados.</p>
    <div class="image-adjustment-stage">
      <img v-if="src" :src="src" :style="previewStyle" alt="Prévia de enquadramento"/>
      <span v-else>Escolha uma fotografia antes de ajustar.</span>
    </div>
    <div class="image-adjustment-presets">
      <strong>Encaixe</strong>
      <el-radio-group v-model="values.fit">
        <el-radio-button value="cover">Preencher área</el-radio-button>
        <el-radio-button value="contain">Imagem inteira</el-radio-button>
      </el-radio-group>
    </div>
    <div class="image-adjustment-grid">
      <label>Zoom — {{values.zoom}}%<el-slider v-model="values.zoom" :min="70" :max="250" :step="5"/></label>
      <label>Largura — {{values.width}}%<el-slider v-model="values.width" :min="60" :max="140" :step="5"/></label>
      <label>Altura — {{values.height}}%<el-slider v-model="values.height" :min="60" :max="140" :step="5"/></label>
      <label>Posição horizontal — {{values.x}}%<el-slider v-model="values.x" :min="0" :max="100" :step="5"/></label>
      <label>Posição vertical — {{values.y}}%<el-slider v-model="values.y" :min="0" :max="100" :step="5"/></label>
    </div>
    <template #footer>
      <el-button @click="reset">Restaurar enquadramento</el-button>
      <el-button @click="emit('update:modelValue',false)">Cancelar</el-button>
      <el-button type="primary" @click="save">Aplicar nesta foto</el-button>
    </template>
  </el-dialog>
</template>
<style scoped>
.image-adjustment-help{font-size:12px;line-height:1.5;color:#726575;margin:0 0 12px}
.image-adjustment-stage{height:255px;width:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#f5f2f6;border:1px solid #e4dce4;border-radius:12px;position:relative}
.image-adjustment-stage img{display:block;flex-shrink:0}
.image-adjustment-stage span{font-size:12px;color:#887d89}
.image-adjustment-presets{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 0 9px}
.image-adjustment-presets strong{font-size:12px}
.image-adjustment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px 23px}
.image-adjustment-grid label{font-size:12px;color:#5f5260}
@media(max-width:600px){.image-adjustment-stage{height:210px}.image-adjustment-grid{grid-template-columns:1fr}}
</style>
