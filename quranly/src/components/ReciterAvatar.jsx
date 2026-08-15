import { useState, useEffect } from 'react';
import { getReciterAvatarUrl, generateInitialsSvgDataUri } from '../utils/reciterPhotos';

/**
 * ReciterAvatar — Renders a reciter photo with instant offline SVG fallback.
 */
const ReciterAvatar = ({ name, src, className = '', alt = '' }) => {
  const primaryUrl = src || getReciterAvatarUrl(name);
  const fallbackUrl = generateInitialsSvgDataUri(name || 'Qari');

  const [imgSrc, setImgSrc] = useState(primaryUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || getReciterAvatarUrl(name));
    setHasError(false);
  }, [src, name]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackUrl);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || name || 'Reciter'}
      className={`reciter-avatar-img ${className}`}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ReciterAvatar;


