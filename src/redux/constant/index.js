export const BASE_URL = 'https://louisiana.apiforapp.link/';
export const APIKEY = 'AIzaSyD4lhQ92Xnj7eq56e6jMAMtBfZU8bVq0xs';
export const endpoints = {
  REGISTER: 'auth/signup',
  LOGIN: 'auth/signin',
  OTP: 'auth/verifyOtp',
  SEND_EMAIL: 'auth/forgotPassword',
  verifyPassOtp: 'auth/verifyOtp',
  RESET_PASSWORD: 'auth/resetPassword',
  GUESTLOGIN: 'auth/loginAsGuest',
  GETALLCITIES: 'user/cities/all',
  GETALLTOURS: 'user/touristSpots/all',
  GETALLBUSINESSES: 'user/businesses/all',
  GETBUSINESSDETAILS: _id => `user/business/${_id}`,
  GETALLENTITIES: 'user/all-entities',
  UPDATE_PROFILE: 'user/updateProfile',
  CREATEITINERARY: () => 'user/itinerary/create',
  DELETEITINERARY: _id => `user/itinerary/delete/${_id}`,
  ADDBUSINESSREVIEW: _id => `user/business/review/add/${_id}`,
  ADDCITYREVIEW: _id => `user/city/review/add/${_id}`,
  GETUSERDETAILS: () => 'user',
  ADDTOFVRT: _id => `user/city/favourite/${_id}`,
  MARKVISITED: _id => `user/city/visited/${_id}`,
  GETSINGLETOUR: _id => `user/touristSpot/${_id}`,
  GETROOMBOOKINGS: _id => `getAllBookings/?roomId=${_id}&status=Confirmed`,
  GETSINGLECITY: _id => `user/city/${_id}`,
  // getTherapistBookings: ({therapistId, bookingStatus, therapistStatus}) => {
  //   let url = `user/getBooking?therapistId=${therapistId}&bookingStatus=${bookingStatus}`;
  //   if (therapistStatus) url += `&therapistStatus=${therapistStatus}`;
  //   return url;
  // },
  // getTherapistById: ({userId, therapistId}) =>
  //   `user/getProfile?userId=${userId}&_id=${therapistId}&type=Provider`,
};
