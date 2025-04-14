<template>
  <div class="register">
    <h1>Create account</h1>
    <form @click="register">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" v-model="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="mot_de_passe">Password</label>
        <input type="password" v-model="password" required>
      </div>
    </form>
  </div>
</template>

<script>
import router from '../router';
import {auth} from '../firebase';
import {ref} from 'vue'

export default{
  setup() {
    const name = ref("")
    const email = ref("")
    
  }
}

</script>
