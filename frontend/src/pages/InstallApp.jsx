// src/pages/InstallApp.jsx
import React, { useEffect, useState } from 'react';

const InstallApp = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setShowAlert(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        window.deferredPrompt = null;
        setShowAlert(false);
      });
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div>
      <h1>For a better experience, please download the app</h1>
      {showAlert && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Refresh the page and Click 'Install App' to install the PWA
        </p>
      )}
      <button className="install-button" onClick={handleInstallClick}>Install App</button>
    </div>
  );
};

export default InstallApp;
