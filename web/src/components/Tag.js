import React, { useCallback } from 'react';
import cx from 'classnames';

import hashColor from '../utils/hash-color';

const Inner = ({ className, text, underline }) => {
  const color = hashColor(text);
  return (
    <div
      className={cx(
        [
          'cursor-default',
          'select-none',
          'py-1',
          'px-2',
          `text-${color}-700`,
          `bg-${color}-200`,
        ],
        {
          [`border-b-4 border-${color}-300`]: underline,
        },
        className
      )}
    >
      {text}
    </div>
  );
};

export default ({ tag, underline, onClick }) => {
  let inner;
  if (tag.includes(':')) {
    const [kind, val] = tag.split(':');
    inner = [
      <Inner className="rounded-l pr-1" text={kind} {...{ underline }} />,
      <Inner className="rounded-r pl-1" text={val} {...{ underline }} />,
    ];
  } else {
    inner = <Inner className="rounded" text={tag} {...{ underline }} />;
  }

  const handleClick = useCallback(() => {
    if (!onClick) {
      return;
    }
    onClick(tag);
  }, [onClick, tag]);

  return (
    <div className={cx('inline-flex', 'm-1', 'text-xs')} onClick={handleClick}>
      {inner}
    </div>
  );
};
