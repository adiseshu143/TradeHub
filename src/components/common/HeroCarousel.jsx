import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * HeroCarousel
 * - Auto-plays with pause on hover
 * - Touch/swipe support for mobile
 * - Dots + arrows for manual navigation
 * - Gradient overlay keeps text readable over imagery
 */
const HeroCarousel = ({ slides = [], autoPlayInterval = 4500 }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const timerRef = useRef(null)
  const touchStartX = useRef(null)

  const goTo = useCallback(
    (nextIndex) => {
      if (!slides.length) return
      const safeIndex = (nextIndex + slides.length) % slides.length
      setActiveIndex(safeIndex)
    },
    [slides.length]
  )

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const startTimer = useCallback(() => {
    clearTimer()
    timerRef.current = setTimeout(next, autoPlayInterval)
  }, [next, autoPlayInterval])

  useEffect(() => {
    startTimer()
    return clearTimer
  }, [startTimer, activeIndex])

  const handleMouseEnter = () => clearTimer()
  const handleMouseLeave = () => startTimer()

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    clearTimer()
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) {
      delta > 0 ? prev() : next()
    }
    touchStartX.current = null
    startTimer()
  }

  if (!slides.length) return null

  return (
    <div
      className="relative w-full aspect-video min-h-[260px] md:min-h-[320px] max-h-[540px] rounded-xl overflow-hidden shadow-lg bg-gray-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Featured collections carousel"
    >
      <div className="relative h-full">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-all duration-500 ease-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.src}
                alt={slide.title || 'Featured collection'}
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" aria-hidden="true" />
              {(slide.title || slide.subtitle) && (
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  {slide.badge && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-white/15 border border-white/30 mb-2">
                      {slide.badge}
                    </span>
                  )}
                  {slide.title && <h3 className="text-lg font-semibold drop-shadow-sm">{slide.title}</h3>}
                  {slide.subtitle && <p className="text-sm text-white/90 mt-1 drop-shadow-sm">{slide.subtitle}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
        <button
          type="button"
          onClick={prev}
          className="pointer-events-auto w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-700 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="pointer-events-auto w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-700 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots removed per request */}
    </div>
  )
}

export default HeroCarousel
