import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouteMatch } from 'react-router-dom';

import Gallery from './Gallery';
import Photo from './Photo';
import Preloader from './Preloader';
import { useLocalStoragePersistenceObserver } from '../state';

const PHOTOS_QUERY = gql`
  query Photos {
    photos {
      name
      notes
      tags
      updated
      deleted
    }
  }
`;

export default () => {
  const { loading, error, data } = useQuery(PHOTOS_QUERY, {
    pollInterval: 60000,
  });
  useLocalStoragePersistenceObserver();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  let content;

  const match = useRouteMatch('/view/:name');
  if (match) {
    const photo = data.photos.find(({ name }) => name === match.params.name);
    if (photo) {
      content = <Photo {...{ photo }} />;
    } else {
      content = <p>Not found</p>;
    }
  } else {
    content = <Gallery photos={data.photos} />;
  }

  return (
    <>
      {content}
      <Preloader photos={data.photos} />
    </>
  );
};
