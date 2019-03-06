import React from 'react';
import { AppRegistry, AsyncStorage, Alert } from 'react-native';
import Amplify from 'aws-amplify';
import { ApolloProvider } from 'react-apollo';
import { Rehydrated } from 'aws-appsync-react';
import AWSAppSyncClient, { buildSync } from 'aws-appsync';
import gql from 'graphql-tag';

import App from './App';
import { name as appName } from './app.json';
import AppSyncConfig from './aws-exports';
import DevMenuTrigger from './DevMenuTrigger';
import { listGames } from './src/graphql/queries';

Amplify.configure(AppSyncConfig);

const client = new AWSAppSyncClient({
  url: AppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AppSyncConfig.aws_project_region,
  auth: {
    type: AppSyncConfig.aws_appsync_authenticationType,
    apiKey: AppSyncConfig.aws_appsync_apiKey,
    // jwtToken: async () => token, // Required when you use Cognito UserPools OR OpenID Connect. token object is obtained previously
  },
  offlineConfig: {
    storage: AsyncStorage,
    callback: (err, succ) => {
      if (err) {
        const { mutation, variables } = err;

        Alert.alert(`Offline Callback Error`, JSON.stringify(err));
      } else {
        const { mutation, variables } = succ;

        Alert.alert(`Offline Callback Success`, JSON.stringify(succ));
      }
    },
  },
  disableOffline: false,
});

client.hydrated().then(() => {
  console.log('client is hydrated');
  client.sync(
    buildSync('Game', {
      baseQuery: gql(listGames),
    }),
  );
});

const Index = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <DevMenuTrigger>
        <App />
      </DevMenuTrigger>
    </Rehydrated>
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => Index);
