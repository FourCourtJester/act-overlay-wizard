// Import core components
import { useEffect, useRef } from 'react'

/**
 * Hook: Use Effect Once
 * React 18 Strict Mode fix
 *
 * @param {Function} fn
 */
export const useEffectOnce = (fn) => {
  const gate = useRef(true)

  useEffect(() => {
    if (!gate.current) {
      return () => {}
    }

    Promise.resolve(true).then(() => fn())

    return () => {
      gate.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gate.current])
}
