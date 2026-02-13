/* eslint-disable react-native/no-inline-styles */
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import colors from '../assets/colors';
import Back from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight,
  responsiveWidth,
  useCustomNavigation,
} from '../utils/helperFunctions';
import BoldText from './BoldText';
import LineBreak from './LineBreak';

const Container = ({
  gap,
  showBack,
  heading,
  children,
  showVerticalHorizontal = false,
  scrollEnabled,
  padding,
  headerStyle,
  hasTabBar = false,
  enableKeyboardAvoidingView = false,
}) => {
  const { goBack } = useCustomNavigation();

  const scrollViewContent = (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={[
        styles.containerStyle,
        { padding: padding ? responsiveHeight(padding) : responsiveHeight(2) },
        hasTabBar && {
          paddingBottom: responsiveHeight(12),
        },
      ]}
      showsVerticalScrollIndicator={showVerticalHorizontal}
      keyboardShouldPersistTaps={
        enableKeyboardAvoidingView ? 'handled' : undefined
      }
    >
      <View style={headerStyle}>
        {showBack && (
          <TouchableOpacity onPress={() => goBack()}>
            <Back name={'chevron-back'} color={colors.black} size={25} />
          </TouchableOpacity>
        )}
        {gap && <LineBreak val={gap} />}
        {heading && <BoldText title={heading} />}
      </View>
      {children}
    </ScrollView>
  );

  if (enableKeyboardAvoidingView) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {scrollViewContent}
      </KeyboardAvoidingView>
    );
  }

  return scrollViewContent;
};

export default Container;

const styles = StyleSheet.create({
  containerStyle: {
    flexGrow: 1,
  },
});
