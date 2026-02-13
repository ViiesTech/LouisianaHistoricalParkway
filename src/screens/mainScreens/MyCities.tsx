/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Container from '../../components/Container';
import Header from '../../components/Header';
import colors from '../../assets/colors';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import BoldText from '../../components/BoldText';
import NormalText from '../../components/NormalText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../components/Button';
import { icons } from '../../icons';
import LineBreak from '../../components/LineBreak';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
const MyCities = ({ navigation, route }) => {
  const { isGuest } = useSelector(state => state.persistedData);
  const data = route.params?.data || [];
  const [isLoading, setIsLoading] = useState(true);
  console.log('data', data);

  useEffect(() => {
    // Simulate loading for initial render
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Empty State Component
  const EmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(10),
      }}
    >
      <FontAwesome6
        name="location-dot"
        size={80}
        color={colors.placeholderColor}
        style={{ marginBottom: responsiveHeight(3) }}
      />
      <BoldText
        size={3}
        title={isGuest ? 'Sign In Required' : 'No Visited Places Yet'}
        style={{ textAlign: 'center', marginBottom: responsiveHeight(1.5) }}
      />
      <NormalText
        title={
          isGuest
            ? 'Please sign in to track your visited parishes!'
            : 'Mark parishes as visited to keep track of your Louisiana journey!'
        }
        color={colors.placeholderColor}
        align="center"
      />
    </View>
  );

  return (
    <Container padding={0.001}>
      <Header title="My Place" showRightIcon={false} />
      <View style={{ flex: 1, padding: responsiveHeight(2) }}>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={colors.theme2} />
            <Text
              style={{
                marginTop: responsiveHeight(2),
                color: colors.placeholderColor,
              }}
            >
              Loading your places...
            </Text>
          </View>
        ) : !data || data.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            contentContainerStyle={{
              gap: responsiveHeight(3),
              padding: responsiveHeight(1),
            }}
            data={data}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    backgroundColor: colors.white,
                    padding: responsiveHeight(2),
                    borderRadius: responsiveHeight(2.5),
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                    elevation: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <BoldText size={2.3} title="United States" />
                    {/* <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: responsiveHeight(1),
                    }}
                  >
                    <NormalText color="#60605D" title="Download 32 Mb" />
                    <TouchableOpacity
                      style={{
                        borderWidth: 2.5,
                        borderColor: colors.placeholderColor,
                        padding: responsiveHeight(0.4),
                        borderRadius: responsiveHeight(2),
                      }}
                    >
                      <AntDesign
                        name="download"
                        color={colors.placeholderColor}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View> */}
                  </View>
                  <LineBreak val={1} />
                  <BoldText title={item.name} size={3.5} />
                  <LineBreak val={1.5} />
                  <NormalText color={colors.theme} title={item.description} />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: responsiveHeight(3),
                      alignItems: 'center',
                      gap: responsiveHeight(2),
                    }}
                  >
                    <Button
                      disabled
                      // onPress={() => navigation.navigate('PaidCities')}
                      icon={icons.trip}
                      style={{
                        width: '48%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: responsiveHeight(2),
                      }}
                      title={`${item?.touristSpot?.length || 0} tours`}
                    />
                    <Button
                      disabled
                      // onPress={() => navigation.navigate('PaidContinents')}
                      icon={icons.loactionPin}
                      style={{
                        width: '48%',
                        backgroundColor: colors.smallIconsBg,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: responsiveHeight(2),
                      }}
                      title="0 places"
                    />
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </Container>
  );
};

export default MyCities;
