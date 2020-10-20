import React from 'react';
import { useHistory } from 'react-router-dom';

export default ({ photo: { name }, width, height }) => {
  const history = useHistory();
  return (
    <div
      onClick={() => {
        history.push(`/view/${name}`);
      }}
      className="inline-block bg-top bg-cover"
      style={{
        height,
        width,
        backgroundImage: `url("/photos/${name}")`,
        scrollSnapAlign: 'end',
      }}
    />
  );
};
