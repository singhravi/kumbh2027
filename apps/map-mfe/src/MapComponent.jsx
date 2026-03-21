import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Info } from 'lucide-react';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Function to dynamically generate an icon
const getCustomIcon = (isSelected) => {
    const bgColor = isSelected ? '#10b981' : '#ff5722'; // Emerald green if selected, Orange-red otherwise
    const scale = isSelected ? 'scale(1.2)' : 'scale(1)';
    const zIndex = isSelected ? 1000 : 1;

    return new L.DivIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${bgColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transform: ${scale}; transition: all 0.3s ease; z-index: ${zIndex}; position: relative;"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

// Component to dynamically set map view
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { animate: true });
        }
    }, [center, map]);
    return null;
}

// Component to handle individual markers and their popup state
function PlaceMarker({ place, isSelected, onShowInfo }) {
    const markerRef = React.useRef(null);

    useEffect(() => {
        if (isSelected && markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [isSelected]);

    return (
        <Marker
            ref={markerRef}
            position={place.coordinates}
            icon={getCustomIcon(isSelected)}
            zIndexOffset={isSelected ? 1000 : 0}
        >
            <Popup>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 5px', fontSize: '16px', fontWeight: 'bold' }}>{place.name}</h3>
                    <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#555' }}>{place.type}</p>
                    <button
                        onClick={() => onShowInfo(place)}
                        style={{
                            background: '#2563eb', color: 'white', border: 'none',
                            borderRadius: '20px', padding: '6px 12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                            margin: '0 auto', transition: 'background 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
                        onMouseOut={(e) => e.target.style.background = '#2563eb'}
                    >
                        <Info size={16} /> Info
                    </button>
                </div>
            </Popup>
        </Marker>
    );
}

export default function MapComponent({ selectedPlaceId, onShowInfo }) {
    const [places, setPlaces] = useState([]);
    const [mapCenter, setMapCenter] = useState([29.9457, 78.1642]); // Haridwar center default

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
        fetch(`${API_BASE_URL}/places?t=${new Date().getTime()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setPlaces(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedPlaceId && places.length > 0) {
            const place = places.find(p => p.id === selectedPlaceId);
            if (place) {
                setMapCenter(place.coordinates);
            }
        }
    }, [selectedPlaceId, places]);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} />
                {places.map((place) => (
                    <PlaceMarker
                        key={place.id}
                        place={place}
                        isSelected={place.id === selectedPlaceId}
                        onShowInfo={onShowInfo}
                    />
                ))}
            </MapContainer>
        </div>
    );
}
