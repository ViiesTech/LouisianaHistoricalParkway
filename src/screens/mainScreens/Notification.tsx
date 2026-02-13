import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { icons } from '../../icons';
import SVGXml from '../../components/SvgIcon';
import colors from '../../assets/colors';
import moment from 'moment';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/helperFunctions';
import { useLazyGetUserDetailsQuery } from '../../redux/services/Main';

const Notification = () => {
  const [getUserDetails, { isLoading, data }] = useLazyGetUserDetailsQuery();
  const notifications = data?.user?.notifications || [];

  useEffect(() => {
    getUserDetails()
      .unwrap()
      .then(res => {
        console.log('res of user details', res);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, []);

  // Get icon based on notification category
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'info':
        return icons.profile2;
      case 'booking':
        return icons.calendar;
      case 'payment':
        return icons.creditCard;
      default:
        return icons.calendar;
    }
  };

  const renderItem = ({ item }) => {
    const createdDate = moment(item.createdAt);
    const formattedDate = createdDate.format('DD MMM, YYYY');
    const formattedTime = createdDate.format('hh:mm A');
    
    return (
      <View style={styles.itemRow}>
        <View style={styles.leftIconWrap}>
          <View style={styles.leftCircle}>
            <SVGXml 
              xml={getCategoryIcon(item.category)} 
              icon={getCategoryIcon(item.category)} 
              width={22} 
              height={22} 
            />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            {!item.isRead && (
              <View style={styles.newPill}>
                <Text style={styles.newText}>New</Text>
              </View>
            )}
          </View>
          <Text style={styles.dateLine}>{`${formattedDate}  |  ${formattedTime}`}</Text>
          <Text numberOfLines={3} style={styles.bodyText}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <Container padding={0.001}>
      <Header title="Notification" showRightIcon={false}  />
      <View style={{ padding: responsiveHeight(1.5) }}>
        {isLoading ? (
          <View style={{ padding: responsiveHeight(6), alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.theme2} />
          </View>
        ) : notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={{ padding: responsiveHeight(6), alignItems: 'center' }}>
            <Text style={{ color: colors.theme, fontSize: responsiveFontSize(2) }}>
              No notifications yet
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
};

export default Notification;

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(8),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: responsiveWidth(1),
    marginBottom: responsiveHeight(3),
  },
  leftIconWrap: {
    width: responsiveWidth(14),
    alignItems: 'center',
  },
  leftCircle: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    backgroundColor: '#F5C702',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingRight: responsiveWidth(2),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(2.1),
    fontWeight: '700',
    color: colors.black,
    flex: 1,
  },
  newPill: {
    backgroundColor: colors.smallSideTxt,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: 8,
    marginLeft: responsiveWidth(2),
  },
  newText: {
    color: 'white',
    fontSize: responsiveFontSize(1.4),
  },
  dateLine: {
    color: colors.settings,
    marginTop: responsiveHeight(0.5),
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(1.4),
  },
  bodyText: {
    color: colors.theme,
    fontSize: responsiveFontSize(1.6),
  },
});
