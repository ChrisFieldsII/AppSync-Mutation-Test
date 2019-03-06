import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import faker from 'faker';

import styles from './styles';
import { listGames } from './src/graphql/queries';
import { createGame } from './src/graphql/mutations';
import { onCreateGame } from './src/graphql/subscriptions';

const renderGame = ({ item: game }) => {
  const { id, name, price, rating } = game;

  return (
    <TouchableOpacity style={styles.gameCell}>
      <Text>{id}</Text>
      <View style={styles.namePriceContainer}>
        <Text>Name: {name}</Text>
        <Text>Price: ${price}</Text>
      </View>
      <Text>Rating: {rating}</Text>
    </TouchableOpacity>
  );
};

const RATINGS = ['EVERYONE', 'TEEN', 'MATURE', 'XXX'];
const PRICES = [5, 12, 20, 30, 60];
const onCreateGameOnPress = async createGame => {
  const input = {
    name: faker.fake('{{random.word}}'),
    price: PRICES[Math.floor(Math.random() * PRICES.length)],
    rating: RATINGS[Math.floor(Math.random() * RATINGS.length)],
  };
  await createGame({ variables: { input } });
};

const App = ({ data, createGame }) => {
  const { loading, error, subscribeToMore } = data;

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{`Error! ${error.message}`}</Text>;

  subscribeToMore(buildSubscription(gql(onCreateGame), gql(listGames)));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <FlatList
          data={data.listGames.items}
          keyExtractor={game => game.id}
          renderItem={renderGame}
          style={styles.gameList}
        />
        <TouchableOpacity
          style={styles.createGameBtn}
          onPress={() => onCreateGameOnPress(createGame)}
        >
          <Text style={styles.btnText}>Create Game</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default compose(
  graphql(gql(listGames), { options: { fetchPolicy: 'cache' } }),
  graphqlMutation(gql(createGame), gql(listGames), 'Game'),
)(App);
