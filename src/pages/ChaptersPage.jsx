import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { DifficultyBadge } from '../components/ui/Badge';
import useStatsStore from '../stores/useStatsStore';
import { psdChapters } from '../data/psd/chapters';

export default function ChaptersPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const history = useStatsStore((s) => s.history);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/subject/${subjectId}`)}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Pilih BAB
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {psdChapters.length} Bab tersedia
          </p>
        </div>
      </div>

      {/* Chapter List */}
      <div className="space-y-3 stagger-children">
        {psdChapters.map((chapter) => {
          // Get stats for this chapter
          const chapterHistory = history.filter(
            (h) => h.bab === chapter.number && h.subject === subjectId
          );
          const lastScore =
            chapterHistory.length > 0
              ? chapterHistory[0].score
              : null;

          return (
            <Card
              key={chapter.id}
              interactive
              padding="p-4"
              onClick={() =>
                navigate(`/quiz/bab/${subjectId}/${chapter.number}`)
              }
            >
              <div className="flex items-center gap-3.5">
                {/* Chapter number */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${chapter.color}15`,
                    color: chapter.color,
                  }}
                >
                  {chapter.number}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {chapter.description}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <DifficultyBadge difficulty={chapter.difficulty} />
                    <Badge variant="default" size="sm">
                      <BookOpen className="w-3 h-3 mr-0.5" />
                      {chapter.questionCount} soal
                    </Badge>
                    
                    {lastScore !== null && (
                      <Badge
                        variant={
                          lastScore >= 70
                            ? 'success'
                            : lastScore >= 50
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        Terakhir: {lastScore}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
