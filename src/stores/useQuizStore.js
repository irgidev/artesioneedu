import { create } from 'zustand';

const useQuizStore = create((set, get) => ({
  // Quiz configuration
  quizType: null, // 'uas' | 'bab'
  subjectId: null,
  babNumber: null,
  
  // Questions
  questions: [],
  currentIndex: 0,
  
  // Answers - maps questionId -> selected option id
  answers: {},
  
  // Status
  isStarted: false,
  isCompleted: false,
  startTime: null,
  endTime: null,
  
  // Timer
  elapsedTime: 0,

  // Initialize quiz
  initQuiz: ({ type, subjectId, babNumber, questions }) => {
    set({
      quizType: type,
      subjectId,
      babNumber,
      questions,
      currentIndex: 0,
      answers: {},
      isStarted: true,
      isCompleted: false,
      startTime: Date.now(),
      endTime: null,
      elapsedTime: 0,
    });
  },

  // Answer a question
  answerQuestion: (questionId, optionId) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: {
          selected: optionId,
          answeredAt: Date.now(),
        },
      },
    }));
  },

  // Navigate to specific question
  goToQuestion: (index) => {
    const state = get();
    if (index >= 0 && index < state.questions.length) {
      set({ currentIndex: index });
    }
  },

  // Go to next question
  nextQuestion: () => {
    const state = get();
    if (state.currentIndex < state.questions.length - 1) {
      set({ currentIndex: state.currentIndex + 1 });
    }
  },

  // Go to previous question
  prevQuestion: () => {
    const state = get();
    if (state.currentIndex > 0) {
      set({ currentIndex: state.currentIndex - 1 });
    }
  },

  // Complete the quiz
  completeQuiz: () => {
    const state = get();
    set({
      isCompleted: true,
      endTime: Date.now(),
      elapsedTime: Math.floor((Date.now() - state.startTime) / 1000),
    });
  },

  // Update timer
  updateElapsedTime: () => {
    const state = get();
    if (state.isStarted && !state.isCompleted) {
      set({
        elapsedTime: Math.floor((Date.now() - state.startTime) / 1000),
      });
    }
  },

  // Reset quiz
  resetQuiz: () => {
    set({
      quizType: null,
      subjectId: null,
      babNumber: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      isStarted: false,
      isCompleted: false,
      startTime: null,
      endTime: null,
      elapsedTime: 0,
    });
  },

  // Get current question
  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.currentIndex] || null;
  },

  // Get answer for current question
  getCurrentAnswer: () => {
    const state = get();
    const currentQ = state.questions[state.currentIndex];
    return currentQ ? state.answers[currentQ.id] : null;
  },

  // Check if all questions are answered
  isAllAnswered: () => {
    const state = get();
    return state.questions.every((q) => state.answers[q.id]);
  },

  // Get progress percentage
  getProgress: () => {
    const state = get();
    return Math.round(((state.currentIndex + 1) / state.questions.length) * 100);
  },

  // Get answered count
  getAnsweredCount: () => {
    const state = get();
    return Object.keys(state.answers).length;
  },
}));

export default useQuizStore;
