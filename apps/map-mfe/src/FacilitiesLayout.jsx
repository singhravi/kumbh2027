import React, { useState } from 'react';
import './FacilitiesLayout.css';

export default function FacilitiesLayout() {
    const [activeView, setActiveView] = useState('food'); // 'food' or 'sanitary'
    const [searchZone, setSearchZone] = useState('');
    const [manageZone, setManageZone] = useState(null);

    const [facilitiesData, setFacilitiesData] = useState([
        { zone: 'Har Ki Pauri', foodStalls: 150, toilets: 200, evCharging: 15, petrolPumps: 2, status: 'Operational', highlight: true },
        { zone: 'Chandi Ghat', foodStalls: 80, toilets: 120, evCharging: 8, petrolPumps: 1, status: 'Operational', highlight: false },
        { zone: 'Kankhal', foodStalls: 95, toilets: 150, evCharging: 10, petrolPumps: 2, status: 'Operational', highlight: false },
        { zone: 'Bairagi Camp', foodStalls: 210, toilets: 300, evCharging: 25, petrolPumps: 4, status: 'Under Maintenance', highlight: true },
        { zone: 'Bhupatwala', foodStalls: 60, toilets: 90, evCharging: 5, petrolPumps: 1, status: 'Operational', highlight: false },
        { zone: 'Laljiwala', foodStalls: 45, toilets: 70, evCharging: 4, petrolPumps: 0, status: 'Operational', highlight: false },
        { zone: 'Rishikesh (Extension)', foodStalls: 110, toilets: 140, evCharging: 12, petrolPumps: 3, status: 'Operational', highlight: true },
        { zone: 'Gauri Shankar', foodStalls: 35, toilets: 60, evCharging: 3, petrolPumps: 0, status: 'Planned', highlight: false },
    ]);

    const filteredData = facilitiesData.filter(f =>
        f.zone.toLowerCase().includes(searchZone.toLowerCase())
    );

    const totalFood = facilitiesData.reduce((acc, curr) => acc + curr.foodStalls, 0);
    const totalToilets = facilitiesData.reduce((acc, curr) => acc + curr.toilets, 0);
    const totalEvCharging = facilitiesData.reduce((acc, curr) => acc + curr.evCharging, 0);
    const totalPetrolPumps = facilitiesData.reduce((acc, curr) => acc + curr.petrolPumps, 0);

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
                <div className="stat-card ev-stat" onClick={() => setActiveView('ev')}>
                    <div className="stat-icon">⚡</div>
                    <div className="stat-info">
                        <h3>{totalEvCharging}</h3>
                        <p>EV Charging Stations</p>
                    </div>
                    {activeView === 'ev' && <div className="active-indicator"></div>}
                </div>
                <div className="stat-card petrol-stat" onClick={() => setActiveView('petrol')}>
                    <div className="stat-icon">⛽</div>
                    <div className="stat-info">
                        <h3>{totalPetrolPumps}</h3>
                        <p>Petrol Pumps</p>
                    </div>
                    {activeView === 'petrol' && <div className="active-indicator"></div>}
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
                    <button className={`toggle-btn ${activeView === 'ev' ? 'active ev' : ''}`} onClick={() => setActiveView('ev')}>EV Charging</button>
                    <button className={`toggle-btn ${activeView === 'petrol' ? 'active petrol' : ''}`} onClick={() => setActiveView('petrol')}>Petrol Pumps</button>
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
                                {activeView === 'food' && (
                                    <div className="metric-display">
                                        <span className="metric-icon">🏪</span>
                                        <div className="metric-text">
                                            <span className="metric-value">{data.foodStalls}</span>
                                            <span className="metric-label">Approved Food Stalls / Langars</span>
                                        </div>
                                    </div>
                                )}
                                {activeView === 'sanitary' && (
                                    <div className="metric-display">
                                        <span className="metric-icon">🚾</span>
                                        <div className="metric-text">
                                            <span className="metric-value">{data.toilets}</span>
                                            <span className="metric-label">Sanitary Blocks / Mobile Toilets</span>
                                        </div>
                                    </div>
                                )}
                                {activeView === 'ev' && (
                                    <div className="metric-display">
                                        <span className="metric-icon">🔋</span>
                                        <div className="metric-text">
                                            <span className="metric-value">{data.evCharging}</span>
                                            <span className="metric-label">EV Charging Stations</span>
                                        </div>
                                    </div>
                                )}
                                {activeView === 'petrol' && (
                                    <div className="metric-display">
                                        <span className="metric-icon">⛽</span>
                                        <div className="metric-text">
                                            <span className="metric-value">{data.petrolPumps}</span>
                                            <span className="metric-label">Petrol Pumps</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="zone-footer">
                                <button className="view-map-btn" onClick={() => window.dispatchEvent(new CustomEvent('navigateToMap', { detail: { placeName: data.zone } }))}>📍 View on Map</button>
                                <button className="manage-btn" onClick={() => setManageZone(data)}>Manage Capacity</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Manage Capacity Modal */}
            {manageZone && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
                        <h3 style={{ marginTop: 0, color: '#0f172a' }}>Manage Capacity: {manageZone.zone}</h3>
                        <div style={{ marginBottom: '20px', color: '#1e293b' }}>
                            <p><strong>Current Status:</strong> {manageZone.status}</p>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Update Food Stalls</label>
                            <input id="modal-foodStalls" type="number" defaultValue={manageZone.foodStalls} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} />
                            
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Update Sanitary Blocks</label>
                            <input id="modal-toilets" type="number" defaultValue={manageZone.toilets} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} />

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Update EV Charging</label>
                            <input id="modal-evCharging" type="number" defaultValue={manageZone.evCharging} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} />

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Update Petrol Pumps</label>
                            <input id="modal-petrolPumps" type="number" defaultValue={manageZone.petrolPumps} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setManageZone(null)} style={{ padding: '10px 20px', background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            <button onClick={() => { 
                                const newFood = parseInt(document.getElementById('modal-foodStalls').value, 10);
                                const newToilets = parseInt(document.getElementById('modal-toilets').value, 10);
                                const newEv = parseInt(document.getElementById('modal-evCharging').value, 10);
                                const newPetrol = parseInt(document.getElementById('modal-petrolPumps').value, 10);
                                
                                setFacilitiesData(prev => prev.map(f => {
                                    if (f.zone === manageZone.zone) {
                                        return { ...f, foodStalls: newFood, toilets: newToilets, evCharging: newEv, petrolPumps: newPetrol };
                                    }
                                    return f;
                                }));
                                alert('Capacity updated successfully!'); 
                                setManageZone(null); 
                            }} style={{ padding: '10px 20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
