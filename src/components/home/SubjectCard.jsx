import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import useStatsStore from '../../stores/useStatsStore';

export default function SubjectCard({ subject }) {
  const navigate = useNavigate();
  const history = useStatsStore((s) => s.history);

  // Calculate subject-specific stats
  const subjectHistory = history.filter(
    (h) => h.subject === subject.id
  );
  const totalQuizzes = subjectHistory.length;
  const lastAccuracy =
    totalQuizzes > 0
      ? Math.round(
          (subjectHistory.reduce((acc, h) => acc + h.score * h.total, 0) /
            subjectHistory.reduce((acc, h) => acc + h.total, 0))
        )
      : null;

  return (
    <Card interactive padding="p-5" onClick={() => navigate(`/subject/${subject.id}`)}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${subject.color}20, ${subject.color}10)`,
          }}
        >
          {subject.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">
            {subject.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {subject.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <BookOpen className="w-3.5 h-3.5" />
              {subject.totalChapters} BAB
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              ~{subject.totalQuestions} soal
            </span>
            {totalQuizzes > 0 && (
              <>
                <Badge variant={lastAccuracy >= 70 ? 'success' : lastAccuracy >= 50 ? 'warning' : 'danger'} size="sm" dot>
                  {totalQuizzes}x latihan
                </Badge>
                {lastAccuracy !== null && (
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {lastAccuracy}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" />
      </div>
    </Card>
  );
}
