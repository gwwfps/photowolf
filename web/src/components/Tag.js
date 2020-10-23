import React, { useCallback } from 'react';
import cx from 'classnames';

import hashColor from '../utils/hash-color';

const Inner = ({ className, text, selected, negated }) => {
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
          [`border-b-4 border-${color}-300`]: selected,
          'border-t-4 border-gray-500 line-through': negated,
        },
        className
      )}
    >
      {text}
    </div>
  );
};

export default ({ tag, selected, negated, onClick, onRightClick }) => {
  let inner;
  if (tag.includes(':')) {
    const [kind, val] = tag.split(':');
    inner = [
      <Inner
        className="rounded-l pr-1"
        text={kind}
        {...{ selected, negated }}
      />,
      <Inner
        className="rounded-r pl-1"
        text={val}
        {...{ selected, negated }}
      />,
    ];
  } else {
    inner = <Inner className="rounded" text={tag} {...{ selected, negated }} />;
  }

  const handleClick = useCallback(() => {
    if (!onClick) {
      return;
    }
    onClick(tag);
  }, [onClick, tag]);
  const handleRightClick = useCallback(
    e => {
      if (!onRightClick) {
        return;
      }
      e.preventDefault();
      onRightClick(tag);
    },
    [onRightClick, tag]
  );

  return (
    <div
      className={cx('inline-flex', 'm-1', 'text-xs')}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {inner}
    </div>
  );
};
