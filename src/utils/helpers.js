// Shuffle array (Fisher-Yates)
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function normalizeAnswer(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// Calculate quiz score
export function calculateScore(answers, questions) {
  const answerMap = Object.fromEntries(
    answers.map((ans) => [ans.questionId, ans.selected])
  );

  let correct = 0;
  const reviewed = questions.map((question) => {
    const selected = answerMap[question.id] || null;
    const isShortAnswer = question.type === 'short_answer';

    const isCorrect = isShortAnswer
      ? normalizeAnswer(selected) === normalizeAnswer(question.correctAnswer)
      : selected === question.correctAnswer;

    if (isCorrect) correct++;
    return {
      questionId: question.id,
      type: question.type ?? 'multiple_choice',
      selected,
      answeredAt: null,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      question: question.question,
      options: question.options,
      bab: question.bab ?? null,
      babTitle: question.babTitle ?? null,
      difficulty: question.difficulty ?? null,
      tags: question.tags ?? [],
    };
  });

  return {
    correct,
    total: questions.length,
    accuracy: Math.round((correct / questions.length) * 100),
    reviewed,
  };
}

// Format time in seconds to MM:SS
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format date to locale string
export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Format relative time (e.g., "2 jam yang lalu")
export function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDate(dateString);
}

// Get feedback message based on score
export function getFeedbackMessage(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { emoji: '🏆', title: 'Sempurna!', message: 'Luar biasa! Kamu menguasai materi ini dengan sangat baik!' };
  if (pct >= 75) return { emoji: '🎉', title: 'Bagus Sekali!', message: 'Kerja bagus! Pemahaman kamu sudah solid.' };
  if (pct >= 60) return { emoji: '💪', title: 'Cukup Bagus!', message: 'Tidak burus! Terus latih agar lebih baik lagi.' };
  if (pct >= 40) return { emoji: '📚', title: 'Perlu Belajar Lagi', message: 'Jangan menyerah! Review kembali materinya ya.' };
  return { emoji: '🔥', title: 'Semangat!', message: 'Setiap kesempatan adalah belajar. Coba lagi!' };
}

// Get color class for accuracy
export function getAccuracyColor(accuracy) {
  if (accuracy >= 80) return 'text-success';
  if (accuracy >= 60) return 'text-warning';
  if (accuracy >= 40) return 'text-orange-500';
  return 'text-danger';
}

// Get background color class for accuracy
export function getAccuracyBgColor(accuracy) {
  if (accuracy >= 80) return 'bg-success/10 text-success';
  if (accuracy >= 60) return 'bg-warning/10 text-warning';
  if (accuracy >= 40) return 'bg-orange-500/10 text-orange-500';
  return 'bg-danger/10 text-danger';
}
