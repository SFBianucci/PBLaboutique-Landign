import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function Select({ options, placeholder = 'Seleccionar...', value, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(options.findIndex(o => o.value === value));
      } else if (highlightedIndex >= 0) {
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(i => (i + 1) % options.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(i => (i - 1 + options.length) % options.length);
      }
    }
  };

  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setHighlightedIndex(options.findIndex(o => o.value === value));
        }}
        className={`w-full bg-transparent border-0 border-b py-4 text-left font-body text-lg transition-all duration-200 outline-none flex items-center justify-between gap-4 ${
          value ? 'text-on-surface' : 'text-placeholder'
        } ${isOpen ? 'border-primary' : 'border-outline-variant/40'}`}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <span className={`material-symbols-outlined text-muted text-[20px] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 mt-2 w-full bg-surface rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-outline-variant/15 py-1 overflow-hidden max-h-[240px] overflow-y-auto"
          >
            {options.map((option, index) => {
              const isSelected = value === option.value;
              const isHighlighted = highlightedIndex === index;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-3 py-2.5 cursor-pointer font-body text-sm transition-colors duration-100 flex items-center gap-3 ${
                    isSelected
                      ? 'text-primary'
                      : 'text-on-surface'
                  } ${isHighlighted ? 'bg-primary/10' : ''}`}
                >
                  <span className={`material-symbols-outlined text-[16px] shrink-0 ${isSelected ? 'text-primary' : 'text-transparent'}`}>check</span>
                  {option.label}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
