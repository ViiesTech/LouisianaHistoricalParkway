import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Container from '../../components/Container';
import NormalText from '../../components/NormalText';
import Button from '../../components/Button';
import colors from '../../assets/colors';
import BoldText from '../../components/BoldText';
import { responsiveHeight } from '../../utils/helperFunctions';

const OPTIONS = [
  'Historical Landmarks',
  'Nature & Scenery',
  'Cultural Attractions',
  'Food & Dining',
  'Shopping & Local Goods',
];

const ChooseInterest = ({ navigation }) => {
  const [selected, setSelected] = useState<string[]>([]);
  console.log('selected', selected);

  const toggle = (label: string) => {
    setSelected(prev =>
      prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label],
    );
  };

  return (
    <Container
      heading="Customize your Experience"
      showBack={true}
      gap={8}
      padding={3}
    >
      <NormalText
        title={'Select your interests to get personalized recommendations'}
        color={colors.placeholderColor}
        size={2}
        mrgnTop={1.5}
      />

      <View style={styles.listWrap}>
        {OPTIONS.map(option => {
          const isChecked = selected.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => toggle(option)}
              style={styles.optionRow}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, isChecked && styles.checked]}>
                {isChecked && <View style={styles.tick} />}
              </View>
              <NormalText title={option} size={2.1} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Button
          title={'Create Account'}
          onPress={() => navigation.navigate('SignUp', { interests: selected })}
          backgroundColor={colors.white}
          borderWidth={1}
          borderColor={colors.smallIconsBg}
          buttonTextColor={colors.smallIconsBg}
          borderRadius={8}
          style={{ marginBottom: 12 }}
        />

        <Button
          onPress={() => navigation.navigate('LoginAsGuest')}
          title={'Continue as Guest'}
          borderRadius={8}
        />
      </View>
    </Container>
  );
};

export default ChooseInterest;

const styles = StyleSheet.create({
  listWrap: {
    marginTop: responsiveHeight(4),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checked: {
    borderColor: colors.primary,
    backgroundColor: '#E8F6F4',
  },
  tick: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  actions: {
    marginTop: 20,
  },
});
