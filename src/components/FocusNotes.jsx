import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { FOCUS_NOTES_SLIDES } from '../data/focusNotes';

/**
 * FocusNotes Carousel Component matching Figma frames 15:2, 15:30, 15:58
 * - Exactly three official Figma slides
 * - Next / Previous navigation buttons
 * - Active slide pill indicators (clickable)
 * - Visual floating preview card on the right
 * - Responsive layout for desktop and mobile
 */
export function FocusNotes() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = FOCUS_NOTES_SLIDES.length;
  const currentSlide = FOCUS_NOTES_SLIDES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <section
      aria-label="Daily Focus Notes & Principles"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full mb-6 bg-gradient-to-r from-[#6259F7] via-[#594EF2] to-[#4F46E5] text-white rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 transition-all"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-indigo-900/20 blur-2xl pointer-events-none" />

      {/* Top Controls Row */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/15 text-white backdrop-blur-xs">
            {currentSlide.tag}
          </span>
          <span className="text-xs font-semibold text-white/70">
            {currentSlide.counter}
          </span>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous focus note slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next focus note slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Body: Left Copy + Right Floating Task Preview Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left: Inspiring Headline & Subtitle */}
        <div className="max-w-xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1.5 font-medium leading-relaxed">
            {currentSlide.subtitle}
          </p>

          {/* Slide Indicator Bars (matching Figma horizontal pill indicators) */}
          <div className="flex items-center gap-2 mt-5">
            {FOCUS_NOTES_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-white'
                    : 'w-3.5 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Floating Task Card (Figma reference visual reproduction) */}
        <div className="relative shrink-0 self-start md:self-center">
          {/* Decorative angled background card layer */}
          <div className="absolute inset-0 bg-white/20 rounded-xl transform rotate-2 translate-x-1 translate-y-1 backdrop-blur-xs pointer-events-none" />

          {/* Actual Card */}
          <div className="relative bg-white text-slate-800 rounded-xl p-3.5 sm:p-4 shadow-xl border border-white/20 min-w-[210px] sm:min-w-[240px]">
            {/* Badge */}
            <div className="flex items-center gap-1.5 mb-2">
              {currentSlide.previewBadgeType === 'completed' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : currentSlide.previewBadgeType === 'progress' ? (
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              )}
              <span
                className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                  currentSlide.previewBadgeType === 'completed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : currentSlide.previewBadgeType === 'progress'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-brand-50 text-brand-700'
                }`}
              >
                {currentSlide.previewBadge}
              </span>
            </div>

            {/* Task Name */}
            <p className="text-xs sm:text-sm font-bold text-slate-900 mb-2 truncate max-w-[210px]">
              {currentSlide.previewTask}
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="grow bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${currentSlide.progress}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600 shrink-0">
                {currentSlide.progressLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
