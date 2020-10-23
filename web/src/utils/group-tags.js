import { groupBy, toPairs, sortBy } from 'lodash';

export default allTags =>
  sortBy(
    toPairs(
      groupBy(allTags, t => {
        const [kind] = t.split(':');
        return kind === t ? '-' : kind;
      })
    ).map(([kind, tags]) => ({ kind, tags })),
    ({ kind }) => kind
  );
