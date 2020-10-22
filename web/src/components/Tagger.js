import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import Tag from './Tag';
import Input from './Input';
import Controls from './Controls';
import { taggingSelectionState } from '../state';

export default ({ allTags }) => {
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
        <div className="w-1/2 px-3">
          {allTags.map(tag => (
            <Tag key={tag} {...{ tag }} onClick={setTaggingSelection} />
          ))}
        </div>
      </Controls>
    </div>
  );
};
