import { Question } from "@/data/questions"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Types for API responses
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface QuestionsResponse extends ApiResponse<Question[]> {}

interface QuestionResponse extends ApiResponse<Question> {}

// Update Elo ratings for a game result
export async function updateEloRatings(title1Id: number, title2Id: number, winner: 0 | 1): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/update-elo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title1_id: title1Id,
        title2_id: title2Id,
        winner: winner
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Elo update successful:', result)
    return true
  } catch (error) {
    console.error('❌ Error updating Elo ratings:', error)
    return false
  }
}

// Fetch function to get questions
export async function fetchQuestions(count: number = 10): Promise<Question[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions?count=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: QuestionsResponse = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch questions')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching questions:', error)
    // Fallback to local questions if API fails
    return getLocalQuestions(count)
  }
}

// Fetch a single question by ID
export async function fetchQuestionById(pairId: string): Promise<Question | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${pairId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: QuestionResponse = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch question')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching question:', error)
    return null
  }
}

// Update question selection count
export async function updateQuestionSelection(pairId: string, option: 'A' | 'B'): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${pairId}/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ option }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<boolean> = await response.json()
    return result.success
  } catch (error) {
    console.error('Error updating question selection:', error)
    return false
  }
}

// Fallback function to get local questions
function getLocalQuestions(count: number): Question[] {
  // Import the local questions as fallback
  const { questions } = require('@/data/questions')
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Example API endpoint structure (for reference)
export const API_ENDPOINTS = {
  // GET /api/questions?count=10
  // Returns: { success: true, data: Question[], message?: string }
  GET_QUESTIONS: `${API_BASE_URL}/questions`,
  
  // GET /api/questions/:pairId
  // Returns: { success: true, data: Question, message?: string }
  GET_QUESTION: `${API_BASE_URL}/questions/:pairId`,
  
  // POST /api/questions/:pairId/select
  // Body: { option: 'A' | 'B' }
  // Returns: { success: true, data: boolean, message?: string }
  UPDATE_SELECTION: `${API_BASE_URL}/questions/:pairId/select`,
  
  // POST /update-elo
  // Body: { title1_id: number, title2_id: number, winner: 0 | 1 }
  // Returns: Elo update result
  UPDATE_ELO: `${API_BASE_URL}/update-elo`,
}
