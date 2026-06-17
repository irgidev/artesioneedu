import { Sparkles, ArrowRight } from 'lucide-react';
import { GradientCard } from '../ui/Card';
import Button from '../ui/Button';

export default function HeroSection({ onStart }) {
  return (
    <section className="mb-6">
      <GradientCard className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative">
          {/* Greeting */}
          <p className="text-white/70 text-sm font-medium mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Selamat Belajar! 🎓
          </p>
          
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            Siap Ujian?
          </h2>
          
          <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-[280px]">
            Latihan soal Pengantar Sains Data khusus untuk mahasiswa KB IPB.
            Ayo raih nilai terbaik! 🚀
          </p>

          <Button
            variant="white"
            size="md"
            icon={ArrowRight}
            onClick={onStart}
            className="bg-white text-primary hover:bg-white/90 shadow-lg"
          >
            Mulai Latihan
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-3 right-3 text-4xl opacity-20">
          📚
        </div>
      </GradientCard>
    </section>
  );
}
