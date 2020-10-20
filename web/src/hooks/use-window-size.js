import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export default function () {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const onResize = debounce(() =>
      setWindowSize([window.innerWidth, window.innerHeight])
    );
    window.addEventListener('resize', onResize, 50);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return windowSize;
}
