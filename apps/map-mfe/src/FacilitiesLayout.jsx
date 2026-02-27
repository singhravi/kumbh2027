import React, { useState } from 'react';
import './FacilitiesLayout.css';

export default function FacilitiesLayout() {
    const [activeView, setActiveView] = useState('food'); // 'food' or 'sanitary'
    const [searchZone, setSearchZone] = useState('');

    const facilitiesData = [
        { zone: 'Har Ki Pauri', foodStalls: 150, toilets: 200, status: 'Operational', highlight: true },
        { zone: 'Chandi Ghat', foodStalls: 80, toilets: 120, status: 'Operational', highlight: false },
        { zone: 'Kankhal', foodStalls: 95, toilets: 150, status: 'Operational', highlight: false },
        { zone: 'Bairagi Camp', foodStalls: 210, toilets: 300, status: 'Under Maintenance', highlight: true },
        { zone: 'Bhupatwala', foodStalls: 60, toilets: 90, status: 'Operational', highlight: false },
        { zone: 'Laljiwala', foodStalls: 45, toilets: 70, status: 'Operational', highlight: false },
        { zone: 'Rishikesh (Extension)', foodStalls: 110, toilets: 140, status: 'Operational', highlight: true },
        { zone: 'Gauri Shankar', foodStalls: 35, toilets: 60, status: 'Planned', highlight: false },
    ];

    const filteredData = facilitiesData.filter(f =>
        f.zone.toLowerCase().includes(searchZone.toLowerCase())
    );

    const totalFood = facilitiesData.reduce((acc, curr) => acc + curr.foodStalls, 0);
    const totalToilets = facilitiesData.reduce((acc, curr) => acc + curr.toilets, 0);

    return (
        <div className="facilities-container">
            <div className="facilities-header">
                <h2>Public Amenities & Layout Dashboard</h2>
                <p>Real-time allocation of Food Stalls and Sanitary Blocks across Kumbh Zones</p>
            </div>

            <div className="facilities-stats">
                <div className="stat-card food-stat" onClick={() => setActiveView('food')}>
                    <div className="stat-icon">🍲</div>
                    <div className="stat-info">
                        <h3>{totalFood}</h3>
                        <p>Total Registered Food Stalls</p>
                    </div>
                    {activeView === 'food' && <div className="active-indicator"></div>}
                </div>
                <div className="stat-card toilet-stat" onClick={() => setActiveView('sanitary')}>
                    <div className="stat-icon">🚻</div>
                    <div className="stat-info">
                        <h3>{totalToilets}</h3>
                        <p>Total Public Toilet Blocks</p>
                    </div>
                    {activeView === 'sanitary' && <div className="active-indicator"></div>}
                </div>
            </div>

            <div className="facilities-controls">
                <input
                    type="text"
                    placeholder="Search by Zone Name..."
                    value={searchZone}
                    onChange={(e) => setSearchZone(e.target.value)}
                    className="zone-search"
                />
                <div className="view-toggles">
                    <button className={`toggle-btn ${activeView === 'food' ? 'active food' : ''}`} onClick={() => setActiveView('food')}>Food Layout</button>
                    <button className={`toggle-btn ${activeView === 'sanitary' ? 'active toilet' : ''}`} onClick={() => setActiveView('sanitary')}>Sanitary Layout</button>
                </div>
            </div>

            <div className="layout-grid">
                {filteredData.length === 0 ? (
                    <p className="no-zones">No zones match your search.</p>
                ) : (
                    filteredData.map((data, index) => (
                        <div key={index} className={`zone-card ${data.highlight ? 'highlighted' : ''} ${activeView}`}>
                            <div className="zone-header">
                                <h3>{data.zone}</h3>
                                <span className={`zone-status ${data.status.toLowerCase().replace(' ', '-')}`}>{data.status}</span>
                            </div>

                            <div className="zone-body">
                                {activeView === 'food' ? (
                                    <div className="metric-display">
                                        <span className="metric-icon">🏪</span>
                                        <div className="metric-text">
                                            <span className="metric-value">{data.foodStalls}</span>
                                            <span className="metric-label">Approved Food Stalls / Langars</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="metric-display">
                                        <span className="metric-icon">🚾</span>
                                        <div className="metric-text">
                                            <span className="metric-value">{data.toilets}</span>
                                            <span className="metric-label">Sanitary Blocks / Mobile Toilets</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="zone-footer">
                                <button className="view-map-btn">📍 View on Map</button>
                                <button className="manage-btn">Manage Capacity</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
