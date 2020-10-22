import React from 'react';
import cx from 'classnames';

export default ({ className, color = 'gray', ...props }) => (
  <input
    className={cx(
      `bg-${color}-200`,
      'appearance-none',
      'border-2',
      `border-${color}-200`,
      'rounded',
      'py-2',
      'px-4',
      'text-xs',
      `text-${color}-700`,
      'leading-tight',
      'focus:outline-none',
      'focus:bg-white',
      `focus:border-${color}-500`,
      className
    )}
    type="text"
    {...props}
  />
);
