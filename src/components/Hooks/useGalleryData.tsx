import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Filters {
  fromYear: string;
  toYear: string;
  artist: string;
  location: string;
}

interface Artist {
  id: string;
  name: string;
}

interface Location {
  id: string;
  location: string;
}

const useGalleryData = (limit: number, filters: Filters) => {
  const [paintings, setPaintings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [artists, setArtists] = useState<Record<string, string>>({});
  const [locations, setLocations] = useState<Record<string, string>>({});
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchArtistsAndLocations = async () => {
      try {
        const [artistsResponse, locationsResponse] = await Promise.all([
          axios.get<Artist[]>('https://test-front.framework.team/authors'),
          axios.get<Location[]>('https://test-front.framework.team/locations'),
        ]);

        const artistsMap = artistsResponse.data.reduce(
          (acc, artist) => ({ ...acc, [artist.id]: artist.name }),
          {} as Record<string, string>,
        );

        const locationsMap = locationsResponse.data.reduce(
          (acc, location) => ({ ...acc, [location.id]: location.location }),
          {} as Record<string, string>,
        );

        setArtists(artistsMap);
        setLocations(locationsMap);
      } catch (error) {
        console.error('Failed to fetch artists or locations:', error);
      }
    };

    fetchArtistsAndLocations();
  }, []);
  useEffect(() => {
    const fetchPaintings = async () => {
      setLoading(true);
      try {
        const response = await axios.get<any[]>(
          'https://test-front.framework.team/paintings',
          {
            params: {
              _page: page,
              _limit: limit,
              q: searchTerm.toLowerCase(),
              created_gte: filters.fromYear || undefined,
              created_lte: filters.toYear || undefined,
              authorId: filters.artist || undefined, // передаем ID художника
              locationId: filters.location || undefined, // передаем ID локации
            },
          },
        );
        setPaintings(response.data);
        const totalCount = response.headers['x-total-count'];
        setTotalPages(Math.ceil(totalCount / limit));
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPaintings();
  }, [page, searchTerm, limit, filters]);

  const debounceSearch = (searchValue: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTerm(searchValue);
      setPage(1);
    }, 500);
  };

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
