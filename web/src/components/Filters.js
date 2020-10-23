import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Tag from './Tag';
import Controls from './Controls';
import { ButtonGroup } from './Button';
import {
  filterMethodSelector,
  FILTER_METHOD_ONE,
  FILTER_METHOD_AND,
  FILTER_METHOD_OR,
  FILTER_METHOD_ALL,
  positiveFilterTagsState,
  negativeFilterTagsState,
  togglePositiveFilterTagSelector,
  toggleNegativeFilterTagSelector,
} from '../state';

const options = [
  { key: FILTER_METHOD_ALL, value: 'All' },
  { key: FILTER_METHOD_ONE, value: 'One' },
  { key: FILTER_METHOD_AND, value: 'And' },
  { key: FILTER_METHOD_OR, value: 'Or' },
];

export default ({ allTags }) => {
  const positiveFilterTags = useRecoilValue(positiveFilterTagsState);
  const negativeFilterTags = useRecoilValue(negativeFilterTagsState);
  const togglePositiveFilterTag = useSetRecoilState(
    togglePositiveFilterTagSelector
  );
  const toggleNegativeFilterTag = useSetRecoilState(
    toggleNegativeFilterTagSelector
  );
  const [filterMethod, setFilterMethod] = useRecoilState(filterMethodSelector);

  return (
    <div className="flex fixed inset-x-0 top-0 justify-center">
      <Controls>
        <div className="mx-3">
          <ButtonGroup
            {...{ options }}
            selected={filterMethod}
            onSelect={setFilterMethod}
          />
        </div>
        {allTags.map(tag => (
          <Tag
            key={tag}
            {...{ tag }}
            onClick={togglePositiveFilterTag}
            onRightClick={toggleNegativeFilterTag}
            selected={positiveFilterTags.includes(tag)}
            negated={negativeFilterTags.includes(tag)}
          />
        ))}
      </Controls>
    </div>
  );
};
