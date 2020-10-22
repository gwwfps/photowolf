import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { gql, useMutation } from '@apollo/client';

import Button from './Button';
import Tag from './Tag';
import { taggingSelectionState } from '../state';

const TAG_PHOTO = gql`
  mutation TagPhoto($input: TagPhotoInput!) {
    tagPhoto(input: $input) {
      name
      tags
    }
  }
`;

export default ({ photo: { name, num, tags }, width, height, tagging }) => {
  const history = useHistory();
  const viewImage = useCallback(() => {
    history.push(`/view/${name}`);
  }, [name, history]);
  const [taggingSelection] = useRecoilState(taggingSelectionState);
  const [tagPhoto, { data }] = useMutation(TAG_PHOTO);

  const tagImage = useCallback(() => {
    if (!taggingSelection) {
      return;
    }
    tagPhoto({
      variables: {
        input: {
          name,
          tag: taggingSelection,
        },
      },
    });
  }, [taggingSelection]);

  return (
    <div
      className="bg-top bg-cover"
      style={{
        height,
        width,
        backgroundImage: `url("/photos/${name}")`,
      }}
    >
      <div className="relative h-full -w-full bg-white transition ease-in-out duration-200 bg-opacity-50 opacity-0 hover:opacity-100">
        <div className="tile-num absolute top-0 left-0 my-3 mx-6 text-xl text-white cursor-default">
          {num}
        </div>
        <ul className="absolute inset-y-0 right-0 m-3 text-right">
          {tags.sort().map(tag => (
            <li className="" key={tag}>
              <Tag {...{ tag }} />
            </li>
          ))}
        </ul>
        <Button
          className="absolute bottom-0 left-0 m-3"
          onClick={tagging ? tagImage : viewImage}
        >
          {tagging ? 'Tag' : 'View'}
        </Button>
      </div>
    </div>
  );
};
