import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export default function () {
  const [windowSize, setWindowSize] = useState([
    document.documentElement.clientWidth,
    document.documentElement.clientHeight,
  ]);

  useEffect(() => {
    const onResize = debounce(() =>
      setWindowSize([document.documentElement.clientWidth, document.documentElement.clientHeight])
    );
    window.addEventListener('resize', onResize, 50);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return windowSize;
}
