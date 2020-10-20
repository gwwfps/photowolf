import React from 'react';

export default ({ photos }) => (
  <div className="hidden">
    {photos.map(({ name }) => (
      <img src={`/photos/${name}`} alt={name} key={name} />
    ))}
  </div>
);
