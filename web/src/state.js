import { atom, selector, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import { xor, reverse, sortBy, intersection } from 'lodash';

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

export const zoomFactorState = persistentAtom({
  key: 'zoomFactor',
  default: 0.5,
});

export const galleryPhotoCount = atom({
  key: 'galleryPhotoCount',
  default: 0,
});

export const galleryCursorState = persistentAtom({
  key: 'galleryCursor',
  default: 0,
});

export const maxGalleryCursorSelector = selector({
  key: 'maxGalleryCursorSelector',
  get: ({ get }) =>
    Math.ceil(get(galleryPhotoCount) / get(galleryColumnsState)) -
    get(galleryRowsState),
});

export const galleryCursorSelector = selector({
  key: 'galleryCursorSelector',
  get: ({ get }) =>
    Math.min(get(galleryCursorState), get(maxGalleryCursorSelector)),
});

export const incrementGalleryCursorSelector = selector({
  key: 'incrementGalleryCursorSelector',
  set: ({ get, set }) => {
    const cursor = get(galleryCursorState);
    if (cursor < get(maxGalleryCursorSelector)) {
      set(galleryCursorState, cursor + 1);
    }
  },
});

export const decrementGalleryCursorSelector = selector({
  key: 'decrementGalleryCursorSelector',
  set: ({ get, set }) => {
    const cursor = get(galleryCursorState);
    if (cursor > 0) {
      set(galleryCursorState, cursor - 1);
    }
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
    const cursor = get(galleryCursorSelector);
    const rows = get(galleryRowsState);
    const columns = get(galleryColumnsState);

    const filterMethod = get(filterMethodState);
    const filterTags = get(filterTagsState);

    return reverse(
      sortBy(
        photos.filter(({ deleted }) => !deleted),
        ({ updated }) => updated
      ).map((photo, i) => ({
        ...photo,
        num: i + 1,
      }))
    )
      .filter(({ tags }) => {
        if (filterMethod === FILTER_METHOD_ALL || !filterTags.length) {
          return true;
        }
        const overlap = intersection(filterTags, tags).length;
        if (filterMethod === FILTER_METHOD_OR) {
          return !!overlap;
        }
        return overlap === filterTags.length;
      })
      .slice(cursor * columns, (cursor + rows) * columns);
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

export const filterTagsState = persistentAtom({
  key: 'filterTags',
  default: [],
});

export const addFilterTagSelector = selector({
  key: 'addFilterTagSelector',
  get: ({ get }) => get(filterTagsState),
  set: ({ get, set }, tag) => {
    const filterTags = get(filterTagsState);
    const filterMethod = get(filterMethodState);
    if (filterMethod === FILTER_METHOD_ALL) {
      return;
    }
    if (filterMethod === FILTER_METHOD_ONE) {
      set(filterTagsState, filterTags.includes(tag) ? [] : [tag]);
    } else {
      set(filterTagsState, xor(filterTags, [tag]).sort());
    }
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
      set(filterTagsState, []);
    }
    if (method === FILTER_METHOD_ONE) {
      const filterTags = get(filterTagsState);
      if (filterTags.length) {
        set(filterTagsState, [filterTags[0]]);
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
