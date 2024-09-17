import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.scss';

import closeButtonImageDark from '../../assets/images/close-button.png';
import closeButtonImageLight from '../../assets/images/close-button_light.png';

import { Filters } from '../Gallery/Gallery';

interface Artist {
  id: number;
  name: string;
}

interface Location {
  id: number;
  location: string;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  onApplyFilters: (newFilters: Partial<Filters>) => void;
  onClearFilters: () => void;
  artists: Record<string, string>;
  locations: Record<string, string>;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  isDarkMode,
  onApplyFilters,
  onClearFilters,
  artists,
  locations,
}) => {
  const [isArtistOpen, setIsArtistOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isYearsOpen, setIsYearsOpen] = useState(false);
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({
      artist: selectedArtistId,
      location: selectedLocationId,
      fromYear,
      toYear,
    });
  };

  const handleClearFilters = () => {
    setSelectedArtistId('');
    setSelectedLocationId('');
    setFromYear('');
    setToYear('');
    onClearFilters();
  };

  const toggleSection = (
    sectionSetter: React.Dispatch<React.SetStateAction<boolean>>,
    isOpen: boolean,
  ) => {
    sectionSetter(!isOpen);
  };

  useEffect(() => {
    setIsArtistOpen(false);
    setIsLocationOpen(false);
    setIsYearsOpen(false);
  }, [isDarkMode]);

  return (
    <div
      className={`sidebar ${isOpen ? 'open' : ''} ${isDarkMode ? 'light' : ''}`}
    >
      <div className={`sidebar-header ${isDarkMode ? 'light' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <img
            src={isDarkMode ? closeButtonImageLight : closeButtonImageDark}
            alt="Close Sidebar"
            width={26}
          />
        </button>
      </div>

      <div className={`sidebar-content ${isDarkMode ? 'light' : ''}`}>
        <div className={`filter-group ${isDarkMode ? 'light' : ''}`}>
          {/* Artist Section */}
          <div
            className={`filter-item ${isDarkMode ? 'light' : ''}`}
            onClick={() => toggleSection(setIsArtistOpen, isArtistOpen)}
          >
            <h3>ARTIST</h3>
            <button>{isArtistOpen ? '–' : '+'}</button>
          </div>
          {isArtistOpen && (
            <div className={`filter-options ${isDarkMode ? 'light' : ''}`}>
              <div
                className={`custom-select ${isDarkMode ? 'light' : ''} ${isArtistOpen ? 'active' : ''}`}
              >
                <div className={`selected-option ${isDarkMode ? 'light' : ''}`}>
                  {selectedArtistId
                    ? artists[selectedArtistId]
                    : 'Select an artist'}
                </div>
                <div
                  className={`options ${isArtistOpen ? 'show' : ''} ${isDarkMode ? 'light' : ''}`}
                >
                  {Object.keys(artists).map((artistId) => (
                    <div
                      key={artistId}
                      className={`option ${isDarkMode ? 'light' : ''}`}
                      onClick={() => setSelectedArtistId(artistId)}
                    >
                      {artists[artistId]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location Section */}
          <div
            className={`filter-item ${isDarkMode ? 'light' : ''}`}
            onClick={() => toggleSection(setIsLocationOpen, isLocationOpen)}
          >
            <h3>LOCATION</h3>
            <button>{isLocationOpen ? '–' : '+'}</button>
          </div>
          {isLocationOpen && (
            <div className={`filter-options ${isDarkMode ? 'light' : ''}`}>
              <div className={`custom-select ${isDarkMode ? 'light' : ''}`}>
                <div className={`selected-option ${isDarkMode ? 'light' : ''}`}>
                  {selectedLocationId
                    ? locations[selectedLocationId]
                    : 'Select a location'}
                </div>
                <div className={`options ${isDarkMode ? 'light' : ''}`}>
                  {Object.keys(locations).map((locationId) => (
                    <div
                      key={locationId}
                      className={`option ${isDarkMode ? 'light' : ''}`}
                      onClick={() => setSelectedLocationId(locationId)}
                    >
                      {locations[locationId]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Years Section */}
          <div
            className={`filter-item ${isDarkMode ? 'light' : ''}`}
            onClick={() => toggleSection(setIsYearsOpen, isYearsOpen)}
          >
            <h3>YEARS</h3>
            <button>{isYearsOpen ? '–' : '+'}</button>
          </div>
          {isYearsOpen && (
            <div className={`filter-options ${isDarkMode ? 'light' : ''}`}>
              <div className={`years-input ${isDarkMode ? 'light' : ''}`}>
                <input
                  type="text"
                  placeholder="From"
                  value={fromYear}
                  onChange={(e) => setFromYear(e.target.value)}
                  className={`${isDarkMode ? 'light' : ''}`}
                />
                <span>–</span>
                <input
                  type="text"
                  placeholder="To"
                  value={toYear}
                  onChange={(e) => setToYear(e.target.value)}
                  className={`${isDarkMode ? 'light' : ''}`}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`filter-actions ${isDarkMode ? 'light' : ''}`}>
          <button
            className={`show-results ${isDarkMode ? 'light' : ''}`}
            onClick={handleApplyFilters}
          >
            SHOW THE RESULTS
          </button>
          <button
            className={`clear ${isDarkMode ? 'light' : ''}`}
            onClick={handleClearFilters}
          >
            CLEAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
