/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Container from '../../components/Container';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from '../../utils/helperFunctions';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import LineBreak from '../../components/LineBreak';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {
  useLazyGetAllEntitiesQuery,
  useCreateItineraryMutation,
  useLazyGetUserDetailsQuery,
  useDeleteItineraryMutation,
} from '../../redux/services/Main';
import { getCurrentLocation, ShowToast } from '../../GlobalFunctions';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';

const MyItineraries = ({ navigation }: any) => {
  const { isGuest } = useSelector((state: any) => state.persistedData);
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>(
    'start',
  );
  const [itineraryName, setItineraryName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>([]);
  const [getAllEntities, { data, isLoading }] = useLazyGetAllEntitiesQuery();
  const [createItinerary, { isLoading: isCreating }] =
    useCreateItineraryMutation();
  const [getUserDetails, { data: userDetailsData, isLoading: isFetchingUser }] =
    useLazyGetUserDetailsQuery();
  const [deleteItinerary, { isLoading: isDeleting }] =
    useDeleteItineraryMutation();
  console.log('daaata', data);

  const fetchNearbyEntities = React.useCallback(async () => {
    try {
      const location: any = await getCurrentLocation();
      if (location && !location.error) {
        await getAllEntities({
          latitude: 38.7493,
          longitude: -77.4719,
          maxDistance: 5000000, // 5000 km radius
        }).unwrap();
      }
    } catch (err) {
      console.log('Error fetching entities:', err);
    }
  }, [getAllEntities]);

  // Fetch user details to get itineraries on mount
  useEffect(() => {
    getUserDetails({});
  }, [getUserDetails]);

  // Fetch entities when modal opens
  useEffect(() => {
    if (showModal) {
      fetchNearbyEntities();
    }
  }, [showModal, fetchNearbyEntities]);

  // Get itineraries from API response
  const itineraries = userDetailsData?.user?.itineraries || [];

  // Get landmarks from API response
  const landmarks = data?.data || [];

  const toggleLandmark = (landmarkId: string) => {
    if (selectedLandmarks.includes(landmarkId)) {
      setSelectedLandmarks(selectedLandmarks.filter(l => l !== landmarkId));
    } else {
      setSelectedLandmarks([...selectedLandmarks, landmarkId]);
    }
  };

  const openDatePicker = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setTempDate(
      mode === 'start' ? startDate || new Date() : endDate || new Date(),
    );
    setShowDatePicker(true);
  };

  const handleCreateItinerary = async () => {
    // Validation
    if (!itineraryName.trim()) {
      ShowToast('error', 'Please enter itinerary name');
      return;
    }
    if (!startDate) {
      ShowToast('error', 'Please select start date');
      return;
    }
    if (!endDate) {
      ShowToast('error', 'Please select end date');
      return;
    }
    if (endDate < startDate) {
      ShowToast('error', 'End date must be after start date');
      return;
    }
    if (selectedLandmarks.length === 0) {
      ShowToast('error', 'Please select at least one landmark');
      return;
    }

    // Map selected landmarks to places array with correct placeModel
    const places = selectedLandmarks.map(landmarkId => {
      const entity = landmarks.find((e: any) => e._id === landmarkId);
      let placeModel = 'City'; // default

      if (entity) {
        const type = entity.type?.toLowerCase();
        if (type === 'city') {
          placeModel = 'City';
        } else if (type === 'touristspot' || type === 'touristSpot') {
          placeModel = 'TouristSpot';
        } else if (type === 'business') {
          placeModel = 'Business';
        }
      }

      return {
        placeId: landmarkId,
        placeModel: placeModel,
      };
    });

    const itineraryData = {
      title: itineraryName,
      description: description || 'Exploring Louisiana',
      startDate: moment(startDate).format('DD-MM-YYYY'),
      endDate: moment(endDate).format('DD-MM-YYYY'),
      places: places,
    };

    try {
      await createItinerary({ itineraryData }).unwrap();
      ShowToast('success', 'Itinerary created successfully!');
      // Refetch user details to update itineraries list
      await getUserDetails({});
      setShowModal(false);
      setItineraryName('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      setSelectedLandmarks([]);
    } catch (err: any) {
      console.log('Error creating itinerary:', err);
      ShowToast('error', err?.data?.message || 'Failed to create itinerary');
    }
  };

  const handleDeleteItinerary = (itineraryId: string, title: string) => {
    Alert.alert(
      'Delete Itinerary',
      `Are you sure you want to delete "${title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItinerary(itineraryId).unwrap();
              ShowToast('success', 'Itinerary deleted successfully');
              // Refetch user details to update list
              await getUserDetails({});
            } catch (err: any) {
              console.log('Error deleting itinerary:', err);
              ShowToast(
                'error',
                err?.data?.message || 'Failed to delete itinerary',
              );
            }
          },
        },
      ],
    );
  };

  return (
    // <Container
    //   padding={2}
    //   gap={0}
    //   showBack={true}
    //   heading="My Itineraries"
    //   scrollEnabled={true}
    //   headerStyle={{}}
    // >
    <Container padding={0.001} hasTabBar={true}>
      <Header title="My Itineraries" showRightIcon={false} />
      <LineBreak val={2} />
      <View style={{ padding: responsiveHeight(2) }}>
        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={() => {
            if (isGuest) {
              ShowToast('error', 'Please sign in to create itineraries');
              return;
            }
            setShowModal(true);
          }}
        >
          <Text style={styles.createButtonText}>Create New Itinerary</Text>
        </TouchableOpacity>
        <LineBreak val={2} />

        {isFetchingUser ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.theme2} />
            <Text style={styles.loadingText}>Loading itineraries...</Text>
          </View>
        ) : itineraries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="map-outline"
              size={64}
              color={colors.placeholderColor}
            />
            <Text style={styles.emptyTitle}>
              {isGuest ? 'Sign In Required' : 'No Itineraries Yet'}
            </Text>
            <Text style={styles.emptyText}>
              {isGuest
                ? 'Please sign in to create and manage your travel itineraries.'
                : 'Create your first itinerary to start planning your Louisiana adventure!'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={itineraries}
            keyExtractor={item => item._id}
            contentContainerStyle={{
              gap: responsiveHeight(1.5),
              padding: responsiveHeight(1),
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itineraryCard}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('ItinerariesDetails', { itinerary: item })
                }
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.itineraryTitle}>{item.title}</Text>
                  <LineBreak val={0.5} />
                  {item.description && (
                    <>
                      <Text style={styles.descriptionText} numberOfLines={2}>
                        {item.description}
                      </Text>
                      <LineBreak val={0.5} />
                    </>
                  )}
                  <View style={styles.itineraryInfo}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={colors.theme}
                    />
                    <Text style={styles.itineraryInfoText}>
                      {moment(item.startDate, 'DD-MM-YYYY').format('MMM DD')} -{' '}
                      {moment(item.endDate, 'DD-MM-YYYY').format(
                        'MMM DD, YYYY',
                      )}
                    </Text>
                  </View>
                  <LineBreak val={0.3} />
                  <View style={styles.itineraryInfo}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={colors.theme}
                    />
                    <Text style={styles.itineraryInfoText}>
                      {item.places?.length || 0} Stops
                    </Text>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={colors.theme}
                      style={{ marginLeft: responsiveHeight(1) }}
                    />
                    <Text style={styles.itineraryInfoText}>
                      {item.duration}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteItinerary(item._id, item.title)}
                  disabled={isDeleting}
                  style={{ padding: responsiveHeight(1) }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={isDeleting ? colors.placeholderColor : colors.theme}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Loading overlay when creating */}
        {isCreating && (
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
              zIndex: 9999,
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
              <Text
                style={{
                  marginTop: responsiveHeight(2),
                  fontSize: responsiveFontSize(2.2),
                  fontFamily: fonts.Semi_Bold,
                  color: colors.theme2,
                }}
              >
                Creating Itinerary...
              </Text>
              <Text
                style={{
                  marginTop: responsiveHeight(0.5),
                  fontSize: responsiveFontSize(1.6),
                  color: colors.placeholderColor,
                }}
              >
                Please wait
              </Text>
            </View>
          </View>
        )}

        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View style={styles.modalOverlay}>
              <ScrollView
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Create Itinerary</Text>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                      <Ionicons name="close" size={24} color={colors.black} />
                    </TouchableOpacity>
                  </View>
                  <LineBreak val={2} />

                  <Text style={styles.label}>Itinerary Name</Text>
                  <LineBreak val={0.5} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Weekend Adventure"
                    placeholderTextColor={colors.placeholderColor}
                    value={itineraryName}
                    onChangeText={setItineraryName}
                  />
                  <LineBreak val={1.5} />

                  <Text style={styles.label}>Description (Optional)</Text>
                  <LineBreak val={0.5} />
                  <TextInput
                    style={[styles.input, { height: responsiveHeight(10) }]}
                    placeholder="Describe your trip..."
                    placeholderTextColor={colors.placeholderColor}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                  />
                  <LineBreak val={1.5} />

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: responsiveHeight(1.5),
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Start Date</Text>
                      <LineBreak val={0.5} />
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => openDatePicker('start')}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color={colors.theme2}
                        />
                        <Text
                          style={[
                            styles.dateButtonText,
                            !startDate && { color: colors.placeholderColor },
                          ]}
                        >
                          {startDate
                            ? moment(startDate).format('DD MMM YYYY')
                            : 'Select date'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>End Date</Text>
                      <LineBreak val={0.5} />
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => openDatePicker('end')}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color={colors.theme2}
                        />
                        <Text
                          style={[
                            styles.dateButtonText,
                            !endDate && { color: colors.placeholderColor },
                          ]}
                        >
                          {endDate
                            ? moment(endDate).format('DD MMM YYYY')
                            : 'Select date'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <LineBreak val={2} />

                  <Text style={styles.label}>Select Landmarks</Text>
                  <LineBreak val={1} />

                  {isLoading ? (
                    <View
                      style={{
                        padding: responsiveHeight(3),
                        alignItems: 'center',
                      }}
                    >
                      <ActivityIndicator size="large" color={colors.theme2} />
                      <LineBreak val={1} />
                      <Text style={styles.landmarkText}>
                        Loading landmarks...
                      </Text>
                    </View>
                  ) : landmarks.length === 0 ? (
                    <View
                      style={{
                        padding: responsiveHeight(3),
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={40}
                        color={colors.placeholderColor}
                      />
                      <LineBreak val={1} />
                      <Text style={styles.landmarkText}>
                        No landmarks found nearby
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.landmarksList}>
                      {landmarks.map((entity: any) => (
                        <TouchableOpacity
                          key={entity._id}
                          style={styles.checkboxRow}
                          onPress={() => toggleLandmark(entity._id)}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              selectedLandmarks.includes(entity._id) &&
                                styles.checkboxChecked,
                            ]}
                          >
                            {selectedLandmarks.includes(entity._id) && (
                              <Ionicons
                                name="checkmark"
                                size={14}
                                color={colors.white}
                              />
                            )}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.landmarkText}>
                              {entity.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: responsiveHeight(0.5),
                              }}
                            >
                              <Text style={styles.landmarkType}>
                                {entity.type || entity.category || 'Location'}
                              </Text>
                              {entity.distance && (
                                <>
                                  <Text style={styles.landmarkType}>•</Text>
                                  <Ionicons
                                    name="navigate-outline"
                                    size={12}
                                    color={colors.theme2}
                                  />
                                  <Text
                                    style={[
                                      styles.landmarkType,
                                      { color: colors.theme2 },
                                    ]}
                                  >
                                    {entity.distance}
                                  </Text>
                                </>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  <LineBreak val={2} />

                  <TouchableOpacity
                    style={[
                      styles.createItineraryButton,
                      isCreating && { opacity: 0.6 },
                    ]}
                    activeOpacity={0.8}
                    onPress={handleCreateItinerary}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.createItineraryButtonText}>
                        Create Itinerary
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            onChange={(event, selectedDate) => {
              if (event.type === 'set' && selectedDate) {
                setTempDate(selectedDate);
                if (datePickerMode === 'start') {
                  setStartDate(selectedDate);
                } else {
                  setEndDate(selectedDate);
                }
              }
              setShowDatePicker(false);
            }}
          />
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: colors.theme2,
    paddingVertical: responsiveHeight(1.8),
    borderRadius: responsiveHeight(1.2),
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.white,
    fontSize: responsiveFontSize(2),
    fontFamily: fonts.Semi_Bold,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(8),
  },
  loadingText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.Regular,
    color: colors.placeholderColor,
    marginTop: responsiveHeight(1.5),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(8),
  },
  emptyTitle: {
    fontSize: responsiveFontSize(2.4),
    fontFamily: fonts.Semi_Bold,
    color: colors.black,
    marginTop: responsiveHeight(2),
  },
  emptyText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: fonts.Regular,
    color: colors.placeholderColor,
    textAlign: 'center',
    marginTop: responsiveHeight(1),
    paddingHorizontal: responsiveHeight(4),
  },
  itineraryCard: {
    padding: responsiveHeight(2),
    borderRadius: responsiveHeight(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  itineraryTitle: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: fonts.Semi_Bold,
    color: colors.black,
  },
  descriptionText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: fonts.Regular,
    color: colors.placeholderColor,
    lineHeight: responsiveHeight(2.5),
  },
  itineraryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itineraryInfoText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: fonts.Regular,
    color: colors.theme,
    marginLeft: responsiveHeight(0.5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: responsiveHeight(2),
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: responsiveHeight(2),
    padding: responsiveHeight(2.5),
    width: '100%',
    maxWidth: responsiveWidth(90),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.6),
    fontFamily: fonts.Bold,
    color: colors.black,
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.Semi_Bold,
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: responsiveHeight(1),
    padding: responsiveHeight(1.5),
    fontSize: responsiveFontSize(2),
    fontFamily: fonts.Regular,
    color: colors.black,
  },
  landmarksList: {
    gap: responsiveHeight(1.2),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1.2),
  },
  checkbox: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderRadius: responsiveHeight(0.5),
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.theme2,
    borderColor: colors.theme2,
  },
  landmarkText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.Regular,
    color: colors.black,
  },
  landmarkType: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: fonts.Regular,
    color: colors.placeholderColor,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  createItineraryButton: {
    backgroundColor: colors.theme2,
    paddingVertical: responsiveHeight(1.8),
    borderRadius: responsiveHeight(1.2),
    alignItems: 'center',
  },
  createItineraryButtonText: {
    color: colors.white,
    fontSize: responsiveFontSize(2),
    fontFamily: fonts.Semi_Bold,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: responsiveHeight(1),
    padding: responsiveHeight(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1),
  },
  dateButtonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: fonts.Regular,
    color: colors.black,
  },
});

export default MyItineraries;
