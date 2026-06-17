import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  Target,
  Trophy,
  Clock,
  TrendingUp,
  BookOpen,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useStatsStore from '../stores/useStatsStore';
import useUIStore from '../stores/useUIStore';
import { psdChapters } from '../data/psd/chapters';
import {
  formatTime,
  formatDate,
  formatRelativeTime,
} from '../utils/helpers';

export default function StatsPage() {
  const navigate = useNavigate();
  const stats = useStatsStore((s) => s.stats);
  const history = useStatsStore((s) => s.history);
  const resetAllData = useStatsStore((s) => s.resetAllData);
  const exportData = useStatsStore((s) => s.exportData);
  const importData = useStatsStore((s) => s.importData);
  const openModal = useUIStore((s) => s.openModal);
  const showToast = useUIStore((s) => s.showToast);

  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);

  const avgTimePerQuiz =
    stats.totalQuizzesCompleted > 0
      ? Math.round(stats.totalTimeSpent / stats.totalQuizzesCompleted)
      : 0;

  const bestScore =
    history.length > 0 ? Math.max(...history.map((h) => h.score)) : null;
  const worstScore =
    history.length > 0 ? Math.min(...history.map((h) => h.score)) : null;

  const handleReset = () => {
    openModal('confirm', {
      title: 'Reset Semua Data?',
      message:
        'Semua progress latihan dan statistik akan dihapus permanen. Tindakan ini tidak bisa dibatalkan!',
      confirmText: 'Ya, Hapus Semua',
      onConfirm: () => {
        resetAllData();
      },
    });
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `artesioneedu-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data berhasil di-export', 'success');
    } catch (e) {
      console.error('Export failed:', e);
      showToast('Gagal export data', 'error');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = importData(text);
      if (result.success) {
        showToast(`Import berhasil: ${result.count} riwayat dimuat`, 'success');
      } else {
        showToast(`Import gagal: ${result.error}`, 'error');
      }
    } catch {
      showToast('Gagal membaca file', 'error');
    } finally {
      // Reset input so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Statistik</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Progress & riwayat latihan kamu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleImportClick}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Import Data"
          >
            <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleExport}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Export Data"
          >
            <Download className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'history'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          📜 Riwayat
        </button>
      </div>

      {activeTab === 'overview' ? (
        <OverviewTab
          stats={stats}
          history={history}
          avgTimePerQuiz={avgTimePerQuiz}
          bestScore={bestScore}
          worstScore={worstScore}
          onReset={handleReset}
        />
      ) : (
        <HistoryTab history={history} navigate={navigate} />
      )}
    </PageContainer>
  );
}

function OverviewTab({
  stats,
  history,
  avgTimePerQuiz,
  bestScore,
  worstScore,
  onReset,
}) {
  // Accuracy trend data: chronological order (oldest → newest)
  const accuracyTrend = useMemo(() => {
    return history
      .slice(0, 10)
      .reverse()
      .map((h, idx) => ({
        index: idx + 1,
        date: formatDate(h.date),
        shortDate: new Date(h.date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
        }),
        score: h.score,
      }));
  }, [history]);

  // Chapter breakdown data
  const chapterData = useMemo(() => {
    const totals = {};
    history.forEach((h) => {
      if (h.bab) {
        if (!totals[h.bab]) {
          totals[h.bab] = { correct: 0, total: 0, count: 0 };
        }
        totals[h.bab].correct += h.correct;
        totals[h.bab].total += h.total;
        totals[h.bab].count += 1;
      }
    });

    return Object.entries(totals)
      .map(([bab, data]) => {
        const chapter = psdChapters.find((c) => c.number === Number(bab));
        const accuracy = Math.round((data.correct / data.total) * 100);
        return {
          bab: Number(bab),
          title: chapter?.title || `BAB ${bab}`,
          accuracy,
          attempts: data.count,
        };
      })
      .sort((a, b) => a.bab - b.bab);
  }, [history]);

  return (
    <div className="space-y-4 stagger-children">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Target}
          label="Total Latihan"
          value={stats.totalQuizzesCompleted}
          color="primary"
        />
        <StatCard
          icon={Trophy}
          label="Akurasi Rata-rata"
          value={`${stats.averageAccuracy}%`}
          color={
            stats.averageAccuracy >= 70
              ? 'success'
              : stats.averageAccuracy >= 50
              ? 'warning'
              : 'danger'
          }
        />
        <StatCard
          icon={Flame}
          label="Streak Saat Ini"
          value={`${stats.currentStreak} hari`}
          color="orange"
        />
        <StatCard
          icon={Flame}
          label="Streak Terbaik"
          value={`${stats.longestStreak} hari`}
          color="warning"
        />
        <StatCard
          icon={BookOpen}
          label="Total Soal"
          value={stats.totalQuestionsAnswered}
          color="secondary"
        />
        <StatCard
          icon={Clock}
          label="Total Waktu"
          value={formatTime(stats.totalTimeSpent)}
          color="secondary"
        />
      </div>

      {/* Score Range */}
      {(bestScore !== null || worstScore !== null) && (
        <Card padding="p-4">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Rentang Skor
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Terendah</p>
              <p className="text-xl font-bold text-danger">{worstScore}%</p>
            </div>

            <div className="flex-1 mx-4">
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
                <div
                  className="absolute h-full bg-gradient-to-r from-danger via-warning to-success rounded-full"
                  style={{
                    left: `${worstScore || 0}%`,
                    right: `${100 - (bestScore || 0)}%`,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-2 border-primary rounded-full shadow-sm"
                  style={{ left: `${stats.averageAccuracy}%`, marginLeft: '-6px' }}
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-1">
                Rata-rata: {stats.averageAccuracy}%
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tertinggi</p>
              <p className="text-xl font-bold text-success">{bestScore}%</p>
            </div>
          </div>
        </Card>
      )}

      {/* Accuracy Trend Chart */}
      {accuracyTrend.length > 1 && (
        <Card padding="p-4">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            Tren Akurasi
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            {accuracyTrend.length} quiz terakhir
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={accuracyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="shortDate"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '0.75rem',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  }}
                  labelStyle={{ color: '#6B7280', fontSize: '12px' }}
                  formatter={(value) => [`${value}%`, 'Akurasi']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6C63FF"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6C63FF' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Chapter Breakdown Chart */}
      {chapterData.length > 0 && (
        <Card padding="p-4">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Performa Per BAB
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Rata-rata akurasi per BAB</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={chapterData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="bab"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: 'BAB',
                    position: 'insideBottom',
                    offset: -10,
                    fontSize: 10,
                    fill: '#9CA3AF',
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{
                    borderRadius: '0.75rem',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value, name, props) => [
                    `${value}%`,
                    props.payload.title,
                  ]}
                  labelFormatter={(label) => `BAB ${label}`}
                />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} animationDuration={1000}>
                  {chapterData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={
                        entry.accuracy >= 80
                          ? '#06D6A0'
                          : entry.accuracy >= 60
                          ? '#FFD166'
                          : '#EF476F'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Average time per quiz */}
      {avgTimePerQuiz > 0 && (
        <Card padding="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rata-rata Waktu/Quiz</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatTime(avgTimePerQuiz)}
                </p>
              </div>
            </div>
            <Badge variant="info" size="sm">
              ⚡ Efisiensi
            </Badge>
          </div>
        </Card>
      )}

      {/* Reset button */}
      <Button
        variant="ghost"
        size="sm"
        icon={Trash2}
        iconPosition="left"
        onClick={onReset}
        className="text-danger mx-auto"
      >
        Reset Semua Data
      </Button>
    </div>
  );
}

function HistoryTab({ history, navigate }) {
  if (history.length === 0) {
    return (
      <Card className="text-center py-12">
        <span className="text-4xl block mb-3">📝</span>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Belum Ada Riwayat</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Mulai latihan soal untuk melihat riwayat di sini!
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/')}>
          Mulai Latihan
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3 stagger-children">
      {history.map((item) => (
        <Card key={item.id} padding="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={
                    item.score >= 70 ? 'success' : item.score >= 50 ? 'warning' : 'danger'
                  }
                  size="sm"
                >
                  {item.score}%
                </Badge>
                <Badge variant={item.type === 'uas' ? 'danger' : 'primary'} size="sm">
                  {item.type === 'uas' ? '🔥 UAS' : `📖 BAB ${item.bab}`}
                </Badge>
              </div>

              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {item.correct}/{item.total} benar
              </p>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(item.timeSpent)}
                </span>
                <span>{formatRelativeTime(item.date)}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Reusable stat card component
function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    orange: 'bg-orange-500/10 text-orange-500',
    secondary: 'bg-secondary/10 text-secondary',
  };

  return (
    <Card padding="p-4">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
          colorMap[color] || colorMap.primary
        }`}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </Card>
  );
}
