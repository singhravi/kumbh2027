import React, { useState, useEffect, Suspense } from 'react';
import './index.css';

// Lazy load the federated map component
const FederatedMap = React.lazy(() => import('map_mfe/FederatedMap'));
const ParkingArea = React.lazy(() => import('map_mfe/ParkingArea'));
const LaserShow = React.lazy(() => import('map_mfe/LaserShow'));
const AkharaRegistration = React.lazy(() => import('map_mfe/AkharaRegistration'));
const LostAndFound = React.lazy(() => import('map_mfe/LostAndFound'));
const WorkerRegistration = React.lazy(() => import('map_mfe/WorkerRegistration'));
const FacilitiesLayout = React.lazy(() => import('map_mfe/FacilitiesLayout'));
const FoodVendorRegistration = React.lazy(() => import('map_mfe/FoodVendorRegistration'));
const MedicalAssistance = React.lazy(() => import('map_mfe/MedicalAssistance'));

function App() {
  const [places, setPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'parking', 'laser', 'tent'

  useEffect(() => {
    fetch(`http://localhost:4000/places?t=${new Date().getTime()}`, { cache: 'no-store' })
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

      <div className="tabs-nav" style={{ display: 'flex', gap: '10px', padding: '10px 20px', background: '#fff', borderBottom: '1px solid #eee', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'map' ? '#007bff' : '#f0f0f0', color: activeTab === 'map' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Interactive Map
        </button>
        <button
          className={`tab-btn ${activeTab === 'parking' ? 'active' : ''}`}
          onClick={() => setActiveTab('parking')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'parking' ? '#007bff' : '#f0f0f0', color: activeTab === 'parking' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Parking Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'laser' ? 'active' : ''}`}
          onClick={() => setActiveTab('laser')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'laser' ? '#9c27b0' : '#f0f0f0', color: activeTab === 'laser' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Laser Show Schedule
        </button>
        <button
          className={`tab-btn ${activeTab === 'tent' ? 'active' : ''}`}
          onClick={() => setActiveTab('tent')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'tent' ? '#e65100' : '#f0f0f0', color: activeTab === 'tent' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Akhara Tents
        </button>
        <button
          className={`tab-btn ${activeTab === 'lostfound' ? 'active' : ''}`}
          onClick={() => setActiveTab('lostfound')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'lostfound' ? '#ef4444' : '#f0f0f0', color: activeTab === 'lostfound' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Lost & Found
        </button>
        <button
          className={`tab-btn ${activeTab === 'workers' ? 'active' : ''}`}
          onClick={() => setActiveTab('workers')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'workers' ? '#16a34a' : '#f0f0f0', color: activeTab === 'workers' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Worker Passes
        </button>
        <button
          className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('facilities')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'facilities' ? '#0ea5e9' : '#f0f0f0', color: activeTab === 'facilities' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Facilities Layout
        </button>
        <button
          className={`tab-btn ${activeTab === 'foodvendors' ? 'active' : ''}`}
          onClick={() => setActiveTab('foodvendors')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'foodvendors' ? '#d97706' : '#f0f0f0', color: activeTab === 'foodvendors' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Food Vendors
        </button>
        <button
          className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'medical' ? '#dc2626' : '#f0f0f0', color: activeTab === 'medical' ? 'white' : 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Medical Help
        </button>
      </div>

      <main className="app-main">
        {activeTab === 'map' && (
          <>
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
          </>
        )}

        {activeTab === 'parking' && (
          <section className="parking-view" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <Suspense fallback={<div className="loading-parking">Loading Parking Module...</div>}>
              <ParkingArea />
            </Suspense>
          </section>
        )}

        {activeTab === 'laser' && (
          <section className="laser-view" style={{ flex: 1, padding: '20px', backgroundColor: '#0f172a', overflowY: 'auto' }}>
            <Suspense fallback={<div className="loading-laser">Loading Laser Show Module...</div>}>
              <LaserShow />
            </Suspense>
          </section>
        )}

        {activeTab === 'tent' && (
          <section className="tent-view" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <Suspense fallback={<div className="loading-tent">Loading Tent Registration...</div>}>
              <AkharaRegistration />
            </Suspense>
          </section>
        )}

        {activeTab === 'lostfound' && (
          <section className="lostfound-view" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <Suspense fallback={<div className="loading-lostfound">Loading Lost & Found...</div>}>
              <LostAndFound />
            </Suspense>
          </section>
        )}

        {activeTab === 'workers' && (
          <section className="workers-view" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <Suspense fallback={<div className="loading-workers">Loading Worker Portal...</div>}>
              <WorkerRegistration />
            </Suspense>
          </section>
        )}

        {activeTab === 'facilities' && (
          <section className="facilities-view" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <Suspense fallback={<div className="loading-facilities">Loading Facilities Map...</div>}>
              <FacilitiesLayout />
            </Suspense>
          </section>
        )}

        {activeTab === 'foodvendors' && (
          <section className="food-vendor-view" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <Suspense fallback={<div className="loading-vendors">Loading Vendor Dashboard...</div>}>
              <FoodVendorRegistration />
            </Suspense>
          </section>
        )}

        {activeTab === 'medical' && (
          <section className="medical-view" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <Suspense fallback={<div className="loading-medical">Loading Medical Assistance Interface...</div>}>
              <MedicalAssistance />
            </Suspense>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
