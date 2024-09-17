import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paintingApi = createApi({
  reducerPath: 'paintingApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://test-front.framework.team/' }),
  endpoints: (builder) => ({
    getPaintings: builder.query<
      any,
      { page: number; limit: number; filters: any }
    >({
      query: ({ page, limit, filters }) => ({
        url: 'paintings',
        params: {
          _page: page,
          _limit: limit,
          ...filters,
        },
      }),
      transformResponse: (response: any, meta) => ({
        data: response,
        totalCount: parseInt(
          meta?.response?.headers.get('x-total-count') || '0',
          10,
        ),
      }),
    }),
    getArtists: builder.query<any, void>({
      query: () => 'authors',
    }),
    getLocations: builder.query<any, void>({
      query: () => 'locations',
    }),
  }),
});

export const {
  useGetPaintingsQuery,
  useGetArtistsQuery,
  useGetLocationsQuery,
} = paintingApi;
