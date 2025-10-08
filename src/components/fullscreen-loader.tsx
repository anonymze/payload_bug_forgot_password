import React from 'react';


interface FullscreenLoaderProps {
  isVisible: boolean;
  message?: string;
}

export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({ isVisible, message = "Chargement..." }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(2px)',
    }}>
      {/* Spinner */}
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid #007cba',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px',
      }} />
      
      {/* Message */}
      <div style={{
        color: 'white',
        fontSize: '18px',
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: '300px',
        lineHeight: '1.4',
      }}>
        {message}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}; 