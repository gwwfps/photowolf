import React, { useState, useCallback } from 'react';
import { sortBy, reverse } from 'lodash';

import useWindowSize from '../hooks/use-window-size';
import Tile from './Tile';
import GalleryControls from './GalleryControls';

export default ({ photos }) => {
  const [winW, winH] = useWindowSize();

  const columns = 5;
  const rows = 3;
  const width = winW / columns;
  const height = winH / rows;
  const [cursor, setCursor] = useState(0);
  const maxCursorPos = Math.ceil(photos.length / columns) - rows;
  const shownPhotos = reverse(sortBy(photos, ({ updated }) => updated)).slice(
    cursor * columns,
    (cursor + rows) * columns
  );

  const onWheel = useCallback(
    ({ deltaY }) => {
      if (deltaY < 0 && cursor > 0) {
        setCursor(cursor - 1);
      }
      if (deltaY > 0 && cursor < maxCursorPos) {
        setCursor(cursor + 1);
      }
    },
    [cursor, maxCursorPos]
  );
  return (
    <>
      <div
        className="fixed w-full h-full top-0 left-0 overflow-hidden"
        style={{
          scrollSnapType: 'both mandatory',
          scrollBehavior: 'smooth',
          lineHeight: 0,
        }}
        {...{ onWheel }}
      >
        {shownPhotos.map((photo) => (
          <Tile {...{ photo, width, height }} key={photo.name} />
        ))}
      </div>
      <GalleryControls />
    </>
  );
};
