<template>
    <div class="welcome container">
        <form @submit.prevent="login">
            <input type="email" required placeholder="Your email" v-model="email">
            <input type="password" required placeholder="Your password" v-model="password">
            <button>Login</button>
            <div class="error">{{ errors }}</div>
        </form>
    </div>
  </template>
  
  <script>
import router from '@/router';
import {auth} from '../firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { ref } from 'vue';
export default {
  setup() {
    const email = ref("")
    const password = ref("")
    const errors = ref(null)
    const login = () => {
      signInWithEmailAndPassword(auth, email.value, password.value) 
      .then((userData) => {
        const user = userData.user;
        console.log(user)
      })
      .then(()=> {
        router.push('/')
      })
      .catch((error) => {
        errors.value = error.message;
      })
    }
    return {
      email,
      password,
      errors,
      login
    }
  }

   
}
  
  </script>
  
<style>
</style>