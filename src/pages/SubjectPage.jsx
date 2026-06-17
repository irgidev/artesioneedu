import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, List, Sparkles } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useStatsStore from '../stores/useStatsStore';
import { subjects } from '../data/subjects';
import { quizUAS } from '../data/psd/quiz-uas.js';
import { psdChapters } from '../data/psd/chapters.js';

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const history = useStatsStore((s) => s.history);

  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">Mata kuliah tidak ditemukan</p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
            Kembali
          </Button>
        </div>
      </PageContainer>
    );
  }

  // Get subject stats
  const subjectHistory = history.filter((h) => h.subject === subjectId);
  const totalQuizzes = subjectHistory.length;
  const bestScore =
    totalQuizzes > 0
      ? Math.max(...subjectHistory.map((h) => h.score))
      : null;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {subject.name}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {subject.totalChapters} BAB • ~{subject.totalQuestions} soal
          </p>
        </div>
      </div>

      {/* Subject Info Card */}
      <Card className={`mb-6 bg-gradient-to-br ${subject.coverGradient} text-white border-none`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{subject.icon}</span>
          <div>
            <h2 className="font-bold text-lg">{subject.shortName}</h2>
            <p className="text-white/70 text-sm">{subject.description}</p>
          </div>
        </div>
        
        {totalQuizzes > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/20">
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-wider">
                Total Latihan
              </p>
              <p className="font-bold text-lg">{totalQuizzes}</p>
            </div>
            {bestScore !== null && (
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-wider">
                Skor Terbaik
                </p>
                <p className="font-bold text-lg">{bestScore}%</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Mode Selection */}
      <section className="space-y-3 stagger-children">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Pilih Mode Latihan
        </h2>

        {/* UAS Mode */}
        <Card interactive padding="p-5" onClick={() => navigate(`/quiz/uas/${subjectId}`)}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-danger/10 to-danger/5 flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7 text-danger" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🔥 Latihan Soal UAS
                <Badge variant="danger" size="sm">Ujian</Badge>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Campuran semua BAB • Simulasi ujian sesungguhnya
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" size="sm">
                  Semua BAB
                </Badge>
                <Badge variant="default" size="sm">
                  {quizUAS.length} soal
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Per BAB Mode */}
        <Card interactive padding="p-5" onClick={() => navigate(`/chapters/${subjectId}`)}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
              <List className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                📖 Latihan Per BAB
                <Badge variant="primary" size="sm">Fokus</Badge>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Pilih BAB spesifik • Fokus mendalam per topik
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" size="sm">
                  <BookOpen className="w-3 h-3 mr-0.5" />
                  {subject.totalChapters} BAB
                </Badge>
                <Badge variant="default" size="sm">
                  {psdChapters[0]?.questionCount ?? 50} soal/BAB
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Tips */}
      <div className="mt-6 p-4 rounded-2xl bg-warning/5 dark:bg-warning/10 border border-warning/20">
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          💡 <strong>Tip:</strong> Mulai dari latihan per BAB untuk memahami setiap 
          topik, lalu coba latihan UAS untuk simulasi ujian sesungguhnya!
        </p>
      </div>
    </PageContainer>
  );
}
