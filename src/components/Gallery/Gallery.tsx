import React, { useState } from 'react';
import './Gallery.scss';
import GalleryCard from '../GalleryCard/GalleryCard';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Pagination from '../Pagination/Pagination';
import SearchBar from '../SearchBar/SearchBar';
import useGalleryData from '../../components/Hooks/useGalleryData';

interface Artist {
  id: number;
  name: string;
}

interface Location {
  id: number;
  location: string;
}

export interface Filters {
  fromYear: string;
  toYear: string;
  artist: number | '';
  location: number | '';
}

const Gallery: React.FC = () => {
  const limit = 6;

  const [filters, setFilters] = useState<Filters>({
    fromYear: '',
    toYear: '',
    artist: '',
    location: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    paintings,
    loading,
    error,
    debounceSearch,
    page,
    setPage,
    totalPages,
    artists,
    locations,
  } = useGalleryData(limit, filters, searchTerm);

  const handleToggleTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debounceSearch(value);
    if (!value.trim()) {
      setFilters({ fromYear: '', toYear: '', artist: '', location: '' });
    }
  };

  const handleApplyFilters = (newFilters: Partial<Filters>) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ fromYear: '', toYear: '', artist: '', location: '' });
    setSearchTerm('');
    setPage(1);
  };

  return (
    <div className={`gallery-container ${isDarkMode ? 'light' : ''}`}>
      <Header onToggleTheme={handleToggleTheme} />

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        artists={artists}
        locations={locations}
      />

      <SearchBar
        onSearch={handleSearch}
        onToggleSidebar={toggleSidebar}
        isLoading={loading}
        isDarkMode={isDarkMode}
      />

      {loading ? (
        <div className="search-load">Загрузка...</div>
      ) : error ? (
        <div className="error-message">
          Ошибка:{' '}
          {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </div>
      ) : (
        <div className="gallery-content">
          {paintings.length > 0 ? (
            <div className="gallery-grid">
              <GalleryCard
                paintings={paintings}
                isDarkMode={isDarkMode}
                artists={artists.reduce(
                  (acc: Record<number, Artist>, artist: Artist) => {
                    acc[artist.id] = artist;
                    return acc;
                  },
                  {} as Record<number, Artist>,
                )}
                locations={locations.reduce(
                  (acc: Record<number, Location>, location: Location) => {
                    acc[location.id] = location;
                    return acc;
                  },
                  {} as Record<number, Location>,
                )}
              />
            </div>
          ) : (
            <div className="no-results">Нет результатов</div>
          )}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Gallery;
