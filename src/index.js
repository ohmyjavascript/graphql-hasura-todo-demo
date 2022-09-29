import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';

// instantiate a client
const client = new ApolloClient({
  uri: 'https://easy-stork-47.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret':
      'fUmKEfiE6thXp8MrhT2r0bRVFFq5THZsB0NI7QFLaxl0xwrkRBOrgscqv7dVkz42',
  },
});

client
  .query({
    query: gql`
      query getTodos {
        todos {
          done
          id
          text
        }
      }
    `,
  })
  .then((result) => console.log(result));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
