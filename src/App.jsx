import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Modal from './components/ui/Modal';
import Toast from './components/ui/Toast';
import useStatsStore from './stores/useStatsStore';

// Pages
import HomePage from './pages/HomePage';
import SubjectPage from './pages/SubjectPage';
import ChaptersPage from './pages/ChaptersPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import StatsPage from './pages/StatsPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/chapters/:subjectId" element={<ChaptersPage />} />
          <Route path="/quiz/:type/:subjectId/:babNum" element={<QuizPage />} />
          <Route path="/quiz/:type/:subjectId" element={<QuizPage />} />
          <Route path="/result/:quizId" element={<ResultPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function ThemeSync() {
  const darkMode = useStatsStore((s) => s.preferences.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeSync />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F1A]">
        {/* Top Navigation */}
        <Navbar />

        {/* Main Content */}
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Global overlays */}
        <Modal />
        <Toast />
      </div>
    </BrowserRouter>
  );
}
