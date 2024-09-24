import React, { useState, useEffect, useRef } from 'react';
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

interface Artist {
  id: number;
  name: string;
}

interface Location {
  id: number;
  location: string;
}

interface GalleryCardProps {
  paintings: Painting[];
  isDarkMode: boolean;
  artists: Record<number, Artist>;
  locations: Record<number, Location>;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  paintings = [],
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

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.onload = () => img.classList.add('loaded');
          observer.current?.unobserve(entry.target);
        }
      });
    });

    const imgs = document.querySelectorAll('.gallery-image.lazy');
    imgs.forEach((img) => observer.current?.observe(img));

    return () => {
      observer.current?.disconnect();
    };
  }, [paintings]);

  return (
    <div className={`gallery-group ${isDarkMode ? 'light' : ''}`}>
      {paintings.map((painting, index) => {
        const isHovered = hoveredIndex === index;
        const artistName =
          artists[painting.authorId]?.name || 'Неизвестный художник';
        const locationName =
          locations[painting.locationId]?.location || 'Неизвестная локация';

        return (
          <div
            key={painting.id}
            className={`gallery-card ${isDarkMode ? 'light' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              data-src={`https://test-front.framework.team${painting.imageUrl}`}
              data-srcset={`https://test-front.framework.team${painting.imageUrl} 1x, https://test-front.framework.team${painting.imageUrl.replace(
                '.jpg',
                '@2x.jpg',
              )} 2x`}
              alt={painting.name}
              className="gallery-image lazy"
              loading="lazy"
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/path/to/fallback-image.jpg';
              }}
            />

            <div
              className={`gallery-info ${isDarkMode ? 'light' : ''} ${
                isHovered ? 'hovered' : ''
              }`}
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
