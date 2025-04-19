<template>
  <form @submit.prevent="create_user">
    <div class="form-group">
      <input type="text" required placeholder="Display name" v-model="displayname">
    </div>
    <div class="form-group">
      <input type="email" required placeholder="Your email" v-model="email">
    </div>
    <div class="form-group">
      <input type="password" required placeholder="Your password" v-model="password">
    </div>
    <div class="form-group">
      <label for="admin">Role: Admin?</label>
      <input type="checkbox" v-model="admin">
    </div>
    <button type="submit" class="btn btn-success">Sign up</button>
    <div class="error">{{ errors }}</div>
  </form>
  
</template>

<script>
import router from '@/router';
import {auth, db} from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore'
import { ref } from 'vue';



export default {
  setup() {
    const displayname = ref('')
    const email = ref('')
    const password = ref('')
    const errors = ref(null)
    const admin = ref(false)
    const create_user = () => {
        createUserWithEmailAndPassword(auth, email.value, password.value)
        .then( async (userData) => {
          const user = userData.user;
          await setDoc(doc(db , 'users', user.uid), {
            name: displayname.value,
            email: email.value,
            admin: admin.value 
          })

          return updateProfile(user, {displayName: displayname.value})
        } 
        ) 
    
        .then(
          () => {
            router.push('/')
          }
        )
        .catch((error) => {
          errors.value = error.message
        })
      }
      return {
      displayname, 
      email,
      password,
      errors,
      admin,
      create_user
    }
   
  }
}

</script>

<style>

</style>