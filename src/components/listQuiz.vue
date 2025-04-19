<template>
<div>
    <h1>List of quiz</h1>
    <div v-for="(quizz, index) in quizzes" :key = "index" class="container">
        <router-link :to="{name:'quizdetail', params: {id:quizz.id}}">
            <div>
                <p>title : {{ quizz.title }}</p>
                <p>topic : {{ quizz.topic }}</p>
                <p>difficulty : {{ quizz.difficulty }}</p>
            </div>
        </router-link>
        
    </div>
</div>

</template>

<script>
import {db} from '../firebase'
import {collection, getDocs} from 'firebase/firestore'
import {ref, onMounted} from 'vue'

export default {
    setup() {
        const quizzes = ref([])
        const get_quiz = async() => {
            const datas = await getDocs(collection(db, "Quizzes"))
            datas.forEach( (doc)=> {
                quizzes.value.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
        }
        onMounted(get_quiz)
        return {
            quizzes
        }
    }
}
</script>

<style>
.container {
    border: solid 1px black;
    text-decoration: none;
}

</style>