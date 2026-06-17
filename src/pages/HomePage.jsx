import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import HeroSection from '../components/home/HeroSection';
import SubjectCard from '../components/home/SubjectCard';
import QuickStats from '../components/home/QuickStats';
import { subjects } from '../data/subjects';

export default function HomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    if (subjects.length > 0) {
      navigate(`/subject/${subjects[0].id}`);
    }
  };

  return (
    <PageContainer>
      <div className="stagger-children space-y-5">
        {/* Hero */}
        <HeroSection onStart={handleStart} />

        {/* Quick Stats */}
        <QuickStats />

        {/* Subjects */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            📚 Mata Kuliah
          </h2>
          <div className="space-y-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>

        {/* Footer info */}
        <div className="text-center py-6">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Dibuat untuk Mahasiswa Kecerdasan Buatan IPB University 🎓
          </p>
          <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">
            Data tersimpan di browser kamu (tanpa login)
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
