import { useNavigate } from 'react-router-dom';
import { Flame, Target, Trophy, Clock } from 'lucide-react';
import Card from '../ui/Card';
import useStatsStore from '../../stores/useStatsStore';

export default function QuickStats() {
  const navigate = useNavigate();
  const stats = useStatsStore((s) => s.stats);

  const statItems = [
    {
      icon: Target,
      label: 'Total Latihan',
      value: stats.totalQuizzesCompleted,
      color: 'text-primary bg-primary/10',
    },
    {
      icon: Trophy,
      label: 'Akurasi Rata-rata',
      value: `${stats.averageAccuracy}%`,
      color:
        stats.averageAccuracy >= 70
          ? 'text-success bg-success/10'
          : stats.averageAccuracy >= 50
          ? 'text-warning bg-warning/10'
          : 'text-danger bg-danger/10',
    },
    {
      icon: Flame,
      label: 'Streak Hari Ini',
      value: stats.currentStreak,
      color: 'text-orange-500 bg-orange-500/10',
    },
    {
      icon: Clock,
      label: 'Waktu Belajar',
      value: formatStudyTime(stats.totalTimeSpent),
      color: 'text-secondary bg-secondary/10',
    },
  ];

  return (
    <Card
      className="cursor-pointer hover:border-primary/30"
      onClick={() => navigate('/stats')}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          📊 Progress Kamu
        </h3>
        <span className="text-xs text-primary font-medium">
          Lihat Detail →
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-3 ${item.color}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <item.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium opacity-80">
                {item.label}
              </span>
            </div>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function formatStudyTime(seconds) {
  if (seconds < 60) return `${seconds}d`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}j ${mins}m`;
}
