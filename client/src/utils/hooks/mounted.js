// @flow
import { useRef, useEffect } from 'react';

export function useIsMounted(): any {
  const isMounted = useRef(false);

  useEffect((): any => {
    isMounted.current = true;
    return () => isMounted.current = false;
  }, []);

  return isMounted;
}

type UseEffectT = () => (void | () => void);
// eslint-disable-next-line
export const useMountedEffect = (func: UseEffectT): void => useEffect(func, []);
