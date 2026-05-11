import React, { useState, useEffect } from 'react';
import './CrowdManagement.css';

const LOCATIONS = {
    ghat: { id: 'ghat', name: 'Middle Ghat (Har Ki Pauri)', capacity: 15000 },
    bridgeNorth: { id: 'bridgeNorth', name: 'North Bridge', capacity: 2000 },
    bridgeSouth: { id: 'bridgeSouth', name: 'South Bridge', capacity: 2000 }
};

export default function CrowdManagement() {
    const [crowdData, setCrowdData] = useState({
        ghat: 8500,
        bridgeNorth: 1200,
        bridgeSouth: 1800
    });

    const [alerts, setAlerts] = useState([]);
    const [actionLog, setActionLog] = useState([]);
    const [selectedAction, setSelectedAction] = useState('one_way');
    const [targetLocation, setTargetLocation] = useState('bridgeNorth');

    // Basic simulation of crowd fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setCrowdData(prev => {
                const newData = { ...prev };
                // Random fluctuation between -100 and +200
                newData.ghat = Math.max(0, Math.min(LOCATIONS.ghat.capacity + 500, newData.ghat + Math.floor(Math.random() * 300) - 100));
                newData.bridgeNorth = Math.max(0, Math.min(LOCATIONS.bridgeNorth.capacity + 200, newData.bridgeNorth + Math.floor(Math.random() * 100) - 40));
                newData.bridgeSouth = Math.max(0, Math.min(LOCATIONS.bridgeSouth.capacity + 200, newData.bridgeSouth + Math.floor(Math.random() * 100) - 40));
                return newData;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Check for alerts
    useEffect(() => {
        const newAlerts = [];
        Object.keys(crowdData).forEach(locKey => {
            const current = crowdData[locKey];
            const max = LOCATIONS[locKey].capacity;
            const percentage = (current / max) * 100;
            if (percentage >= 90) {
                newAlerts.push(`CRITICAL: ${LOCATIONS[locKey].name} is at ${percentage.toFixed(1)}% capacity! Immediate diversion recommended.`);
            } else if (percentage >= 75) {
                newAlerts.push(`WARNING: ${LOCATIONS[locKey].name} is getting crowded (${percentage.toFixed(1)}%).`);
            }
        });
        setAlerts(newAlerts);
    }, [crowdData]);

    const handleActionSubmit = (e) => {
        e.preventDefault();
        const actionText = {
            'normalize': 'Normalized Crowd Movement (Restored Flow)',
            'one_way': 'Enforced One-Way Traffic',
            'halt_entry': 'Halted Entry',
            'divert': 'Diverted Incoming Crowd',
            'deploy_barricade': 'Deployed Additional Barricades',
            'deploy_boat': 'Launched River Rescue Boat',
            'alert_lifeguards': 'Dispatched Jal Police & Lifeguards',
            'medical_evac': 'Initiated Immediate Medical Evacuation'
        }[selectedAction];

        const logEntry = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            action: actionText,
            location: LOCATIONS[targetLocation].name
        };

        setActionLog([logEntry, ...actionLog]);

        // Simulate crowd dropping after an action
        setCrowdData(prev => ({
            ...prev,
            [targetLocation]: Math.max(0, prev[targetLocation] - Math.floor(Math.random() * 500 + 200))
        }));
    };

    const getStatusColor = (current, max) => {
        const ratio = current / max;
        if (ratio < 0.6) return '#22c55e'; // Green
        if (ratio < 0.85) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    const totalCrowd = crowdData.ghat + crowdData.bridgeNorth + crowdData.bridgeSouth;
    const totalCapacity = LOCATIONS.ghat.capacity + LOCATIONS.bridgeNorth.capacity + LOCATIONS.bridgeSouth.capacity;

    return (
        <div className="crowd-dashboard-container">
            {/* Top Scoreboard */}
            <div className="stats-board digital-dashboard">
                <h3 className="digital-header">HAR KI PAURI: LIVE CROWD MONITOR</h3>
                
                <div className="digital-metrics">
                    <div className="digital-metric total">
                        <span className="digital-label">TOTAL CROWD</span>
                        <span className="digital-value">{String(totalCrowd).padStart(5, '0')}</span>
                    </div>
                    
                    <div className="digital-metric occupied">
                        <span className="digital-label">MIDDLE GHAT</span>
                        <span className="digital-value" style={{color: getStatusColor(crowdData.ghat, LOCATIONS.ghat.capacity)}}>
                            {String(crowdData.ghat).padStart(5, '0')}
                        </span>
                    </div>

                    <div className="digital-metric available">
                        <span className="digital-label">ACTIVE BRIDGES</span>
                        <span className="digital-value" style={{color: getStatusColor(crowdData.bridgeNorth + crowdData.bridgeSouth, LOCATIONS.bridgeNorth.capacity + LOCATIONS.bridgeSouth.capacity)}}>
                            {String(crowdData.bridgeNorth + crowdData.bridgeSouth).padStart(4, '0')}
                        </span>
                    </div>
                </div>

                {alerts.length > 0 && (
                    <div className="digital-alerts marquee-container">
                        <div className="marquee-content">
                            {alerts.join('  |  ')}
                        </div>
                    </div>
                )}
            </div>

            <div className="crowd-main-grid">
                {/* Left Sidebar: Controls & Logs */}
                <div className="crowd-sidebar">
                    <div className="control-panel">
                        <h3>Crowd Control Actions</h3>
                        <form onSubmit={handleActionSubmit} className="action-form">
                            <div className="form-group">
                                <label>Target Location</label>
                                <select value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)}>
                                    <option value="ghat">Middle Ghat</option>
                                    <option value="bridgeNorth">North Bridge</option>
                                    <option value="bridgeSouth">South Bridge</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Emergency Action</label>
                                <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
                                    <optgroup label="Crowd Flow">
                                        <option value="normalize">Normalize Movement (Restore Flow)</option>
                                        <option value="one_way">Enforce One-Way Restrict</option>
                                        <option value="halt_entry">Halt Entry (Red Flag)</option>
                                        <option value="divert">Divert Route</option>
                                        <option value="deploy_barricade">Deploy Barricades</option>
                                    </optgroup>
                                    <optgroup label="Mishap / Rescue Options">
                                        <option value="deploy_boat">Launch Rescue Boat</option>
                                        <option value="alert_lifeguards">Alert Lifeguards & Divers</option>
                                        <option value="medical_evac">Trigger Medical Evacuation</option>
                                    </optgroup>
                                </select>
                            </div>
                            <button type="submit" className="btn-execute">EXECUTE ACTION</button>
                        </form>
                    </div>

                    <div className="action-log">
                        <h3>Command Log</h3>
                        {actionLog.length === 0 ? <p className="text-muted">No actions transmitted yet.</p> : (
                            <ul>
                                {actionLog.map(log => (
                                    <li key={log.id} className="log-item">
                                        <div className="log-header">
                                            <span className="log-time">{log.time}</span>
                                            <span className="log-loc">{log.location}</span>
                                        </div>
                                        <div className="log-action">{log.action}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Right Area: Top-Down Visualizer */}
                <div className="crowd-visualizer">
                    <h3>Strategic Map View</h3>
                    <div className="map-container">
                        <div className="river-ganga"></div>
                        
                        <div className="map-elements">
                            {/* North Bridge */}
                            <div className="bridge bridge-north">
                                <div className="bridge-label">NORTH BRIDGE</div>
                                <div className="density-bar">
                                    <div className="density-fill" style={{
                                        width: `${Math.min(100, (crowdData.bridgeNorth / LOCATIONS.bridgeNorth.capacity) * 100)}%`,
                                        backgroundColor: getStatusColor(crowdData.bridgeNorth, LOCATIONS.bridgeNorth.capacity)
                                    }}></div>
                                </div>
                                <div className="bridge-stats">{crowdData.bridgeNorth} / {LOCATIONS.bridgeNorth.capacity}</div>
                            </div>
                            
                            {/* Middle Ghat */}
                            <div className="ghat-area">
                                <div className="ghat-label">MIDDLE GHAT (HAR KI PAURI)</div>
                                
                                {/* Life Support Equipments */}
                                <div className="life-support-station lifebuoy-1" title="Life Support: Rescue Ring & Guard 1"><span>🛟</span> Guard A</div>
                                <div className="life-support-station rescue-boat" title="Emergency Rescue Boat deployed"><span>🚤</span> Unit 1</div>
                                <div className="life-support-station lifebuoy-2" title="Life Support: Rescue Ring & Guard 2"><span>🛟</span> Guard B</div>

                                <div className="ghat-density-indicator" style={{
                                    boxShadow: `0 0 40px ${getStatusColor(crowdData.ghat, LOCATIONS.ghat.capacity)} inset`
                                }}>
                                    <div className="crowd-dots" style={{ opacity: crowdData.ghat / LOCATIONS.ghat.capacity }}></div>
                                </div>
                                <div className="ghat-stats">{crowdData.ghat} / {LOCATIONS.ghat.capacity} Max</div>
                            </div>

                            {/* South Bridge */}
                            <div className="bridge bridge-south">
                                <div className="bridge-label">SOUTH BRIDGE</div>
                                <div className="density-bar">
                                    <div className="density-fill" style={{
                                        width: `${Math.min(100, (crowdData.bridgeSouth / LOCATIONS.bridgeSouth.capacity) * 100)}%`,
                                        backgroundColor: getStatusColor(crowdData.bridgeSouth, LOCATIONS.bridgeSouth.capacity)
                                    }}></div>
                                </div>
                                <div className="bridge-stats">{crowdData.bridgeSouth} / {LOCATIONS.bridgeSouth.capacity}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
