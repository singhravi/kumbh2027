import React, { useState } from 'react';
import MapComponent from './MapComponent';
import InfoModal from './InfoModal';
import './App.css';

export default function FederatedMap({ selectedPlaceId }) {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShowInfo = (place) => {
        setSelectedPlace(place);
        setIsModalOpen(true);
    };

    return (
        <div className="map-mfe-container" style={{ flex: 1, width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div className="map-wrapper" style={{ flex: 1, width: '100%', position: 'relative' }}>
                <MapComponent selectedPlaceId={selectedPlaceId} onShowInfo={handleShowInfo} />
            </div>
            {isModalOpen && selectedPlace && (
                <InfoModal place={selectedPlace} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}
