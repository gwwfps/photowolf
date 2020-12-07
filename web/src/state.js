import { atom, selector, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import { xor, without, reverse, sortBy, intersection } from 'lodash';

const persistenceMapping = {};

const forEachPersistentAtom = f => {
  Object.keys(persistenceMapping).forEach(storageKey => {
    f(storageKey, persistenceMapping[storageKey]);
  });
};

const persistentAtom = opts => {
  const a = atom(opts);
  persistenceMapping[`PW_${opts.key}`] = a;
  return a;
};

export const magActiveState = persistentAtom({
  key: 'magActive',
  default: false,
});

const JUSTIFY_POSITIONS = ['center', 'end', 'start'];

export const justifyPositionState = persistentAtom({
  key: 'justifyPosition',
  default: JUSTIFY_POSITIONS[0],
});

export const cycleJustifyPositionSelector = selector({
  key: 'cycleJustifyPositionSelector',
  set: ({ set, get }) => {
    const idx = JUSTIFY_POSITIONS.indexOf(get(justifyPositionState));
    set(
      justifyPositionState,
      JUSTIFY_POSITIONS[(idx + 1) % JUSTIFY_POSITIONS.length]
    );
  },
});

export const flippedState = persistentAtom({
  key: 'flipped',
  default: false,
});

export const toggleFlippedSelector = selector({
  key: 'toggleFlippedSelector',
  set: ({ set, get }) => {
    set(flippedState, !get(flippedState));
  },
});

export const zoomFactorState = persistentAtom({
  key: 'zoomFactor',
  default: 0.5,
});

export const galleryFilteredPhotoCount = atom({
  key: 'galleryFilteredPhotoCount',
  default: 0,
});

export const galleryCursorState = persistentAtom({
  key: 'galleryCursor',
  default: 0,
});

export const maxGalleryCursorSelector = selector({
  key: 'maxGalleryCursorSelector',
  get: ({ get }) =>
    Math.ceil(get(galleryFilteredPhotoCount) / get(galleryColumnsState)) - 1,
});

export const galleryCursorSelector = selector({
  key: 'galleryCursorSelector',
  get: ({ get }) =>
    Math.min(get(galleryCursorState), get(maxGalleryCursorSelector)),
  set: ({ set, get }, cursor) =>
    set(
      galleryCursorState,
      Math.max(0, Math.min(cursor, get(maxGalleryCursorSelector)))
    ),
});

export const incrementGalleryCursorSelector = selector({
  key: 'incrementGalleryCursorSelector',
  set: ({ get, set }) => {
    const cursor = get(galleryCursorState);
    set(galleryCursorSelector, cursor + 1);
  },
});

export const decrementGalleryCursorSelector = selector({
  key: 'decrementGalleryCursorSelector',
  set: ({ get, set }) => {
    const cursor = get(galleryCursorState);
    set(galleryCursorSelector, cursor - 1);
  },
});

export const galleryRowsState = persistentAtom({
  key: 'galleryRows',
  default: 3,
});

export const addGalleryRowSelector = selector({
  key: 'addGalleryRowSelector',
  set: ({ get, set }) => {
    const rows = get(galleryRowsState);
    if (rows < 10) {
      set(galleryRowsState, rows + 1);
    }
  },
});

export const removeGalleryRowSelector = selector({
  key: 'removeGalleryRowSelector',
  set: ({ get, set }) => {
    const rows = get(galleryRowsState);
    if (rows > 0) {
      set(galleryRowsState, rows - 1);
    }
  },
});

export const galleryColumnsState = persistentAtom({
  key: 'galleryColumns',
  default: 5,
});

export const addGalleryColumnSelector = selector({
  key: 'addGalleryColumnSelector',
  set: ({ get, set }) => {
    const columns = get(galleryColumnsState);
    if (columns < 17) {
      set(galleryColumnsState, columns + 1);
    }
  },
});

export const removeGalleryColumnSelector = selector({
  key: 'removeGalleryColumnSelector',
  set: ({ get, set }) => {
    const columns = get(galleryColumnsState);
    if (columns > 0) {
      set(galleryColumnsState, columns - 1);
    }
  },
});

export const galleryDisplayFilterSelector = selector({
  key: 'galleryDisplayFilterSelector',
  get: ({ get }) => photos => {
    const filterMethod = get(filterMethodState);
    const positiveTags = get(positiveFilterTagsState);
    const negativeTags = get(negativeFilterTagsState);

    return reverse(
      sortBy(
        photos.filter(({ deleted }) => !deleted),
        ({ updated }) => updated
      ).map((photo, i) => ({
        ...photo,
        num: i + 1,
      }))
    ).filter(({ tags }) => {
      if (!positiveTags.length && !negativeTags.length) {
        return true;
      }
      const positiveOverlap = intersection(positiveTags, tags).length;
      const negativeOverlap = intersection(negativeTags, tags).length;
      if (negativeOverlap) {
        return false;
      }
      if (filterMethod === FILTER_METHOD_ALL) {
        return true;
      }
      if (filterMethod === FILTER_METHOD_OR) {
        return !!positiveOverlap;
      }
      return positiveOverlap === positiveTags.length;
    });
  },
});

export const galleryDisplayPageSelector = selector({
  key: 'galleryDisplayPageSelector',
  get: ({ get }) => photos => {
    const cursor = get(galleryCursorSelector);
    const rows = get(galleryRowsState);
    const columns = get(galleryColumnsState);
    return photos.slice(cursor * columns, (cursor + rows) * columns);
  },
});

export const taggingDisplayedState = atom({
  key: 'taggingDisplayed',
  default: false,
});

export const toggleTaggingSelector = selector({
  key: 'toggleTaggingSelector',
  set: ({ set, get }) => {
    if (get(deletionModeState)) {
      return;
    }
    set(taggingDisplayedState, !get(taggingDisplayedState));
    set(filteringDisplayedState, false);
  },
});

export const taggingSelectionState = atom({
  key: 'taggingSelection',
  default: '',
});

export const filteringDisplayedState = atom({
  key: 'filteringDisplayed',
  default: false,
});

export const toggleFilteringSelector = selector({
  key: 'toggleFilteringSelector',
  set: ({ set, get }) => {
    if (get(deletionModeState)) {
      return;
    }
    set(filteringDisplayedState, !get(filteringDisplayedState));
    set(taggingDisplayedState, false);
  },
});

export const positiveFilterTagsState = persistentAtom({
  key: 'positiveFilterTags',
  default: [],
});

export const togglePositiveFilterTagSelector = selector({
  key: 'togglePositiveFilterTagSelector',
  set: ({ set, get }, tag) => {
    const filterMethod = get(filterMethodState);
    if (filterMethod === FILTER_METHOD_ALL) {
      set(filterMethodState, FILTER_METHOD_ONE);
      set(positiveFilterTagsState, [tag]);
    } else if (filterMethod === FILTER_METHOD_ONE) {
      set(
        positiveFilterTagsState,
        intersection(xor(get(positiveFilterTagsState), [tag]), [tag])
      );
    } else {
      set(
        positiveFilterTagsState,
        xor(get(positiveFilterTagsState), [tag]).sort()
      );
    }
    set(negativeFilterTagsState, without(get(negativeFilterTagsState), tag));
  },
});

export const negativeFilterTagsState = persistentAtom({
  key: 'negativeFilterTags',
  default: [],
});

export const toggleNegativeFilterTagSelector = selector({
  key: 'toggleNegativeFilterTagSelector',
  set: ({ set, get }, tag) => {
    set(
      negativeFilterTagsState,
      xor(get(negativeFilterTagsState), [tag]).sort()
    );
    set(positiveFilterTagsState, without(get(positiveFilterTagsState), tag));
  },
});

export const FILTER_METHOD_ONE = 0;
export const FILTER_METHOD_AND = 1;
export const FILTER_METHOD_OR = 2;
export const FILTER_METHOD_ALL = 3;

export const filterMethodState = persistentAtom({
  key: 'filterMethod',
  default: FILTER_METHOD_ONE,
});

export const filterMethodSelector = selector({
  key: 'filterMethodSelector',
  get: ({ get }) => get(filterMethodState),
  set: ({ get, set }, method) => {
    set(filterMethodState, method);
    if (method === FILTER_METHOD_ALL) {
      set(positiveFilterTagsState, []);
      set(negativeFilterTagsState, []);
    }
    if (method === FILTER_METHOD_ONE) {
      const positiveFilterTags = get(positiveFilterTagsState);
      if (positiveFilterTags.length) {
        set(positiveFilterTagsState, [positiveFilterTags[0]]);
      }
    }
  },
});

export const deletionModeState = atom({
  key: 'deletionMode',
  default: false,
});

export const toggleDeletionModeSelector = selector({
  key: 'toggleDeletionModeSelector',
  set: ({ set, get }) => {
    if (get(filteringDisplayedState) || get(taggingDisplayedState)) {
      return;
    }
    set(deletionModeState, !get(deletionModeState));
  },
});

export const useLocalStoragePersistenceObserver = () =>
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    forEachPersistentAtom((storageKey, state) => {
      const loadable = snapshot.getLoadable(state);
      if (loadable.state === 'hasValue') {
        localStorage.setItem(storageKey, JSON.stringify(loadable.contents));
      }
    });
  });

export const initializeState = ({ set }) => {
  forEachPersistentAtom((storageKey, state) => {
    const val = localStorage.getItem(storageKey);
    if (val !== null) {
      set(state, JSON.parse(val));
    }
  });
};
