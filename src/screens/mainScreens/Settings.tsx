/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Container from '../../components/Container';
import Header from '../../components/Header';
import colors from '../../assets/colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from '../../utils/helperFunctions';
import BoldText from '../../components/BoldText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { images } from '../../assets/images';
import NormalText from '../../components/NormalText';
import LineBreak from '../../components/LineBreak';
import SettingsList from '../../components/SettingsList';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutGuest, setUserData } from '../../redux/slices';
import { useUpdateProfileMutation } from '../../redux/services';
import { ShowToast } from '../../GlobalFunctions';
import fonts from '../../assets/fonts';

const Settings = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, isGuest, guest } = useSelector(state => state.persistedData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      ShowToast('error', 'Username cannot be empty');
      return;
    }

    if (newUsername.trim() === user?.username) {
      setShowEditModal(false);
      return;
    }

    try {
      const response = await updateProfile({
        username: newUsername.trim(),
      }).unwrap();

      // Update Redux store with new username
      dispatch(setUserData({ ...user, username: newUsername.trim() }));

      ShowToast('success', 'Username updated successfully');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating username:', error);
      ShowToast('error', error?.data?.message || 'Failed to update username');
    }
  };

  // console.log('user',user)
  return (
    <Container padding={0.001}>
      <Header
        title="Settings"
        showRightIcon={false}
        pVertical={1}
        padding={1}
      />
      <View style={{ padding: responsiveHeight(2), flex: 1 }}>
        {/* <TouchableOpacity
          style={{
            backgroundColor: colors.white2,
            borderRadius: responsiveHeight(1.5),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: responsiveHeight(1.5),
            paddingVertical: responsiveHeight(2),
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: responsiveHeight(1.5),
            }}
          >
            <Image source={images.subscription} />
            <View>
              <BoldText size={2.5} title="Pro subscription" />
              <NormalText title="Until 19 Sep 2023" />
            </View>
          </View>
          <Ionicons name="chevron-forward" size={25} />
        </TouchableOpacity> */}
        {/* <LineBreak val={2} /> */}
        <View style={{ gap: responsiveHeight(2) }}>
          <NormalText color={colors.title} title="ACCOUNT" />
          {isGuest ? null : (
            <TouchableOpacity
              onPress={() => {
                setNewUsername(user.username);
                setShowEditModal(true);
              }}
            >
              <SettingsList
                iconName="user"
                Icon={FontAwesome}
                rightTxt={user.username}
                leftTxt="Name"
                showIcon
              />
            </TouchableOpacity>
          )}
          <SettingsList
            iconName="email"
            Icon={Entypo}
            rightTxt={isGuest ? guest?.email : user?.email}
            leftTxt="Email"
          />
        </View>
        <View
          style={{ marginTop: responsiveHeight(6), gap: responsiveHeight(2) }}
        >
          <NormalText color={colors.title} title="PREFERENCES" />
          {/* <SettingsList
            iconName="notifications"
            Icon={Ionicons}
            rightTxt="Enabled"
            leftTxt="Notifications"
          /> */}
          <SettingsList
            onPress={() => navigation.navigate('HelpAndSupport')}
            disabled={false}
            iconName="information-sharp"
            Icon={Ionicons}
            leftTxt="Help"
            showBorder={false}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button
            onPress={() => dispatch(isGuest ? logoutGuest() : logout())}
            buttonTextColor={colors.smallIconsBg}
            backgroundColor={colors.white}
            borderWidth={1.5}
            borderColor={colors.smallIconsBg}
            title="Log out"
          />
        </View>
      </View>

      {/* Edit Username Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: responsiveHeight(2),
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: responsiveHeight(2),
              padding: responsiveHeight(3),
              width: '90%',
              maxWidth: 400,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <BoldText title="Edit Username" size={2.8} color={colors.black} />
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={28} color={colors.black} />
              </TouchableOpacity>
            </View>

            <LineBreak val={2} />

            <View>
              <NormalText
                title="Username"
                size={1.8}
                color={colors.labelColor}
              />
              <LineBreak val={0.5} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.white2,
                  borderRadius: responsiveHeight(1.2),
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: responsiveHeight(1.5),
                  height: responsiveHeight(6.5),
                }}
              >
                <FontAwesome name="user" size={20} color={colors.theme} />
                <TextInput
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.placeholderColor}
                  style={{
                    flex: 1,
                    marginLeft: responsiveHeight(1.5),
                    fontSize: responsiveFontSize(2),
                    fontFamily: fonts.Regular,
                    color: colors.black,
                  }}
                />
              </View>
            </View>

            <LineBreak val={3} />

            <View style={{ flexDirection: 'row', gap: responsiveHeight(1.5) }}>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  height: responsiveHeight(6),
                  backgroundColor: colors.white,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  borderRadius: responsiveHeight(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <BoldText title="Cancel" size={2} color={colors.black} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateUsername}
                disabled={isLoading}
                style={{
                  flex: 1,
                  height: responsiveHeight(6),
                  backgroundColor: isLoading
                    ? colors.border
                    : colors.smallIconsBg,
                  borderRadius: responsiveHeight(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                {isLoading && (
                  <ActivityIndicator size="small" color={colors.white} />
                )}
                <BoldText
                  title={isLoading ? 'Saving...' : 'Save'}
                  size={2}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default Settings;
