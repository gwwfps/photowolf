import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { gql, useMutation } from '@apollo/client';
import cx from 'classnames';

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

const DELETE_PHOTO = gql`
  mutation DeletePhoto($input: DeletePhotoInput!) {
    deletePhoto(input: $input) {
      name
      deleted
    }
  }
`;

export default ({
  photo: { name, num, tags },
  width,
  height,
  tagging,
  deleting,
}) => {
  const history = useHistory();
  const viewImage = useCallback(() => {
    history.push(`/view/${name}`);
  }, [name, history]);

  const taggingSelection = useRecoilValue(taggingSelectionState);

  const [tagPhoto] = useMutation(TAG_PHOTO);
  const [deletePhoto] = useMutation(DELETE_PHOTO);

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
  }, [name, taggingSelection]);
  const deleteImage = useCallback(() => {
    deletePhoto({
      variables: {
        input: {
          name,
        },
      },
    });
  }, [name]);

  const handleClick = useCallback(() => {
    if (tagging) {
      tagImage();
    } else if (deleting) {
      deleteImage();
    } else {
      viewImage();
    }
  }, [viewImage, tagImage, deleteImage, deleting, tagging]);

  let buttonLabel = 'View';
  if (tagging) {
    buttonLabel = tags.includes(taggingSelection) ? 'Untag' : 'Tag';
  } else if (deleting) {
    buttonLabel = 'Delete';
  }

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
          className={cx(['absolute', 'bottom-0', 'left-0', 'm-3'], {
            'bg-red-300 hover:bg-red-400': deleting,
          })}
          onClick={handleClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};
