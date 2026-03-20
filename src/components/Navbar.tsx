import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Servicios', href: '#servicios' },
  { name: 'Galería', href: '#galeria' },
  { name: 'Reseñas', href: '#reseñas' },
  { name: 'Contacto', href: '#contacto' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple section tracking
      const sections = navItems.map(item => item.href.substring(1));
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is above the middle of the viewport
          if (rect.top <= window.innerHeight / 3) {
            current = section;
          }
        }
      }
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for floating navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-700 flex justify-center px-4 sm:px-6 md:px-10 ${
          scrolled ? 'py-4' : 'py-8'
        }`}
      >
        <div 
          className={`flex items-center justify-between w-full max-w-7xl mx-auto transition-all duration-700 ${
            scrolled 
              ? 'bg-neutral-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-full px-4 sm:px-6 py-3' 
              : 'bg-transparent border border-transparent px-0 py-0'
          }`}
        >
          <div 
            className="text-lg sm:text-xl font-black text-white tracking-tighter italic uppercase cursor-pointer flex items-center gap-3 group" 
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500 shrink-0">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(161,211,165,0.8)]"></div>
            </div>
            <span className="group-hover:text-primary transition-colors duration-500 hidden sm:block">Parabrisas la Boutique</span>
          </div>
          
          <div 
            className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-inner"
            onMouseLeave={() => setHoveredSection(null)}
          >
            {navItems.map((item) => {
              const sectionId = item.href.substring(1);
              const isActive = activeSection === sectionId;
              const isHovered = hoveredSection === sectionId;
              const hasPill = hoveredSection ? isHovered : isActive;
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  onMouseEnter={() => setHoveredSection(sectionId)}
                  className={`relative px-5 py-2 rounded-full font-headline uppercase tracking-widest text-[11px] font-bold transition-colors duration-300 z-10 ${
                    hasPill ? 'text-neutral-950' : (isActive ? 'text-white' : 'text-neutral-400 hover:text-white')
                  }`}
                >
                  {hasPill && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_0_20px_rgba(161,211,165,0.3)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 1 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => scrollToSection(e as any, '#contacto')}
              className="bg-white text-black font-headline font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-full hover:bg-primary hover:text-neutral-950 transition-all duration-500 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(161,211,165,0.5)] flex items-center gap-2 group shrink-0"
            >
              <span className="hidden sm:block">Reservar Turno</span>
              <span className="sm:hidden">Reservar</span>
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
            </button>

            <button 
              className="md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.span 
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-white block transition-transform"
              />
              <motion.span 
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-0.5 bg-white block transition-opacity"
              />
              <motion.span 
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-white block transition-transform"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-neutral-950/95 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, i) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-3xl font-headline font-black uppercase tracking-widest ${
                    isActive ? 'text-primary' : 'text-white'
                  }`}
                >
                  {item.name}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
