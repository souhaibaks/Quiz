<template>
<div class="quiz-list">
    <div class="list-header">
        <h1 class="list-title">List of Quizzes</h1>
        <router-link 
            v-if="isAdmin" 
            to="/CreateQuizz" 
            class="create-quiz-btn">
            Create New Quiz
        </router-link>
    </div>
    <div v-for="(quizz, index) in quizzes" :key="index" class="quiz-card">
        <router-link :to="{name:'quizdetail', params: {id:quizz.id}}" class="quiz-link">
            <div class="quiz-info">
                <h2 class="quiz-title">{{ quizz.title }}</h2>
                <p class="quiz-meta">Topic: {{ quizz.topic }}</p>
                <p class="quiz-meta">Difficulty: {{ quizz.difficulty }}</p>
            </div>
        </router-link>
        
        <div v-if="isAdmin" class="admin-actions">
            <button @click="editQuiz(quizz.id)" class="btn btn-edit">
                <span class="icon">✏️</span> Edit
            </button>
            <button @click="deleteQuiz(quizz.id)" class="btn btn-delete">
                <span class="icon">🗑️</span> Delete
            </button>
        </div>
    </div>
</div>

</template>

<script>
import {db} from '../firebase'
import {collection, getDocs, deleteDoc, doc, getDoc} from 'firebase/firestore'
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default {
    setup() {
        const quizzes = ref([])
        const isAdmin = ref(false)
        const router = useRouter()

        const get_quiz = async() => {
            const datas = await getDocs(collection(db, "Quizzes"))
            quizzes.value = []
            datas.forEach((doc) => {
                quizzes.value.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
        }

        const checkAdminStatus = async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid))
                isAdmin.value = userDoc.data()?.admin ?? false
            } else {
                isAdmin.value = false
            }
        }

        const editQuiz = (quizId) => {
            router.push({ name: 'editQuiz', params: { id: quizId } })
        }

        const deleteQuiz = async (quizId) => {
            if (confirm('Are you sure you want to delete this quiz?')) {
                try {
                    await deleteDoc(doc(db, "Quizzes", quizId))
                    await get_quiz()
                } catch (error) {
                    console.error("Error deleting quiz:", error)
                }
            }
        }

        onMounted(() => {
            get_quiz()
            onAuthStateChanged(auth, checkAdminStatus)
        })

        return {
            quizzes,
            isAdmin,
            editQuiz,
            deleteQuiz
        }
    }
}
</script>

<style scoped>
.quiz-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.list-title {
    color: var(--primary-color);
    margin: 0;
}

.create-quiz-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius);
    transition: background-color 0.3s ease;
}

.create-quiz-btn:hover {
    background-color: var(--secondary-color);
}

.quiz-card {
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
    overflow: hidden;
}

.quiz-link {
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 1.5rem;
}

.quiz-info {
    margin-bottom: 1rem;
}

.quiz-title {
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
}

.quiz-meta {
    color: var(--text-color);
    margin: 0.25rem 0;
}

.admin-actions {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-top: 1px solid #eee;
}

.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.btn-edit {
    background-color: #f1c40f;
    color: white;
}

.btn-delete {
    background-color: #e74c3c;
    color: white;
}

.btn:hover {
    opacity: 0.9;
}

.icon {
    font-size: 1rem;
}

@media (max-width: 768px) {
    .quiz-list {
        padding: 1rem;
    }

    .admin-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>