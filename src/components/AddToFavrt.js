/* eslint-disable react-native/no-inline-styles */
import { TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../assets/colors';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight } from '../utils/helperFunctions';
import { useAddToFavoriteMutation } from '../redux/services/Main';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices';
import { ShowToast } from '../GlobalFunctions';
const AddToFavrt = ({ style, cityId, onSuccess, isProcessing = false, onProcessingChange }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector(state => state.persistedData);
  const favouriteCities = user?.favouriteCities || [];
  const [addToFavorite] = useAddToFavoriteMutation();
  console.log('favouriteCities', favouriteCities);

  const isFavourite = !!favouriteCities.find(f => {
    try {
      if (f && typeof f === 'object' && f._id)
        return String(f._id) === String(cityId);
      return String(f) === String(cityId);
    } catch (e) {
      return false;
    }
  });
  console.log('isFavourite', isFavourite);
  const [localFav, setLocalFav] = useState(isFavourite);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLocalFav(isFavourite);
  }, [isFavourite]);

  const handleAddToFavorite = async () => {
    if (isGuest) {
      ShowToast('error', 'Please sign in to add favorites');
      return;
    }
    if (processing || isProcessing) return;
    const prev = localFav;
    // optimistic UI
    setLocalFav(!prev);
    setProcessing(true);
    if (onProcessingChange) onProcessingChange(true);
    try {
      const response = await addToFavorite(cityId).unwrap();
      const message = response?.message || '';

      let updatedFavs = Array.isArray(favouriteCities)
        ? [...favouriteCities]
        : [];
      const storesObjects =
        updatedFavs.length > 0 &&
        typeof updatedFavs[0] === 'object' &&
        updatedFavs[0]?._id;

      const matchesId = item => {
        if (!item) return false;
        if (typeof item === 'object' && item._id)
          return String(item._id) === String(cityId);
        return String(item) === String(cityId);
      };

      if (message.toLowerCase().includes('added')) {
        if (!updatedFavs.find(matchesId)) {
          updatedFavs.push(storesObjects ? { _id: cityId } : cityId);
        }
      } else if (message.toLowerCase().includes('removed')) {
        updatedFavs = updatedFavs.filter(item => !matchesId(item));
      }

      dispatch(setUserData({ ...user, favouriteCities: updatedFavs }));

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.log('addToFavorite error', err);
      // revert optimistic change
      setLocalFav(prev);
      ShowToast('error', 'Could not update favourite. Try again.');
    } finally {
      setProcessing(false);
      if (onProcessingChange) onProcessingChange(false);
    }
  };
  return (
    <TouchableOpacity
      onPress={handleAddToFavorite}
      style={[
        {
          backgroundColor: '#F7DB44',
          padding: responsiveHeight(0.9),
          borderRadius: responsiveHeight(2.5),
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Ionicons
        name={localFav ? 'heart' : 'heart-outline'}
        size={25}
        color={colors.black}
      />
    </TouchableOpacity>
  );
};

export default AddToFavrt;
