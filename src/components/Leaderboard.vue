<template>
    <div class="leaderboard-container">
        <div class="leaderboard-tabs">
            <button 
                @click="activeTab = 'global'"
                :class="{ active: activeTab === 'global' }"
                class="tab-button"
            >
                Global Leaderboard
            </button>
            <button 
                @click="activeTab = 'quiz'"
                :class="{ active: activeTab === 'quiz' }"
                class="tab-button"
            >
                Quiz Leaderboards
            </button>
        </div>

        <!-- Global Leaderboard -->
        <div v-if="activeTab === 'global'" class="leaderboard-section">
            <h2 class="section-title">Top Performers</h2>
            <div class="leaderboard-list">
                <div v-for="(user, index) in globalLeaderboard" :key="user.id" class="leaderboard-item">
                    <div class="rank" :class="{'top-three': index < 3}">
                        #{{ index + 1 }}
                    </div>
                    <div class="user-info">
                        <span class="username">{{ user.displayName }}</span>
                        <span class="total-score">Total Score: {{ user.totalScore }}</span>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <span class="label">Quizzes</span>
                            <span class="value">{{ user.quizzesTaken }}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Avg. Score</span>
                            <span class="value">{{ Math.round(user.averageScore) }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quiz-specific Leaderboards -->
        <div v-else class="leaderboard-section">
            <div class="quiz-selector">
                <label for="quizSelect">Select Quiz:</label>
                <select v-model="selectedQuiz" id="quizSelect" class="quiz-select">
                    <option value="">Choose a quiz</option>
                    <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                        {{ quiz.title }}
                    </option>
                </select>
            </div>

            <div v-if="selectedQuiz" class="quiz-leaderboard">
                <h2 class="section-title">{{ getQuizTitle(selectedQuiz) }} - Top Scores</h2>
                <div class="leaderboard-list">
                    <div v-for="(score, index) in quizLeaderboard" :key="score.id" class="leaderboard-item">
                        <div class="rank" :class="{'top-three': index < 3}">
                            #{{ index + 1 }}
                        </div>
                        <div class="user-info">
                            <span class="username">{{ score.displayName }}</span>
                            <span class="score">{{ score.score }}/{{ score.totalQuestions }}</span>
                        </div>
                        <div class="percentage">
                            {{ Math.round((score.score / score.totalQuestions) * 100) }}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { db } from '../firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'

export default {
    name: 'QuizLeaderboard',
    setup() {
        const activeTab = ref('global')
        const globalLeaderboard = ref([])
        const quizLeaderboard = ref([])
        const quizzes = ref([])
        const selectedQuiz = ref('')

        const loadGlobalLeaderboard = async () => {
            const q = query(
                collection(db, 'users'),
                orderBy('totalScore', 'desc'),
                limit(10)
            )
            const querySnapshot = await getDocs(q)
            globalLeaderboard.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        }

        const loadQuizzes = async () => {
            const querySnapshot = await getDocs(collection(db, 'Quizzes'))
            quizzes.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        }

        const loadQuizLeaderboard = async (quizId) => {
            if (!quizId) return
            
            try {
                // First try with the indexed query
                const q = query(
                    collection(db, 'quiz_results'),
                    where('quizId', '==', quizId),
                    orderBy('score', 'desc'),
                    limit(10)
                )
                const querySnapshot = await getDocs(q)
                quizLeaderboard.value = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            } catch (error) {
                if (error.code === 'failed-precondition') {
                    // Fallback: Get all results for this quiz and sort them in memory
                    const q = query(
                        collection(db, 'quiz_results'),
                        where('quizId', '==', quizId)
                    )
                    const querySnapshot = await getDocs(q)
                    const results = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    // Sort in memory and take top 10
                    quizLeaderboard.value = results
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 10)
                } else {
                    console.error("Error loading leaderboard:", error)
                    quizLeaderboard.value = []
                }
            }
        }

        const getQuizTitle = (quizId) => {
            const quiz = quizzes.value.find(q => q.id === quizId)
            return quiz ? quiz.title : ''
        }

        watch(selectedQuiz, (newQuizId) => {
            if (newQuizId) {
                loadQuizLeaderboard(newQuizId)
            }
        })

        onMounted(() => {
            loadGlobalLeaderboard()
            loadQuizzes()
        })

        return {
            activeTab,
            globalLeaderboard,
            quizLeaderboard,
            quizzes,
            selectedQuiz,
            getQuizTitle
        }
    }
}
</script>

<style scoped>
.leaderboard-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 2rem;
}

.leaderboard-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.tab-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius);
    background-color: #f8f9fa;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-button.active {
    background-color: var(--primary-color);
    color: white;
}

.section-title {
    color: var(--secondary-color);
    margin-bottom: 1.5rem;
}

.leaderboard-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.leaderboard-item {
    background-color: white;
    border-radius: var(--border-radius);
    padding: 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rank {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--text-color);
    padding: 0.5rem 1rem;
    background-color: #f8f9fa;
    border-radius: var(--border-radius);
}

.rank.top-three {
    background-color: var(--primary-color);
    color: white;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.username {
    font-weight: 500;
    color: var(--secondary-color);
}

.total-score, .score {
    font-size: 0.9rem;
    color: var(--text-color);
}

.stats {
    display: flex;
    gap: 1rem;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.label {
    font-size: 0.8rem;
    color: var(--text-color);
}

.value {
    font-weight: 500;
    color: var(--primary-color);
}

.quiz-selector {
    margin-bottom: 2rem;
}

.quiz-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    font-size: 1rem;
    margin-top: 0.5rem;
}

.percentage {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--primary-color);
}

@media (max-width: 768px) {
    .leaderboard-container {
        padding: 0 1rem;
    }

    .leaderboard-tabs {
        flex-direction: column;
    }

    .leaderboard-item {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .stats {
        justify-content: center;
    }

    .rank {
        margin: 0 auto;
    }
}
</style> 