/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from '../../components/Container';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import colors from '../../assets/colors';
import BoldText from '../../components/BoldText';
import NormalText from '../../components/NormalText';
import LineBreak from '../../components/LineBreak';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { images } from '../../assets/images';
import { useLazyGetUserDetailsQuery } from '../../redux/services/Main';
import { BASE_URL } from '../../redux/constant';
import AddToFavrt from '../../components/AddToFavrt';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';
const Favourites = ({ navigation }) => {
  const { isGuest } = useSelector(state => state.persistedData);
  const [getUserDetails, { isLoading, data,isFetching }] = useLazyGetUserDetailsQuery();
  const { favouriteCities } = data?.user || {};
  const [isProcessingFavorite, setIsProcessingFavorite] = useState(false);

  const getUserData = () => {
    return getUserDetails()
      .unwrap()
      .then(res => {
        console.log('res of user details', res);
        return res;
      })
      .catch(err => {
        console.log('err', err);
        throw err;
      });
  };
  useEffect(() => {
    getUserData();
  }, []);

  // Empty State Component
  const EmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(10),
        // paddingTop: responsiveHeight(15),
      }}
    >
      <FontAwesome
        name="heart-o"
        size={80}
        color={colors.placeholderColor}
        style={{ marginBottom: responsiveHeight(3) }}
      />
      <BoldText
        size={3}
        title={isGuest ? 'Sign In Required' : 'No Favorite Parishes Yet'}
        style={{ textAlign: 'center', marginBottom: responsiveHeight(1.5) }}
      />
      <NormalText
        title={
          isGuest
            ? 'Please sign in to save your favorite parishes!'
            : 'Start exploring Louisiana and add parishes to your favorites!'
        }
        color={colors.placeholderColor}
        align="center"
      />
    </View>
  );

  return (
    <Container padding={0.001} style={{ position: 'relative' }}>
      <Header title="My Parishes" showRightIcon={false} />
      <View style={{ flex: 1 }}>
        {isLoading || isFetching ? (
          <View
            style={{
              flex: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size={'large'} color={colors.theme2} />
          </View>
        ) : !favouriteCities || favouriteCities.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            contentContainerStyle={{
              gap: responsiveHeight(2),
              padding: responsiveHeight(2),
            }}
            data={favouriteCities}
            renderItem={({ item, index }) => {
              console.log('item', item._id);
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CityDetails', { cityData: item })
                  }
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: responsiveHeight(2.5),
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                    elevation: 5,
                    flexDirection: 'row',
                    gap: responsiveHeight(2),
                    padding: responsiveHeight(1.5),
                  }}
                >
                  <FastImage
                    source={{
                      uri: item?.gallery?.find(url =>
                        url?.toLowerCase().match(/\.(jpg|jpeg|png)$/i),
                      ),
                    }}
                    style={{
                      width: responsiveWidth(28),
                      height: responsiveHeight(13.3),
                      borderRadius: responsiveHeight(2),
                    }}
                  />
                  <View
                    style={{
                      width: responsiveWidth(55),
                      gap: responsiveHeight(1.4),
                      marginTop: responsiveHeight(0.5),
                      right: 5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: responsiveWidth(55),
                        gap: responsiveHeight(1),
                        justifyContent: 'space-between',
                      }}
                    >
                      <BoldText size={2.5} width={40} title={item?.name} />
                      <AddToFavrt
                        cityId={item._id}
                        onSuccess={() => {
                          // Keep loader visible while refreshing the list
                          getUserData()
                            .then(() => {
                              // Hide loader only after list is updated
                              setIsProcessingFavorite(false);
                            })
                            .catch(() => {
                              setIsProcessingFavorite(false);
                            });
                        }}
                        onProcessingChange={processing => {
                          setIsProcessingFavorite(processing);
                        }}
                      />
                      {/* <FontAwesome name="heart" size={25} /> */}
                    </View>
                    <View
                      style={{ flexDirection: 'row', gap: responsiveHeight(2) }}
                    >
                      <View style={{ marginTop: 5 }}>
                        <FontAwesome6
                          name="location-dot"
                          size={25}
                          color={colors.theme2}
                        />
                      </View>
                      <NormalText width={43} title={item?.address} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      {/* Beautiful centered loading overlay - covers entire screen */}
      {isProcessingFavorite && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              padding: responsiveHeight(4),
              borderRadius: responsiveHeight(2),
              alignItems: 'center',
              minWidth: responsiveWidth(60),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <ActivityIndicator size="large" color={colors.theme2} />
            <LineBreak val={2} />
            <BoldText
              title="Updating Favorites..."
              color={colors.theme2}
              size={2.4}
              align="center"
            />
            <LineBreak val={0.5} />
            <NormalText
              title="Please wait"
              color={colors.labelColor}
              size={1.8}
              align="center"
            />
          </View>
        </View>
      )}
    </Container>
  );
};

export default Favourites;
