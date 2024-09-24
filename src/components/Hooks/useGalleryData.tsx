import { useState, useEffect, useCallback } from 'react';
import {
  useGetPaintingsQuery,
  useGetArtistsQuery,
  useGetLocationsQuery,
} from '../../service/paintingApi';
import { Filters } from '../Gallery/Gallery';

const useGalleryData = (
  limit: number,
  filters: Filters,
  searchTerm: string,
) => {
  const [page, setPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const debounceSearch = useCallback((value: string) => {
    setDebouncedSearchTerm(value);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const {
    data: paintingsData,
    isLoading: loading,
    error,
  } = useGetPaintingsQuery({
    page,
    limit,
    filters: {
      q: debouncedSearchTerm.toLowerCase(),
      created_gte: filters.fromYear || undefined,
      created_lte: filters.toYear || undefined,
      authorId: filters.artist || undefined,
      locationId: filters.location || undefined,
    },
  });

  const { data: artistsData } = useGetArtistsQuery();
  const { data: locationsData } = useGetLocationsQuery();

  const paintings = paintingsData?.data || [];
  const totalPages = Math.ceil((paintingsData?.totalCount || 0) / limit);
  const artists = artistsData || [];
  const locations = locationsData || [];

  return {
    paintings,
    loading,
    error,
    debounceSearch,
    page,
    setPage,
    totalPages,
    artists,
    locations,
  };
};

export default useGalleryData;
