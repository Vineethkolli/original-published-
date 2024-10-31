import React, { useEffect, useState } from 'react';

const InstallApp = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
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
      });
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div>
      <h1>For a better experience, please download the app</h1>
      <button className="install-button" onClick={handleInstallClick}>Install App</button>

      {showAlert && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Please refresh the page and click Install App
        </p>
      )}
    </div>
  );
};

export default InstallApp;
