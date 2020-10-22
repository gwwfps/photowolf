import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { RecoilRoot } from 'recoil';

import './app.css';
import Root from './components/Root';
import { initializeState } from './state';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Photo: {
        keyFields: ['name'],
      },
    },
  }),
});

render(
  <RecoilRoot {...{ initializeState }}>
    <Router>
      <ApolloProvider {...{ client }}>
        <div className="container subpixel-antialiased text-lg max-w-none">
          <Root />
        </div>
      </ApolloProvider>
    </Router>
  </RecoilRoot>,
  document.getElementById('root')
);
