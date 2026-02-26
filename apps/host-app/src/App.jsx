import React, { useState, useEffect, Suspense } from 'react';
import './index.css';

// Lazy load the federated map component
const FederatedMap = React.lazy(() => import('map_mfe/FederatedMap'));

function App() {
  const [places, setPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/places')
      .then(res => res.json())
      .then(data => setPlaces(data))
      .catch(console.error);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Kumbh Mela 2027 <span>Haridwar</span></h1>
        <p>Immersive AI Interactive Guide</p>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <h2>Select Landmark</h2>
          <div className="places-list">
            {places.map(place => (
              <button
                key={place.id}
                className={`place-btn ${selectedPlaceId === place.id ? 'active' : ''}`}
                onClick={() => setSelectedPlaceId(place.id)}
              >
                <div className="place-item-content">
                  <h3>{place.name}</h3>
                  <span className="place-type">{place.type}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="sidebar-footer">
            <p>Select a location to view on the map and access immersive AI Media by clicking the Info button.</p>
          </div>
        </aside>

        <section className="map-view">
          <Suspense fallback={<div className="loading-map">Loading Interactive Map Module...</div>}>
            <FederatedMap selectedPlaceId={selectedPlaceId} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

export default App;
