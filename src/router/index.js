import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import signup from '../components/SignupForm.vue'
import login from '../components/LoginForm.vue'
import createquizz from '@/components/createQuizz.vue'
import quizDetails from '@/components/quizDetails.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:'/Signup',
    name: 'Signup',
    component: signup
  }, 
  {
    path:'/Login',
    name: 'Login',
    component: login
  },
  {path:'/CreateQuizz',
    name:'Createquizz',
    component: createquizz
  }, {
    path:'/listquiz/:id',
    name:'quizdetail',
    component: quizDetails
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
