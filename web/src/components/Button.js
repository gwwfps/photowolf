import React from 'react';
import cx from 'classnames';

const outerClasses = ['cursor-default', 'text-gray-700', 'flex', 'shadow'];
const classes = [
  'bg-gray-200',
  'hover:bg-gray-400',
  'text-sm',
  'py-2',
  'transition',
  'ease-in-out',
  'duration-200',
  'select-none',
];

export default ({ className, ...props }) => (
  <div
    {...props}
    className={cx(outerClasses, classes, 'px-4', 'rounded-md', className)}
  />
);

export const ButtonGroup = ({ options, selected, onSelect }) => (
  <div className={cx(outerClasses)}>
    {options.map(({ key, value }, i) => (
      <div
        {...{ key }}
        className={cx(classes, 'px-3', {
          'pl-4 rounded-l-md': i === 0,
          'pr-4 rounded-r-md': i === options.length - 1,
          'bg-gray-600 hover:bg-gray-700 text-gray-100': key === selected,
        })}
        onClick={() => {
          onSelect(key);
        }}
      >
        {value}
      </div>
    ))}
  </div>
);
