import React, { useState } from 'react';
import MapComponent from './MapComponent';
import InfoModal from './InfoModal';
import './App.css';

import ParkingArea from './ParkingArea';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowInfo = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  return (
    <div className="map-mfe-container">
      <h2>Haridwar Kumbh 2027 Dashboard</h2>

      <div className="tabs-nav" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'map' ? '#007bff' : '#f0f0f0', color: activeTab === 'map' ? 'white' : 'black', border: 'none', borderRadius: '4px' }}
        >
          Interactive Map
        </button>
        <button
          className={`tab-btn ${activeTab === 'parking' ? 'active' : ''}`}
          onClick={() => setActiveTab('parking')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'parking' ? '#007bff' : '#f0f0f0', color: activeTab === 'parking' ? 'white' : 'black', border: 'none', borderRadius: '4px' }}
        >
          Parking Management
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'map' && (
          <div className="map-wrapper">
            <MapComponent onShowInfo={handleShowInfo} />
          </div>
        )}

        {activeTab === 'parking' && (
          <ParkingArea />
        )}
      </div>

      {isModalOpen && selectedPlace && (
        <InfoModal place={selectedPlace} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default App;
