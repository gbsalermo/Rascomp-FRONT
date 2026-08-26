import { createRouter, createWebHistory } from 'vue-router'
import GalleryHomeView from './views/GalleryHomeView.vue'
import AlbumView from './views/AlbumView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'gallery-home', component: GalleryHomeView },
    { path: '/albuns', redirect: '/' },
    { path: '/albuns/:slug', name: 'album', component: AlbumView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})
