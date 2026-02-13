import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, endpoints } from '../constant';

export const Apis = createApi({
  reducerPath: 'authApis',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().persistedData.token;
      console.log('state ===>', token);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    register: builder.mutation({
      query: data => ({
        url: endpoints.REGISTER,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: data => ({
        url: endpoints.LOGIN,
        method: 'POST',
        body: data,
      }),
    }),
    loginAsGuest: builder.mutation({
      query: data => ({
        url: endpoints.GUESTLOGIN,
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: data => ({
        url: endpoints.SEND_EMAIL,
        method: 'POST',
        body: data,
      }),
    }),
    verifyForgotPass: builder.mutation({
      query: data => ({
        url: endpoints.verifyPassOtp,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: data => ({
        url: endpoints.RESET_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: data => ({
        url: endpoints.UPDATE_PROFILE,
        method: 'PATCH',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: data => ({
        url: endpoints.CHANGE_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),
    deleteAccount: builder.mutation({
      query: data => ({
        url: endpoints.DELETE_ACCOUNT,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLoginAsGuestMutation,
  useForgotPasswordMutation,
  useVerifyForgotPassMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = Apis;
