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