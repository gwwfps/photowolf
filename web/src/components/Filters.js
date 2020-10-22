import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import Tag from './Tag';
import Controls from './Controls';
import { ButtonGroup } from './Button';
import {
  addFilterTagSelector,
  filterMethodSelector,
  FILTER_METHOD_ONE,
  FILTER_METHOD_AND,
  FILTER_METHOD_OR,
  FILTER_METHOD_ALL,
} from '../state';

const options = [
  { key: FILTER_METHOD_ALL, value: 'All' },
  { key: FILTER_METHOD_ONE, value: 'One' },
  { key: FILTER_METHOD_AND, value: 'And' },
  { key: FILTER_METHOD_OR, value: 'Or' },
];

export default ({ allTags }) => {
  const [filterTags, addFilterTag] = useRecoilState(addFilterTagSelector);
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
            onClick={addFilterTag}
            underline={filterTags.includes(tag)}
          />
        ))}
      </Controls>
    </div>
  );
};
