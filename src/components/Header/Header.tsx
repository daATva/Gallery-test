import React, { useState, useEffect } from 'react';
import './Header.scss';
import { toggleClass } from '../ThemeUtils/ThemeUtils';

interface HeaderProps {
  onToggleTheme: (isDarkMode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleTheme }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    onToggleTheme(!isDarkMode);
  };

  useEffect(() => {
    toggleClass('body', 'light', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="header-container">
      <div className="header-group">
        <div className="header-logo">
          <img
            src={
              isDarkMode
                ? '/src/assets/images/light_logo.png'
                : '/src/assets/images/logo.png'
            }
            alt="Toggle Theme"
          />
        </div>
        <div className="header-button" onClick={handleToggleTheme}>
          <img
            src={
              isDarkMode
                ? '/src/assets/images/dark_btn.png'
                : '/src/assets/images/light_btn.png'
            }
            alt="Toggle Theme"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
