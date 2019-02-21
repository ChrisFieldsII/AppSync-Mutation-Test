import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import faker from 'faker';

import { listGames } from './src/graphql/queries';
import { createGame } from './src/graphql/mutations';
import { onCreateGame } from './src/graphql/subscriptions';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  gameCell: {
    height: 60,
    width: width - 32,
    elevation: 2,
    borderRadius: 14,
    backgroundColor: 'lightgrey',
    padding: 8,
    marginBottom: 10,
  },
  createGameBtn: {
    height: 40,
    width: width - 32,
    backgroundColor: 'teal',
    borderRadius: 20,
  },
  namePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gameList: {
    marginBottom: 20,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    marginTop: 5,
  },
});

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
  graphql(gql(listGames)),
  graphqlMutation(gql(createGame), gql(listGames), 'Game'),
)(App);
