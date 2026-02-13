import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, endpoints } from '../constant';

export const MainApis = createApi({
  reducerPath: 'mainApis',
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
  tagTypes: ['UserDetails', 'Cities'],
  endpoints: builder => ({
    getAllCities: builder.query({
      query: params => ({
        url: `${endpoints.GETALLCITIES}?${new URLSearchParams(
          params,
        ).toString()}`,
        method: 'GET',
      }),
      providesTags: ['Cities'],
    }),
    getSingleCity: builder.query({
  query: _id => ({
    url: endpoints.GETSINGLECITY(_id),
    method: 'GET',
  }),
}),
    getAllEntities: builder.query({
      query: params => ({
        url: `${endpoints.GETALLENTITIES}?${new URLSearchParams(
          params,
        ).toString()}`,
        method: 'GET',
      }),
    }),
    getTouristSpots: builder.query({
      query: () => ({
        url: endpoints.GETALLTOURS,
        method: 'GET',
      }),
    }),
    getAllBusinesses: builder.query({
      query: params => ({
        url: `${endpoints.GETALLBUSINESSES}?${new URLSearchParams(
          params,
        ).toString()}`,
        method: 'GET',
      }),
    }),
    getBusinessDetails: builder.query({
      query: _id => ({
        url: endpoints.GETBUSINESSDETAILS(_id),
        method: 'GET',
      }),
    }),
    getUserDetails: builder.query({
      query: () => ({
        url: endpoints.GETUSERDETAILS(),
        method: 'GET',
      }),
      providesTags: ['UserDetails'],
    }),
    addCityReview: builder.mutation({
      query: ({ _id, reviewData }) => ({
        url: endpoints.ADDCITYREVIEW(_id),
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Cities'],
    }),
    addBusinessReview: builder.mutation({
      query: ({ _id, reviewData }) => ({
        url: endpoints.ADDBUSINESSREVIEW(_id),
        method: 'POST',
        body: reviewData,
      }),
    }),
    createItinerary: builder.mutation({
      query: ({ itineraryData }) => ({
        url: endpoints.CREATEITINERARY(),
        method: 'POST',
        body: itineraryData,
      }),
      invalidatesTags: ['UserDetails'],
    }),
    deleteItinerary: builder.mutation({
      query: _id => ({
        url: endpoints.DELETEITINERARY(_id),
        method: 'DELETE',
      }),
      invalidatesTags: ['UserDetails'],
    }),
    addToFavorite: builder.mutation({
      query: _id => ({
        url: endpoints.ADDTOFVRT(_id),
        method: 'PATCH',
      }),
      invalidatesTags: ['UserDetails'],
    }),
    markAsVisited: builder.mutation({
      query: _id => ({
        url: endpoints.MARKVISITED(_id),
        method: 'PATCH',
      }),
      invalidatesTags: ['UserDetails'],
    }),
  }),
});

export const {
  useLazyGetAllCitiesQuery,
  useLazyGetTouristSpotsQuery,
  useGetAllBusinessesQuery,
  useLazyGetBusinessDetailsQuery,
  useLazyGetAllEntitiesQuery,
  useLazyGetUserDetailsQuery,
  useAddCityReviewMutation,
  useAddToFavoriteMutation,
  useMarkAsVisitedMutation,
  useAddBusinessReviewMutation,
  useCreateItineraryMutation,
  useDeleteItineraryMutation,
  useLazyGetSingleCityQuery,
} = MainApis;
