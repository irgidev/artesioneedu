import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Flag,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { DifficultyBadge } from '../components/ui/Badge';
import useQuizStore from '../stores/useQuizStore';
import useStatsStore from '../stores/useStatsStore';
import useUIStore from '../stores/useUIStore';
import { getChapterQuestions, getUASQuestions } from '../data/psd';
import { shuffleArray, calculateScore, formatTime } from '../utils/helpers';
import { playCorrectSound, playWrongSound } from '../utils/sound';
import { useTimer } from '../hooks/index';
import MathText from '../components/ui/MathText';

export default function QuizPage() {
  const { type, subjectId, babNum } = useParams();
  const navigate = useNavigate();

  // Quiz state selectors
  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const answers = useQuizStore((s) => s.answers);
  const isStarted = useQuizStore((s) => s.isStarted);
  const isCompleted = useQuizStore((s) => s.isCompleted);
  const elapsedTime = useQuizStore((s) => s.elapsedTime);
  const quizType = useQuizStore((s) => s.quizType);
  const quizSubjectId = useQuizStore((s) => s.subjectId);
  const quizBabNumber = useQuizStore((s) => s.babNumber);

  // Quiz action selectors
  const initQuiz = useQuizStore((s) => s.initQuiz);
  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const completeQuiz = useQuizStore((s) => s.completeQuiz);
  const updateElapsedTime = useQuizStore((s) => s.updateElapsedTime);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  const showTimer = useStatsStore((s) => s.preferences.showTimer);
  const addQuizResult = useStatsStore((s) => s.addQuizResult);
  const openModal = useUIStore((s) => s.openModal);

  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isShortAnswer = currentQuestion?.type === 'short_answer';

  // Initialize quiz on mount / when route params change
  useEffect(() => {
    const store = useQuizStore.getState();
    const parsedBab = type === 'bab' ? parseInt(babNum) : null;

    // Guard against re-initialization (e.g. StrictMode remount or stray renders)
    if (
      store.isStarted &&
      store.quizType === type &&
      store.subjectId === subjectId &&
      store.babNumber === parsedBab &&
      store.questions.length > 0
    ) {
      return;
    }

    let loadedQuestions;

    if (type === 'uas') {
      loadedQuestions = shuffleArray(getUASQuestions());
    } else if (type === 'bab') {
      const babQuestions = getChapterQuestions(parsedBab);
      loadedQuestions = shuffleArray([...babQuestions]);
    }

    if (loadedQuestions && loadedQuestions.length > 0) {
      initQuiz({
        type,
        subjectId,
        babNumber: parsedBab,
        questions: loadedQuestions,
      });
    }
  }, [type, subjectId, babNum, initQuiz]);

  // Reset local answer state
  const resetAnswerState = () => {
    setSelectedOption(null);
    setShortAnswer('');
    setIsAnswered(false);
    setIsConfirmed(false);
    setShowExplanation(false);
  };

  // Timer
  const handleTick = useCallback(() => {
    updateElapsedTime();
  }, [updateElapsedTime]);

  useTimer(isStarted && !isCompleted, handleTick);

  // Handle option select (multiple choice)
  const handleSelectOption = (optionId) => {
    if (isConfirmed || isShortAnswer) return;
    setSelectedOption(optionId);
    setIsAnswered(true);
  };

  // Handle short answer input
  const handleShortAnswerChange = (e) => {
    if (isConfirmed) return;
    const value = e.target.value;
    setShortAnswer(value);
    setIsAnswered(value.trim().length > 0);
  };

  // Confirm answer
  const handleConfirmAnswer = () => {
    if (!currentQuestion || !isAnswered) return;

    const answerValue = isShortAnswer
      ? shortAnswer.trim()
      : selectedOption;

    answerQuestion(currentQuestion.id, answerValue);
    setIsConfirmed(true);
    setShowExplanation(true);

    // Play sound effect based on correctness
    const isCorrect = isShortAnswer
      ? currentQuestion.correctAnswer.toLowerCase().trim() === answerValue.toLowerCase().trim()
      : answerValue === currentQuestion.correctAnswer;
    if (isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
  };

  // Navigation
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      nextQuestion();
      resetAnswerState();
    } else {
      // Quiz completed
      handleFinishQuiz();
    }
  };

  // Finish quiz and show results
  const handleFinishQuiz = () => {
    completeQuiz();

    // Calculate score
    const answersArray = Object.entries(answers).map(
      ([questionId, data]) => ({
        questionId,
        ...data,
      })
    );

    const result = calculateScore(answersArray, questions);

    // Save to stats store and get the generated quiz id
    const quizId = addQuizResult({
      type: quizType,
      subject: quizSubjectId,
      bab: quizBabNumber,
      correct: result.correct,
      total: result.total,
      accuracy: result.accuracy,
      timeSpent: elapsedTime,
      reviewed: result.reviewed,
    });

    // Navigate to results
    navigate(`/result/${quizId}`);
  };

  // Get option style based on state
  const getOptionStyle = (optionId) => {
    const baseClasses =
      'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-start gap-3 dark:text-gray-100';

    if (!isConfirmed) {
      // Selection mode
      if (selectedOption === optionId) {
        return `${baseClasses} border-primary bg-primary/5 shadow-md shadow-primary/10`;
      }
      return `${baseClasses} border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-gray-800`;
    }

    // After confirmation — show results
    const isCorrectOption = optionId === currentQuestion.correctAnswer;
    const isSelectedOption = optionId === selectedOption;

    if (isCorrectOption) {
      return `${baseClasses} border-success bg-success/5 shadow-sm`;
    }
    if (isSelectedOption && !isCorrectOption) {
      return `${baseClasses} border-danger bg-danger/5 shadow-sm`;
    }
    return `${baseClasses} border-gray-200 dark:border-gray-700 opacity-50`;
  };

  // Get option letter color
  const getLetterStyle = (optionId) => {
    if (!isConfirmed) {
      if (selectedOption === optionId) {
        return 'bg-primary text-white';
      }
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }

    const isCorrectOption = optionId === currentQuestion.correctAnswer;
    const isSelectedOption = optionId === selectedOption;

    if (isCorrectOption) return 'bg-success text-white';
    if (isSelectedOption && !isCorrectOption) return 'bg-danger text-white';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500';
  };

  // Render feedback text for any question type
  const renderFeedbackText = () => {
    if (isShortAnswer) {
      const isCorrect = currentQuestion.correctAnswer.toLowerCase().trim() === shortAnswer.toLowerCase().trim();
      return (
        <p className="font-semibold text-sm mb-1 dark:text-gray-100">
          {isCorrect
            ? '✅ Benar!'
            : `❌ Kurang tepat. Jawaban: ${currentQuestion.correctAnswer}`}
        </p>
      );
    }

    return (
      <p className="font-semibold text-sm mb-1 dark:text-gray-100">
        {selectedOption === currentQuestion.correctAnswer
          ? '✅ Benar!'
          : `❌ Kurang tepat. Jawaban: ${currentQuestion.correctAnswer.toUpperCase()}`}
      </p>
    );
  };

  if (!currentQuestion || questions.length === 0) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Memuat soal...</p>
        </div>
      </PageContainer>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <PageContainer noBottomPadding>
      {/* Header */}
      <div className="sticky top-14 z-30 bg-gray-50/95 dark:bg-[#0F0F1A]/95 backdrop-blur-sm -mx-4 px-4 pt-2 pb-3">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              openModal('confirm', {
                title: 'Yakin ingin keluar?',
                message: 'Progress latihan kamu akan hilang.',
                confirmText: 'Keluar',
                onConfirm: () => {
                  resetQuiz();
                  navigate(`/subject/${subjectId}`);
                },
              });
            }}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Timer */}
          <Badge variant={showTimer ? 'default' : undefined} size="md" dot>
            <Clock className="w-3.5 h-3.5 mr-1" />
            {formatTime(elapsedTime)}
          </Badge>

          {/* Progress */}
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-4" padding="p-5">
        {/* Question header */}
        <div className="flex items-start gap-2 mb-4">
          <DifficultyBadge difficulty={currentQuestion.difficulty} />
          {currentQuestion.bab && (
            <Badge variant="info" size="sm">
              BAB {currentQuestion.bab}
            </Badge>
          )}
          {isShortAnswer && (
            <Badge variant="warning" size="sm">
              Isian Singkat
            </Badge>
          )}
        </div>

        {/* Question text */}
        <MathText
          as="h2"
          className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed mb-6"
          text={currentQuestion.question}
        />

        {/* Answer area */}
        {isShortAnswer ? (
          <div className="space-y-3">
            <input
              type="text"
              value={shortAnswer}
              onChange={handleShortAnswerChange}
              disabled={isConfirmed}
              placeholder="Ketik jawaban kamu di sini..."
              className={`
                w-full p-4 rounded-xl border-2 bg-transparent
                transition-all duration-200
                ${isConfirmed
                  ? 'border-gray-200 dark:border-gray-700 opacity-70'
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                }
                text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
              `}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isConfirmed}
                className={getOptionStyle(option.id)}
              >
                {/* Option letter */}
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${getLetterStyle(option.id)}`}
                >
                  {option.id.toUpperCase()}
                </span>

                {/* Option text */}
                <span className="text-sm leading-relaxed pt-0.5">
                  <MathText text={option.text} />
                </span>

                {/* Result icon (after confirm) */}
                {isConfirmed && (
                  <span className="ml-auto flex-shrink-0">
                    {option.id === currentQuestion.correctAnswer ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : option.id === selectedOption ? (
                      <XCircle className="w-5 h-5 text-danger" />
                    ) : null}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Explanation (after answer confirmed) */}
        {showExplanation && isConfirmed && (
          <div
            className={`
              mt-4 p-4 rounded-xl animate-fade-in-up
              ${(isShortAnswer
                  ? currentQuestion.correctAnswer.toLowerCase().trim() === shortAnswer.toLowerCase().trim()
                  : selectedOption === currentQuestion.correctAnswer)
                ? 'bg-success/5 border border-success/20'
                : 'bg-warning/5 border border-warning/20'
              }
            `}
          >
            <div className="flex items-start gap-2">
              {(isShortAnswer
                ? currentQuestion.correctAnswer.toLowerCase().trim() === shortAnswer.toLowerCase().trim()
                : selectedOption === currentQuestion.correctAnswer) ? (
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
              )}
              <div>
                {renderFeedbackText()}
                <MathText
                  as="p"
                  className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed"
                  text={currentQuestion.explanation}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5 space-y-2.5">
          {!isConfirmed ? (
            <Button
              fullWidth
              size="lg"
              disabled={!isAnswered}
              onClick={handleConfirmAnswer}
            >
              Konfirmasi Jawaban
            </Button>
          ) : (
            <Button
              fullWidth
              size="lg"
              icon={
                currentIndex >= questions.length - 1
                  ? Flag
                  : ChevronRight
              }
              iconPosition="right"
              onClick={handleNext}
            >
              {currentIndex >= questions.length - 1
                ? 'Selesai'
                : 'Selanjutnya'}
            </Button>
          )}
        </div>
      </Card>

      {/* Bottom spacing for non-bottom-nav page */}
      <div className="h-8" />
    </PageContainer>
  );
}
