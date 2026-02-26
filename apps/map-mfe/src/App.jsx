import React, { useState } from 'react';
import MapComponent from './MapComponent';
import InfoModal from './InfoModal';
import './App.css';

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowInfo = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  return (
    <div className="map-mfe-container">
      <h2>Haridwar Kumbh 2027 Map Context</h2>
      <div className="map-wrapper">
        <MapComponent onShowInfo={handleShowInfo} />
      </div>
      {isModalOpen && selectedPlace && (
        <InfoModal place={selectedPlace} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default App;
