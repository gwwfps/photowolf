import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import './app.css';
import Root from './components/Root';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

render(
  <Router>
    <ApolloProvider {...{ client }}>
      <div className="container subpixel-antialiased text-lg max-w-none">
        <Root />
      </div>
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
);
