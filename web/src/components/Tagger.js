import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import Tag from './Tag';
import Input from './Input';
import Controls from './Controls';
import { taggingSelectionState } from '../state';
import groupTags from '../utils/group-tags';

export default ({ allTags, photos }) => {
  const [taggingSelection, setTaggingSelection] = useRecoilState(
    taggingSelectionState
  );
  const handleSelectionChange = useCallback(({ target: { value } }) => {
    setTaggingSelection(value);
  }, []);

  return (
    <div className="flex fixed inset-x-0 bottom-0 justify-center">
      <Controls>
        <Input value={taggingSelection} onChange={handleSelectionChange} />
        <div className="w-full px-3">
          {groupTags(allTags).map(({ kind, tags }) => (
            <div key={kind}>
              {tags.map(tag => (
                <Tag
                  key={tag}
                  {...{ tag }}
                  onClick={setTaggingSelection}
                  count={photos.filter(({ tags }) => tags.includes(tag)).length}
                />
              ))}
            </div>
          ))}
        </div>
      </Controls>
    </div>
  );
};
