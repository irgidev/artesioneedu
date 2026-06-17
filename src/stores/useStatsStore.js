import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';

// Get or create anonymous user ID from cookie
function getOrCreateUserId() {
  const existing = storage.get('userId');
  if (existing) return existing;
  
  const newId = 'anon_' + generateId();
  storage.set('userId', newId);
  return newId;
}

const useStatsStore = create(
  persist(
    (set, get) => ({
      userId: getOrCreateUserId(),
      createdAt: new Date().toISOString(),
      stats: {
        totalQuizzesCompleted: 0,
        totalQuestionsAnswered: 0,
        totalCorrect: 0,
        averageAccuracy: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalTimeSpent: 0,
        lastQuizDate: null,
      },
      history: [],
      preferences: {
        showTimer: true,
        showExplanationImmediately: true,
        darkMode: false,
      },

      // Add completed quiz to history
      addQuizResult: (result) => {
        const state = get();
        const quizId = result.id || generateId();
        const newHistory = [
          {
            id: quizId,
            type: result.type, // 'uas' | 'bab'
            subject: result.subject,
            bab: result.bab || null,
            date: new Date().toISOString(),
            score: result.accuracy,
            correct: result.correct,
            total: result.total,
            timeSpent: result.timeSpent || 0,
            answers: result.reviewed || [],
          },
          ...state.history,
        ];

        // Update streak
        const today = new Date().toDateString();
        const lastQuiz = state.stats.lastQuizDate
          ? new Date(state.stats.lastQuizDate).toDateString()
          : null;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak = state.stats.currentStreak;
        if (lastQuiz === today) {
          // Same day, no change
        } else if (lastQuiz === yesterdayStr) {
          newStreak += 1;
        } else if (lastQuiz !== today) {
          newStreak = 1;
        }

        const totalCorrect = state.stats.totalCorrect + result.correct;
        const totalAnswered = state.stats.totalQuestionsAnswered + result.total;
        const avgAcc = Math.round((totalCorrect / totalAnswered) * 100);

        set({
          history: newHistory.slice(0, 100), // Keep last 100 quizzes
          stats: {
            ...state.stats,
            totalQuizzesCompleted: state.stats.totalQuizzesCompleted + 1,
            totalQuestionsAnswered: totalAnswered,
            totalCorrect: totalCorrect,
            averageAccuracy: avgAcc,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.stats.longestStreak),
            totalTimeSpent: state.stats.totalTimeSpent + (result.timeSpent || 0),
            lastQuizDate: new Date().toISOString(),
          },
        });

        return quizId;
      },

      // Update preferences
      updatePreferences: (prefs) => {
        set({
          preferences: { ...get().preferences, ...prefs },
        });
      },

      // Get stats for specific chapter
      getChapterStats: (babNumber) => {
        const { history } = get();
        return history.filter((h) => h.bab === babNumber);
      },

      // Reset all data
      resetAllData: () => {
        set({
          stats: {
            totalQuizzesCompleted: 0,
            totalQuestionsAnswered: 0,
            totalCorrect: 0,
            averageAccuracy: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalTimeSpent: 0,
            lastQuizDate: null,
          },
          history: [],
        });
      },

      // Export data as JSON
      exportData: () => {
        const state = get();
        return JSON.stringify({
          userId: state.userId,
          stats: state.stats,
          history: state.history,
          preferences: state.preferences,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },

      // Import data from JSON backup
      importData: (jsonString) => {
        const current = get();
        try {
          const parsed = JSON.parse(jsonString);
          if (!parsed || typeof parsed !== 'object') {
            throw new Error('Invalid backup format');
          }

          const importedStats = parsed.stats || current.stats;
          const importedHistory = Array.isArray(parsed.history)
            ? parsed.history
            : current.history;
          const importedPreferences = parsed.preferences
            ? { ...current.preferences, ...parsed.preferences }
            : current.preferences;

          // Validate history entries minimally
          const validHistory = importedHistory.filter(
            (h) =>
              h &&
              typeof h.id === 'string' &&
              typeof h.score === 'number' &&
              typeof h.correct === 'number' &&
              typeof h.total === 'number'
          );

          set({
            stats: importedStats,
            history: validHistory,
            preferences: importedPreferences,
          });

          return { success: true, count: validHistory.length };
        } catch (error) {
          console.error('Import failed:', error);
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'artesioneedu-stats', // localStorage key
      version: 1,
    }
  )
);

export default useStatsStore;
