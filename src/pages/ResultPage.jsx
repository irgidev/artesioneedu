import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  RotateCcw,
  Home,
  BarChart3,
  Target,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Confetti from '../components/ui/Confetti';
import useQuizStore from '../stores/useQuizStore';
import useStatsStore from '../stores/useStatsStore';
import { psdChapters } from '../data/psd/chapters';
import { getFeedbackMessage, formatTime } from '../utils/helpers';
import MathText from '../components/ui/MathText';

// Animated score circle component
function ScoreCircle({ score, total }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = Math.round((score / total) * 100);

  const getColor = () => {
    if (percentage >= 80) return '#06D6A0';
    if (percentage >= 60) return '#FFD166';
    if (percentage >= 40) return '#F97316';
    return '#EF476F';
  };

  const color = getColor();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = percentage / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= percentage) {
        setAnimatedScore(percentage);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [percentage]);

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black" style={{ color }}>
          {animatedScore}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">persen</span>
      </div>
    </div>
  );
}

function ReviewItem({ answer, index, isOpen, onToggle }) {
  const isShortAnswer = answer.type === 'short_answer';
  const selectedOption = answer.options?.find((o) => o.id === answer.selected);
  const correctOption = answer.options?.find((o) => o.id === answer.correctAnswer);

  return (
    <div
      className={`
        rounded-xl border transition-all duration-200 overflow-hidden
        ${answer.isCorrect
          ? 'border-success/20 bg-success/[0.02] dark:bg-success/[0.03]'
          : 'border-danger/20 bg-danger/[0.02] dark:bg-danger/[0.03]'
        }
      `}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-3.5 text-left"
      >
        <span
          className={`
            w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
            ${answer.isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}
          `}
        >
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${isOpen ? '' : 'line-clamp-2'}`}>
            <MathText text={answer.question} />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge
              variant={answer.isCorrect ? 'success' : 'danger'}
              size="sm"
            >
              {answer.isCorrect ? '✅ Benar' : '❌ Salah'}
            </Badge>
            {isShortAnswer && (
              <Badge variant="warning" size="sm">Isian</Badge>
            )}
            {answer.bab && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                BAB {answer.bab}
              </span>
            )}
          </div>
        </div>

        <span className="flex-shrink-0 mt-0.5 text-gray-400 dark:text-gray-500">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {isOpen && (
        <div className="px-3.5 pb-3.5 space-y-3 animate-fade-in-up">
          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Selected answer */}
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-semibold mb-1">
              Jawaban Kamu
            </p>
            <div
              className={`
                p-3 rounded-xl text-sm flex items-start gap-2.5
                ${answer.isCorrect
                  ? 'bg-success/10 text-success border border-success/20'
                  : 'bg-danger/10 text-danger border border-danger/20'
                }
              `}
            >
              {answer.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              <span className="break-words">
                {isShortAnswer ? (
                  answer.selected || ' (tidak ada jawaban)'
                ) : (
                  <>
                    <span className="font-bold uppercase">{answer.selected}</span>
                    {selectedOption ? (
                      <>
                        {'. '}
                        <MathText text={selectedOption.text} />
                      </>
                    ) : (
                      ' (tidak ada jawaban)'
                    )}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Correct answer when wrong */}
          {!answer.isCorrect && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-semibold mb-1">
                Jawaban Benar
              </p>
              <div className="p-3 rounded-xl text-sm bg-success/10 text-success border border-success/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="break-words">
                  {isShortAnswer ? (
                    answer.correctAnswer
                  ) : (
                    <>
                      {correctOption ? (
                        <>
                          <span className="font-bold uppercase">{correctOption.id}</span>
                          {'. '}
                          <MathText text={correctOption.text} />
                        </>
                      ) : (
                        answer.correctAnswer.toUpperCase()
                      )}
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Explanation */}
          {answer.explanation && (
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-white">Penjelasan:</span>{' '}
              <MathText text={answer.explanation} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AnswerReview({ answers }) {
  const [openSet, setOpenSet] = useState(() => new Set());

  if (!answers || answers.length === 0) return null;

  const allOpen = openSet.size === answers.length;

  const toggleOne = (idx) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setOpenSet(allOpen ? new Set() : new Set(answers.map((_, idx) => idx)));
  };

  return (
    <Card padding="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Review Jawaban
        </h3>
        <button
          onClick={toggleAll}
          className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
        >
          {allOpen ? 'Tutup Semua' : 'Buka Semua'}
        </button>
      </div>

      <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 pb-1">
        {answers.map((answer, idx) => (
          <ReviewItem
            key={idx}
            answer={answer}
            index={idx}
            isOpen={openSet.has(idx)}
            onToggle={() => toggleOne(idx)}
          />
        ))}
      </div>
    </Card>
  );
}

export default function ResultPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const quizStore = useQuizStore();
  const history = useStatsStore((s) => s.history);

  const result = useMemo(() => {
    if (!quizId) return history[0] || null;
    return history.find((h) => h.id === quizId) || history[0] || null;
  }, [quizId, history]);

  const feedback = result ? getFeedbackMessage(result.correct, result.total) : null;
  const isUAS = result?.type === 'uas';
  const wrongCount = result ? result.total - result.correct : 0;
  const percentage = result ? Math.round((result.correct / result.total) * 100) : 0;

  // Analyze weak topics by counting wrong answers per BAB title
  const weakTopics = useMemo(() => {
    if (!result) return [];
    const counts = {};
    (result.answers || [])
      .filter((a) => !a.isCorrect && a.babTitle)
      .forEach((a) => {
        counts[a.babTitle] = (counts[a.babTitle] || 0) + 1;
      });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [result]);

  // UAS readiness: score per BAB in percentage
  const uasReadiness = useMemo(() => {
    if (!result || !isUAS) return [];
    const totals = {};
    const corrects = {};
    (result.answers || []).forEach((a) => {
      if (!a.bab) return;
      totals[a.bab] = (totals[a.bab] || 0) + 1;
      if (a.isCorrect) {
        corrects[a.bab] = (corrects[a.bab] || 0) + 1;
      }
    });
    return Object.entries(totals)
      .map(([bab, total]) => {
        const correct = corrects[bab] || 0;
        const pct = Math.round((correct / total) * 100);
        const chapter = psdChapters.find((c) => c.number === Number(bab));
        return {
          bab: Number(bab),
          title: chapter?.title || `BAB ${bab}`,
          color: chapter?.color || '#6366F1',
          correct,
          total,
          percentage: pct,
        };
      })
      .sort((a, b) => a.bab - b.bab);
  }, [result, isUAS]);

  if (!result) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Hasil latihan tidak ditemukan.</p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </PageContainer>
    );
  }

  const showConfetti = percentage >= 80;

  const handleRetry = () => {
    quizStore.resetQuiz();
    if (isUAS) {
      navigate(`/quiz/uas/${result.subject}`);
    } else {
      navigate(`/quiz/bab/${result.subject}/${result.bab}`);
    }
  };

  return (
    <PageContainer>
      {showConfetti && <Confetti />}

      <div className="stagger-children space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hasil Latihan</h1>
        </div>

        {/* Score Circle */}
        <Card padding="p-8 text-center">
          <ScoreCircle score={result.correct} total={result.total} />

          <div className="mt-6">
            <span className="text-4xl mb-2 block">{feedback.emoji}</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {feedback.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] mx-auto">
              {feedback.message}
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-success/5 dark:bg-success/10 rounded-xl p-3">
              <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1" />
              <p className="text-lg font-bold text-success">{result.correct}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Benar</p>
            </div>
            <div className="bg-danger/5 dark:bg-danger/10 rounded-xl p-3">
              <XCircle className="w-5 h-5 text-danger mx-auto mb-1" />
              <p className="text-lg font-bold text-danger">{wrongCount}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Salah</p>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-3">
              <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-primary">
                {formatTime(result.timeSpent)}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Waktu</p>
            </div>
          </div>
        </Card>

        {/* UAS Readiness per BAB */}
        {isUAS && uasReadiness.length > 0 && (
          <Card padding="p-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Skor Kesiapan Pemahaman per BAB
            </h3>
            <div className="space-y-3">
              {uasReadiness.map((item) => (
                <div key={item.bab}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {item.title}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: item.color }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {item.correct} benar dari {item.total} soal
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Weak Topics */}
        {weakTopics.length > 0 && (
          <Card padding="p-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-warning" />
              Topik yang Perlu Diperkuat
            </h3>
            <div className="space-y-2">
              {weakTopics.map(([topic, count], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-warning/5 dark:bg-warning/10"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">📖</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{topic}</span>
                  </div>
                  <Badge variant="warning" size="sm">
                    {count} salah
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Answer Review */}
        <AnswerReview answers={result.answers} />

        {/* Action buttons */}
        <div className="space-y-3 pb-4">
          <Button fullWidth size="lg" icon={RotateCcw} onClick={handleRetry}>
            Ulangi Quiz
          </Button>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={Home}
              iconPosition="left"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Beranda
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={BarChart3}
              iconPosition="left"
              onClick={() => navigate('/stats')}
              className="flex-1"
            >
              Statistik
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
