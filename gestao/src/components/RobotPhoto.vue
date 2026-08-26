<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { assetUrl, publicApi } from '../api'
import type { RobotImage } from '../types'

const props = withDefaults(defineProps<{
  robotId?: number
  robotName?: string
  alt?: string
}>(), {
  robotName: 'Robô'
})

const photos = ref<RobotImage[]>([])
const loading = ref(false)

const principal = computed(() => photos.value.find((item) => item.principal) || photos.value[0])
const initials = computed(() => {
  const parts = props.robotName.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'RB'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
})

async function load() {
  photos.value = []
  if (!props.robotId) return
  loading.value = true
  try {
    photos.value = await publicApi.robotPhotos(props.robotId)
  } catch {
    photos.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.robotId, load)
onMounted(load)
</script>

<template>
  <span class="robot-photo" :class="{ loading }">
    <img
      v-if="principal"
      :src="assetUrl(principal.url)"
      :alt="alt || `Foto de ${robotName}`"
    />
    <span v-else>{{ initials }}</span>
  </span>
</template>

<style scoped>
.robot-photo {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  overflow: hidden;
  border-radius: inherit;
  background: linear-gradient(145deg, #4f1967, #9f0f3b);
  color: #fff;
  font-size: inherit;
  font-weight: 900;
}

.robot-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.robot-photo.loading {
  opacity: .72;
}
</style>
