<template>
  <div class="home">
    <router-link to="/Signup">Sign Up</router-link>
    <router-link to="/Login">Login</router-link>
    <router-link to="/CreateQuizz" v-if="is_admin">Create Quiz</router-link>
  </div>
  <h1 v-if="user">Hello {{ user.displayName }}</h1>
  <listQuiz/>
  <RouterView/>
</template>

<script>
import listQuiz from '@/components/listQuiz.vue';
import {auth, db} from '../firebase'
import {ref, onMounted} from 'vue'
import { onAuthStateChanged } from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore'

export default {
  components: {
    listQuiz
  },
  setup() {
    const user = ref(null);
    const is_admin = ref(null)
    onMounted(() => {
      onAuthStateChanged(auth, async (u) => {
        if (u) {
          user.value = u
          const userDoc = await getDoc(doc(db, 'users', u.uid))
          is_admin.value = userDoc.data()?.admin ?? false

        }
      })

    })

    
    return {
      user,
      is_admin
    }
  }
  

  
  
}
</script>
