import React, { useState, useEffect } from 'react';
import './GalleryCard.scss';
import { toggleClass } from '../ThemeUtils/ThemeUtils';

interface Painting {
  id: number;
  imageUrl: string;
  name: string;
  created: string;
  authorId: number;
  locationId: number;
}

interface GalleryCardProps {
  paintings: Painting[];
  isDarkMode: boolean;
  artists: Record<number, string>;
  locations: Record<number, string>;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  paintings,
  isDarkMode,
  artists,
  locations,
}) => {
  const placeholders =
    paintings.length < 6 ? new Array(6 - paintings.length).fill({}) : [];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    toggleClass('.gallery-group', 'light', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="gallery-group">
      {paintings.map((painting, index) => {
        const isHovered = hoveredIndex === index;

        const artistName = artists[painting.authorId] || 'Unknown Author';
        const locationName =
          locations[painting.locationId] || 'Unknown Location';

        return (
          <div
            key={painting.id}
            className={`gallery-card ${isDarkMode ? 'light' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={`https://test-front.framework.team${painting.imageUrl}`}
              alt={painting.name}
              className="gallery-image"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = `${target.src}?reload=${Date.now()}`;
              }}
            />

            <div
              className={`gallery-info ${isHovered ? 'hovered' : ''} ${isDarkMode ? 'light' : ''}`}
            >
              <h2>{isHovered ? artistName : painting.name}</h2>
              <p>{isHovered ? locationName : painting.created}</p>
            </div>
          </div>
        );
      })}
      {placeholders.map((_, index) => (
        <div
          key={index + paintings.length}
          className="gallery-card placeholder"
        ></div>
      ))}
    </div>
  );
};

export default GalleryCard;
