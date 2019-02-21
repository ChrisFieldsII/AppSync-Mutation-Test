import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
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
