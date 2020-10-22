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
    {options.map(({ key, value }, i) => {
      const first = i === 0;
      const last = i === options.length - 1;
      const active = key === selected;
      return (
        <div
          {...{ key }}
          className={cx(classes, 'px-3', {
            'pl-4': first,
            'pr-4': last,
            'rounded-l-md': first,
            'rounded-r-md': last,
            'bg-gray-600': active,
            'hover:bg-gray-700': active,
            'text-gray-100': active,
          })}
          onClick={() => {
            onSelect(key);
          }}
        >
          {value}
        </div>
      );
    })}
  </div>
);
