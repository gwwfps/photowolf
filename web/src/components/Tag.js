import React, { useCallback } from 'react';
import cx from 'classnames';

import hashColor from '../utils/hash-color';

const Inner = ({ text, selected, negated, color }) => {
  const c = color || hashColor(text);
  return (
    <div
      className={cx(
        [
          'cursor-default',
          'select-none',
          'py-1',
          'px-2',
          `text-${c}-700`,
          `bg-${c}-200`,
        ],
        {
          [`border-b-4 border-${c}-300`]: selected,
          'border-t-4 border-gray-500 line-through': negated,
        }
      )}
    >
      {text}
    </div>
  );
};

export default ({ tag, selected, negated, count, onClick, onRightClick }) => {
  let inner;
  if (tag.includes(':')) {
    const [kind, val] = tag.split(':');
    inner = [
      { key: 'kind', text: kind },
      { key: 'val', text: val },
    ];
  } else {
    inner = [{ key: 'tag', text: tag }];
  }
  if (count) {
    inner.push({ key: 'count', text: `${count}`, color: 'gray' });
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
      {inner.map(props => (
        <Inner {...{ ...props, selected, negated }} />
      ))}
    </div>
  );
};
