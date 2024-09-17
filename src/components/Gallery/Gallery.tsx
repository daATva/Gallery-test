import React, { useState } from 'react';
import './Gallery.scss';
import GalleryCard from '../GalleryCard/GalleryCard';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Pagination from '../Pagination/Pagination';
import SearchBar from '../SearchBar/SearchBar';
import useGalleryData from '../../components/Hooks/useGalleryData';

export interface Filters {
  fromYear: string;
  toYear: string;
  artist: string;
  location: string;
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

  // Используем хук для получения данных
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
  } = useGalleryData(limit, filters);

  const handleToggleTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (value: string) => {
    debounceSearch(value);
    setSearchTerm(value);
    if (value.trim() === '') {
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
        artists={artists} // Данные художников из хука
        locations={locations} // Данные локаций из хука
      />
      <SearchBar
        onSearch={handleSearch}
        onToggleSidebar={toggleSidebar}
        isLoading={loading}
        isDarkMode={isDarkMode}
      />

      {loading ? (
        <div className="search-load">Loading...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : paintings.length > 0 ? (
        <GalleryCard
          paintings={paintings}
          artists={artists}
          locations={locations}
          isDarkMode={isDarkMode}
        />
      ) : (
        <div className="no-results">
          <h2>
            No matches for <span>{searchTerm}</span>.
          </h2>
          <p>Please try again with a different spelling or keywords.</p>
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
