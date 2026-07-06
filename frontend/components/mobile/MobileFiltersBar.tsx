'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MobileFiltersBarProps {
  categoryOptions: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
  universOptions: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
  selectedCategories: string[];
  selectedUnivers: string[];
  onToggleCategory: (id: string) => void;
  onToggleUnivers: (id: string) => void;
  onResetFilters: () => void;
}

export function MobileFiltersBar({
  categoryOptions,
  universOptions,
  selectedCategories,
  selectedUnivers,
  onToggleCategory,
  onToggleUnivers,
  onResetFilters,
}: MobileFiltersBarProps) {
  const [openDropdown, setOpenDropdown] = useState<'category' | 'univers' | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const universDropdownRef = useRef<HTMLDivElement>(null);

  const activeFiltersCount = selectedCategories.length + selectedUnivers.length;

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        if (openDropdown === 'category') setOpenDropdown(null);
      }
      if (universDropdownRef.current && !universDropdownRef.current.contains(event.target as Node)) {
        if (openDropdown === 'univers') setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  return (
    <div className="bg-gray-soft rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          {/* Dropdown Category */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                openDropdown === 'category' || selectedCategories.length > 0
                  ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
              }`}
            >
              Category
              {selectedCategories.length > 0 && (
                <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'category' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {openDropdown === 'category' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[240px]"
                >
                  <div className="space-y-1">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => onToggleCategory(option.id)}
                        className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 flex items-center gap-3 ${
                          selectedCategories.includes(option.id)
                            ? 'bg-violet-electric/10 text-violet-electric font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex-shrink-0">{option.icon}</span>
                        <span className="flex-1">{option.label}</span>
                        {selectedCategories.includes(option.id) && (
                          <svg className="w-4 h-4 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown Univers */}
          <div className="relative" ref={universDropdownRef}>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'univers' ? null : 'univers')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                openDropdown === 'univers' || selectedUnivers.length > 0
                  ? 'bg-violet-electric text-white shadow-md hover:bg-violet-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-electric'
              }`}
            >
              Univers
              {selectedUnivers.length > 0 && (
                <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedUnivers.length}
                </span>
              )}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${openDropdown === 'univers' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {openDropdown === 'univers' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[200px]"
                >
                  <div className="space-y-1">
                    {universOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => onToggleUnivers(option.id)}
                        className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-all duration-200 flex items-center gap-3 ${
                          selectedUnivers.includes(option.id)
                            ? 'bg-violet-electric/10 text-violet-electric font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex-shrink-0">{option.icon}</span>
                        <span className="flex-1">{option.label}</span>
                        {selectedUnivers.includes(option.id) && (
                          <svg className="w-4 h-4 text-violet-electric" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-7 h-7 bg-violet-electric rounded-full flex items-center justify-center shadow-md"
            >
              <span className="text-white text-xs font-bold">{activeFiltersCount}</span>
            </motion.div>
          )}
          <button
            onClick={onResetFilters}
            className="px-3 py-2 bg-transparent text-gray-600 rounded-lg font-medium text-sm hover:bg-white/80 hover:text-violet-electric transition-all duration-200 flex items-center gap-1.5"
          >
            Reset filters
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}


