import React, { useCallback, useEffect, useState } from 'react';
import { uniq } from 'lodash';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useHotkeys } from 'react-hotkeys-hook';

import useWindowSize from '../hooks/use-window-size';
import Tile from './Tile';
import Tagger from './Tagger';
import Filters from './Filters';
import {
  galleryColumnsState,
  galleryRowsState,
  addGalleryColumnSelector,
  addGalleryRowSelector,
  removeGalleryColumnSelector,
  removeGalleryRowSelector,
  incrementGalleryCursorSelector,
  decrementGalleryCursorSelector,
  galleryPhotoCount,
  galleryDisplayFilterSelector,
  taggingDisplayedState,
  filteringDisplayedState,
  toggleTaggingSelector,
  toggleFilteringSelector,
} from '../state';

export default ({ photos }) => {
  const tagging = useRecoilValue(taggingDisplayedState);
  const toggleTagging = useSetRecoilState(toggleTaggingSelector);
  const filtering = useRecoilValue(filteringDisplayedState);
  const toggleFiltering = useSetRecoilState(toggleFilteringSelector);

  const [winW, winH] = useWindowSize();

  const setPhotoCount = useSetRecoilState(galleryPhotoCount);
  useEffect(() => {
    setPhotoCount(photos.length);
  }, [photos.length]);

  const columns = useRecoilValue(galleryColumnsState);
  const rows = useRecoilValue(galleryRowsState);
  const addColumn = useSetRecoilState(addGalleryColumnSelector);
  const removeColumn = useSetRecoilState(removeGalleryColumnSelector);
  const addRow = useSetRecoilState(addGalleryRowSelector);
  const removeRow = useSetRecoilState(removeGalleryRowSelector);

  const width = winW / columns;
  const height = winH / rows;

  const incrementCursor = useSetRecoilState(incrementGalleryCursorSelector);
  const decrementCursor = useSetRecoilState(decrementGalleryCursorSelector);
  const filterPhotos = useRecoilValue(galleryDisplayFilterSelector);
  const shownPhotos = filterPhotos(photos);
  const allTags = uniq(photos.flatMap(({ tags }) => tags)).sort();

  const onWheel = useCallback(({ deltaY }) => {
    if (deltaY < 0) {
      decrementCursor();
    }
    if (deltaY > 0) {
      incrementCursor();
    }
  }, []);

  useHotkeys('=', addColumn, {}, []);
  useHotkeys('-', removeColumn, {}, []);
  useHotkeys(']', addRow, {}, []);
  useHotkeys('[', removeRow, {}, []);

  useHotkeys('t', toggleTagging, {}, []);
  useHotkeys('f', toggleFiltering, {}, []);

  return (
    <>
      <div
        className="fixed w-full h-full top-0 left-0 overflow-hidden flex flex-wrap"
        {...{ onWheel }}
      >
        {shownPhotos.map(photo => (
          <Tile {...{ photo, width, height, tagging }} key={photo.name} />
        ))}
      </div>
      {tagging && <Tagger {...{ allTags }} />}
      {filtering && <Filters {...{ allTags }} />}
    </>
  );
};
