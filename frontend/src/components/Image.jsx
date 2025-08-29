import { resolveImageUrl } from '../utils/url';
import { useState } from 'react';

export default function Image({ src, alt = '', style, fallbackSrc }) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const resolved = resolveImageUrl(src);
  const placeholder = fallbackSrc || 'https://picsum.photos/seed/placeholder/800/600';
  
  const handleLoad = () => {
    setLoading(false);
    setFailed(false);
  };
  
  const handleError = () => {
    setFailed(true);
    setLoading(false);
  };
  
  return (
    <div style={{ position: 'relative', ...style }}>
      {loading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          Loading...
        </div>
      )}
      <img
        src={failed || !resolved ? placeholder : resolved}
        alt={alt}
        style={{ 
          ...style, 
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
