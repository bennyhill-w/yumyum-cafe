import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown = () => setClicked(true)
    const onUp = () => setClicked(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    const interval = setInterval(() => {
      setDotPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15,
      }))
    }, 16)

    const addHover = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', () => setHovered(true))
        el.addEventListener('mouseleave', () => setHovered(false))
      })
    }
    addHover()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      clearInterval(interval)
    }
  }, [pos.x, pos.y])

  // Only show on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Outer ring */}
          <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none"
            animate={{
              x: dotPos.x - (hovered ? 24 : 16),
              y: dotPos.y - (hovered ? 24 : 16),
              scale: clicked ? 0.8 : 1,
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
          >
            <div
              className={`rounded-full border-2 transition-all duration-200 ${
                hovered
                  ? 'w-12 h-12 border-brand-gold-mid bg-brand-gold/10'
                  : 'w-8 h-8 border-brand-red'
              }`}
            />
          </motion.div>

          {/* Inner dot */}
          <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none"
            animate={{
              x: pos.x - 3,
              y: pos.y - 3,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            <div
              className={`rounded-full transition-all duration-200 ${
                hovered ? 'w-1.5 h-1.5 bg-brand-gold-mid' : 'w-1.5 h-1.5 bg-brand-red'
              }`}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}