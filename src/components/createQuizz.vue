<template>
    <div>
        <h1>Create a quizz</h1>
        <form @submit.prevent = "createQuizz">
            <div class="form-group">
                <label for="title">Titre</label>
                <input type="text" v-model="title">
            </div>
            <div class="form-group">
                <label for="topic">Topic</label>
                <input type="text" v-model="topic">
            </div>
            <div class="form-group">
                <label for="difficulty">Difficulty    </label>
                <label for="easy">Easy</label>
                <input type="radio" value="Easy" v-model="difficulty">
                <label for="medium">Medium</label>
                <input type="radio" value="Medium" v-model="difficulty">
                <label for="hard">Hard</label>
                <input type="radio" value="Hard" v-model="difficulty">
            </div>
            <div v-for="(question, index) in questions" :key="index">
                <p>If it is a true/false question, type true in option in option 1, false in option 2 and the correct answer in the correct answer field</p>
                <input type="text" v-model="question.question" placeholder="Enter a question">
                <div class="grid grid-cols-2 gap-2 mb-2">
        <input
          v-for="(option, oIndex) in question.options"
          :key="oIndex"
          type="text"
          v-model="question.options[oIndex]"
          :placeholder="`Option ${oIndex + 1}`"
          class="p-2 border rounded"
        />
      </div>
      <input
        type="text"
        v-model="question.correctAnswer"
        placeholder="Correct answer"
        class="w-full p-2 border rounded"
      />
            </div>
            <button @click="addQuestion" type="button" class="btn btn-success">Add Question</button>
            <br>
            <button class="btn btn-success" type="submit">Save</button>
        </form>
        <router-link :to="'/'">Home</router-link>
    </div>
</template>

<script>
import {ref} from 'vue'
import {db} from '../firebase'
import {addDoc, collection} from 'firebase/firestore'


export default{
    setup() {
        const questions = ref([])
        const title = ref("")
        const topic = ref("")
        const difficulty = ref(null)
        const addQuestion = () => {
            questions.value.push({
                question: "",
                options: ["", "", ""],
                correctAnswer: ""
            })
        }

        const createQuizz = async () => {
            await addDoc(collection(db, 'Quizzes'), {
                title: title.value,
                topic: topic.value,
                difficulty: difficulty.value,
                questions: questions.value
            })
            title.value = ""
            topic.value = ""
            difficulty.value = null
            questions.value = []

        }

        return {
            questions,
            title,
            topic,
            difficulty,
            addQuestion,
            createQuizz
        }
    }
}

</script>