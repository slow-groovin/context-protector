import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Debug from '../views/Debug.vue'
import DatabaseTest from '../views/debug/DatabaseTest.vue'
import DrizzleOrmTest from '../views/debug/DrizzleOrmTest.vue'
import EnvironmentInfo from '../views/debug/EnvironmentInfo.vue'
import OpfsViewer from '../views/debug/OpfsViewer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/debug',
      name: 'debug',
      component: Debug
    },
    {
      path: '/debug/database',
      name: 'database-test',
      component: DatabaseTest
    },
    {
      path: '/debug/drizzle-orm',
      name: 'drizzle-orm-test',
      component: DrizzleOrmTest
    },
    {
      path: '/debug/environment',
      name: 'environment-info',
      component: EnvironmentInfo
    },
    {
      path: '/debug/opfs-viewer',
      name: 'opfs-viewer',
      component: OpfsViewer
    }
  ]
})

export default router