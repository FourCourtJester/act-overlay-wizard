// Import core components
import { useEffect, useMemo } from 'react'

/**
 * Hook: Use Object Effect
 * Reduces objects down to strings for comparison
 *
 * @param {Function} fn
 * @param {object} scope
 */
export const useObjectEffect = (fn, scope = {}) => {
  const simpleScope = useMemo(() => JSON.stringify(scope), [scope])

  useEffect(() => {
    fn(typeof modifiedScope === 'string' ? JSON.parse(simpleScope) : simpleScope)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleScope])
}
