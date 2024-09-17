import React, { ChangeEvent } from 'react';
import './SearchBar.scss';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onToggleSidebar: () => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onToggleSidebar,
  isLoading = false,
  isDarkMode = false,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    onSearch(searchTerm);

    if (searchTerm.trim() === '') {
      onSearch('');
    }
  };

  return (
    <div className={`search ${isDarkMode ? 'light' : ''}`}>
      {isLoading ? (
        <div className={`search-bar placeholder ${isDarkMode ? 'light' : ''}`}>
          <div className="placeholder-text">Loading...</div>
          <div className="placeholder-block"></div>
        </div>
      ) : (
        <div className={`search-input ${isDarkMode ? 'light' : ''}`}>
          <input
            type="text"
            placeholder="Painting title"
            className={`search-bar ${isDarkMode ? 'light' : ''}`}
            onChange={handleSearchChange}
          />
        </div>
      )}
      <div
        className={`search-settings ${isDarkMode ? 'light' : ''}`}
        onClick={onToggleSidebar}
      >
        <img
          src={
            isDarkMode
              ? '/src/assets/images/settings_light.png'
              : '/src/assets/images/settings.png'
          }
          alt="Settings"
        />
      </div>
    </div>
  );
};

export default SearchBar;
