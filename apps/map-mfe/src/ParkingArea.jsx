import React, { useState } from 'react';
import './ParkingArea.css';

// Initialize parking data structure once outside component
const TOTAL_SECTORS = 32;
const BAYS_PER_SECTOR = 2; // e.g. A1, A2
const SLOTS_PER_BAY = 100;

const initialParkingData = {};
for (let s = 1; s <= TOTAL_SECTORS; s++) {
    initialParkingData[`S${s}`] = {
        A1: Array(SLOTS_PER_BAY).fill(null), // null means empty, otherwise it contains car registration
        A2: Array(SLOTS_PER_BAY).fill(null)
    };
}

export default function ParkingArea() {
    const [parkingData, setParkingData] = useState(initialParkingData);
    const [carRegInput, setCarRegInput] = useState('');
    const [exitRegInput, setExitRegInput] = useState('');
    const [message, setMessage] = useState('');
    const [activeSector, setActiveSector] = useState('S1');
    const [activeBay, setActiveBay] = useState('A1');
    const [movementLog, setMovementLog] = useState([]);

    // Entry Receipt State
    const [entryReceiptData, setEntryReceiptData] = useState(null);

    // Payment State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success
    const [exitDetails, setExitDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('upi');

    // Log & Search State
    const [activeLogTab, setActiveLogTab] = useState('movement'); // 'movement' or 'parked'
    const [movementSearch, setMovementSearch] = useState('');
    const [parkedSearch, setParkedSearch] = useState('');

    // Find the first available slot in the entire parking lot
    const findAvailableSlot = () => {
        for (let s = 1; s <= TOTAL_SECTORS; s++) {
            const sectorKey = `S${s}`;
            for (const bay of ['A1', 'A2']) {
                const slotIndex = parkingData[sectorKey][bay].findIndex(slot => slot === null);
                if (slotIndex !== -1) {
                    return { sector: sectorKey, bay, index: slotIndex };
                }
            }
        }
        return null;
    };

    const handleEntry = (e) => {
        e.preventDefault();
        const reg = carRegInput.trim().toUpperCase();
        if (!reg) {
            setMessage('Please enter a valid car registration.');
            return;
        }

        // Check if car is already parked
        for (let s = 1; s <= TOTAL_SECTORS; s++) {
            const sectorKey = `S${s}`;
            for (const bay of ['A1', 'A2']) {
                const parkedCar = parkingData[sectorKey][bay].find(slot => slot && slot.reg === reg);
                if (parkedCar) {
                    setMessage(`Car ${reg} is already parked in ${sectorKey}-${bay}`);
                    return;
                }
            }
        }

        const availableSlot = findAvailableSlot();
        if (!availableSlot) {
            setMessage('Parking is FULL!');
            return;
        }

        // Allocate slot
        const newData = { ...parkingData };
        // Deep copy the bay array
        newData[availableSlot.sector][availableSlot.bay] = [...newData[availableSlot.sector][availableSlot.bay]];

        const entryTime = new Date().toLocaleString();
        newData[availableSlot.sector][availableSlot.bay][availableSlot.index] = { reg, time: entryTime };

        const slotId = `${availableSlot.sector}-${availableSlot.bay}-${String(availableSlot.index + 1).padStart(3, '0')}`;

        setParkingData(newData);
        setMovementLog([{ id: Date.now(), time: entryTime, type: 'IN', reg, slot: slotId }, ...movementLog]);
        setCarRegInput('');
        setMessage(`Allocated slot for ${reg} at ${slotId}`);
        setActiveSector(availableSlot.sector);
        setActiveBay(availableSlot.bay);

        // Show Entry Receipt
        setEntryReceiptData({ reg, time: entryTime, slot: slotId });
    };

    const handleExit = (e) => {
        e.preventDefault();
        const reg = exitRegInput.trim().toUpperCase();
        if (!reg) {
            setMessage('Please enter a valid car registration to exit.');
            return;
        }

        let foundCar = null;
        let foundKeys = null;

        for (let s = 1; s <= TOTAL_SECTORS; s++) {
            const sectorKey = `S${s}`;
            for (const bay of ['A1', 'A2']) {
                const slotIndex = parkingData[sectorKey][bay].findIndex(slot => slot && slot.reg === reg);
                if (slotIndex !== -1) {
                    foundCar = parkingData[sectorKey][bay][slotIndex];
                    const slotId = `${sectorKey}-${bay}-${String(slotIndex + 1).padStart(3, '0')}`;
                    foundKeys = { sectorKey, bay, slotIndex, slotId };
                    break;
                }
            }
            if (foundCar) break;
        }

        if (!foundCar) {
            setMessage(`Car ${reg} not found in parking.`);
            return;
        }

        // Calculate a dummy duration and fee
        const entryTime = new Date(foundCar.time);
        // Fallback to random fee if time parsing fails
        const durationHours = Math.max(1, Math.ceil((new Date() - entryTime) / (1000 * 60 * 60)) || Math.floor(Math.random() * 5) + 1);
        const fee = durationHours * 50; // ₹50 per hour

        // Trigger payment flow
        setExitDetails({ reg, ...foundKeys, fee, durationHours, time: new Date() });
        setPaymentMethod('upi'); // default
        setPaymentStatus('pending');
        setIsPaymentModalOpen(true);
    };

    const processFinalExit = () => {
        if (!exitDetails) return;
        const { reg, sectorKey, bay, slotIndex, slotId } = exitDetails;

        const newData = { ...parkingData };
        newData[sectorKey][bay] = [...newData[sectorKey][bay]];
        newData[sectorKey][bay][slotIndex] = null;

        setParkingData(newData);
        setMovementLog([{ id: Date.now(), time: new Date().toLocaleString(), type: 'OUT', reg, slot: slotId, payment: paymentMethod }, ...movementLog]);

        setIsPaymentModalOpen(false);
        setExitRegInput('');
        setExitDetails(null);
        setMessage(`Car ${reg} exited from ${slotId}. Paid via ${paymentMethod.toUpperCase()}`);
        setActiveSector(sectorKey);
        setActiveBay(bay);
    };

    const handleSimulatePayment = () => {
        if (paymentMethod === 'cash') {
            processFinalExit();
            return;
        }

        setPaymentStatus('processing');
        setTimeout(() => {
            setPaymentStatus('success');
            setTimeout(() => {
                processFinalExit();
            }, 1000);
        }, 2000);
    };

    const calculateOccupancy = () => {
        let total = TOTAL_SECTORS * BAYS_PER_SECTOR * SLOTS_PER_BAY;
        let occupied = 0;
        let parkedList = [];
        for (let s = 1; s <= TOTAL_SECTORS; s++) {
            const sectorKey = `S${s}`;
            for (const bay of ['A1', 'A2']) {
                parkingData[sectorKey][bay].forEach((slot, index) => {
                    if (slot !== null) {
                        occupied++;
                        parkedList.push({
                            reg: slot.reg,
                            time: slot.time,
                            slot: `${sectorKey}-${bay}-${String(index + 1).padStart(3, '0')}`
                        });
                    }
                });
            }
        }
        return { total, occupied, available: total - occupied, parkedList };
    };

    const stats = calculateOccupancy();

    const filteredMovementLog = movementLog.filter(log =>
        log.reg.includes(movementSearch.trim().toUpperCase())
    );

    const filteredParkedList = stats.parkedList.filter(car =>
        car.reg.includes(parkedSearch.trim().toUpperCase())
    );

    return (
        <div className="parking-area-container">
            {/* Full-width Digital Dashboard */}
            <div className="stats-board digital-dashboard">
                <h3 className="digital-header">LIVE PARKING STATUS</h3>
                
                <div className="digital-metrics">
                    <div className="digital-metric total">
                        <span className="digital-label">TOTAL CAP.</span>
                        <span className="digital-value">{String(stats.total).padStart(4, '0')}</span>
                    </div>
                    
                    <div className="digital-metric occupied">
                        <span className="digital-label">OCCUPIED</span>
                        <span className="digital-value">{String(stats.occupied).padStart(4, '0')}</span>
                    </div>

                    <div className="digital-metric available">
                        <span className="digital-label">AVAILABLE</span>
                        <span className="digital-value">{String(stats.available).padStart(4, '0')}</span>
                    </div>
                </div>
                {message && <div className="digital-message">{message}</div>}
            </div>

            {/* Split Main Content Area */}
            <div className="parking-main-grid">
                
                {/* Left Sidebar: Forms & Logs */}
                <div className="parking-sidebar">
                    <div className="entry-exit-forms">
                        <form className="entry-form" onSubmit={handleEntry}>
                            <h3>Vehicle Entry</h3>
                            <input
                                type="text"
                                placeholder="Car Reg (e.g. UK08AA1234)"
                                value={carRegInput}
                                onChange={(e) => setCarRegInput(e.target.value)}
                            />
                            <button type="submit" className="btn-entry">Allocate Slot</button>
                        </form>

                        <form className="exit-form" onSubmit={handleExit}>
                            <h3>Vehicle Exit</h3>
                            <input
                                type="text"
                                placeholder="Car Reg to Exit"
                                value={exitRegInput}
                                onChange={(e) => setExitRegInput(e.target.value)}
                            />
                            <button type="submit" className="btn-exit">Process Exit</button>
                        </form>
                    </div>

                    <div className="movement-details">
                        <div className="log-tabs-nav">
                            <button
                                className={`log-tab-btn ${activeLogTab === 'movement' ? 'active' : ''}`}
                                onClick={() => setActiveLogTab('movement')}
                            >
                                Actions
                            </button>
                            <button
                                className={`log-tab-btn ${activeLogTab === 'parked' ? 'active' : ''}`}
                                onClick={() => setActiveLogTab('parked')}
                            >
                                Parked ({stats.occupied})
                            </button>
                        </div>

                        <div className="log-tab-content">
                            {activeLogTab === 'movement' && (
                                <div className="movement-log">
                                    <div className="log-header">
                                        <h4>Movements</h4>
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Search Reg..."
                                            value={movementSearch}
                                            onChange={(e) => setMovementSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="log-list">
                                        {filteredMovementLog.length === 0 ? <p className="text-muted">No activities.</p> : (
                                            <ul>
                                                {filteredMovementLog.map(log => (
                                                    <li key={log.id} className={`log-item ${log.type.toLowerCase()}`} style={{flexDirection: 'column', alignItems: 'flex-start', gap: '5px'}}>
                                                        <div style={{display:'flex', width:'100%', justifyContent:'space-between', fontSize: '0.85em', color: '#64748b'}}>
                                                            <span>{log.time}</span>
                                                            <span className={`log-type ${log.type === 'IN' ? 'text-success' : 'text-danger'}`}><strong>{log.type}</strong></span>
                                                        </div>
                                                        <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems: 'center'}}>
                                                            <span className="log-reg">{log.reg}</span>
                                                            <span className="log-slot" style={{color: '#94a3b8'}}>Slot: {log.slot}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeLogTab === 'parked' && (
                                <div className="parked-cars">
                                    <div className="log-header">
                                        <h4>Vehicles</h4>
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Search Reg..."
                                            value={parkedSearch}
                                            onChange={(e) => setParkedSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="parked-list">
                                        {filteredParkedList.length === 0 ? <p className="text-muted">Empty.</p> : (
                                            <ul>
                                                {filteredParkedList.map((car, i) => (
                                                    <li key={i} className="parked-item" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '5px'}}>
                                                        <div style={{display:'flex', width:'100%', justifyContent:'space-between', fontSize: '0.85em', color: '#64748b'}}>
                                                            <span>Since: {car.time}</span>
                                                        </div>
                                                        <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems: 'center'}}>
                                                            <span className="reg-badge">{car.reg}</span>
                                                            <span style={{color: '#94a3b8'}}>Slot: {car.slot}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Right Area: Floor Plan Visuals */}
                <div className="parking-visualizer">
                    <div className="sector-nav">
                        <h4>Select Sector</h4>
                        <select value={activeSector} onChange={(e) => setActiveSector(e.target.value)}>
                            {Array.from({ length: TOTAL_SECTORS }, (_, i) => `S${i + 1}`).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <h4>Select Bay</h4>
                        <select value={activeBay} onChange={(e) => setActiveBay(e.target.value)}>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                        </select>
                    </div>

                    <div className="bay-grid">
                        <h4>Viewing Map: Sector {activeSector} / Bay {activeBay}</h4>
                        <div className="slots-container">
                            {parkingData[activeSector][activeBay].map((slot, index) => {
                                const slotId = `${activeSector}${activeBay}-${String(index + 1).padStart(3, '0')}`;
                                return (
                                    <div
                                        key={slotId}
                                        className={`parking-slot ${slot ? 'occupied' : 'empty'}`}
                                        title={slot ? `Occupied by ${slot.reg} since ${slot.time}` : 'Empty'}
                                    >
                                        <span className="slot-number">{String(index + 1).padStart(3, '0')}</span>
                                        {slot && (
                                            <>
                                                <span className="car-reg">{slot.reg}</span>
                                                <span className="car-time">{new Date(slot.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && exitDetails && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal">
                        <div className="payment-modal-header">
                            <h3>Parking Exit Payment</h3>
                            <button className="close-btn" onClick={() => setIsPaymentModalOpen(false)} disabled={paymentStatus === 'processing'}>✕</button>
                        </div>
                        <div className="payment-modal-body">
                            <div className="payment-summary">
                                <p>Vehicle Registration: <strong>{exitDetails.reg}</strong></p>
                                <p>Duration: {exitDetails.durationHours} Hours</p>
                                <h2>₹{exitDetails.fee}</h2>
                            </div>

                            {paymentStatus === 'pending' && (
                                <>
                                    <div className="payment-method-select">
                                        <label>Select Payment Method:</label>
                                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                            <option value="upi">UPI / Scanner</option>
                                            <option value="netbanking">Net Banking</option>
                                            <option value="credit_card">Credit Card</option>
                                            <option value="debit_card">Debit Card</option>
                                            <option value="cash">Cash</option>
                                        </select>
                                    </div>
                                    <div className="payment-actions" style={{ marginTop: '20px' }}>
                                        <button className="btn-exit" onClick={handleSimulatePayment} style={{ width: '100%', padding: '12px', fontSize: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                            {paymentMethod === 'cash' ? 'Collect Cash & Open Gate' : 'Simulate Payment Processing'}
                                        </button>
                                    </div>
                                </>
                            )}

                            {paymentStatus === 'processing' && (
                                <div className="payment-processing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                                    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    <p style={{ marginTop: '15px', fontWeight: 'bold' }}>Processing transaction...</p>
                                </div>
                            )}

                            {paymentStatus === 'success' && (
                                <div className="payment-success" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', color: '#10b981' }}>
                                    <div className="success-icon" style={{ fontSize: '3rem' }}>✓</div>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Payment Successful!</p>
                                    <p style={{ color: '#6b7280' }}>Opening Boom Barrier Gate...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Entry Receipt Modal */}
            {entryReceiptData && (
                <div className="payment-modal-overlay print-overlay">
                    <div className="payment-modal printable-receipt">
                        <div className="payment-modal-header" style={{background: '#eef2ff'}}>
                            <h3 style={{color: '#4338ca', margin: 0, fontSize: '1.2rem'}}>Parking Entry Receipt</h3>
                            <button className="close-btn" onClick={() => setEntryReceiptData(null)}>✕</button>
                        </div>
                        <div className="payment-modal-body" style={{textAlign: 'center', padding: '25px'}}>
                            <p style={{fontSize: '1.2rem', margin: '0 0 15px 0'}}>Vehicle: <strong style={{color: '#1e293b'}}>{entryReceiptData.reg}</strong></p>
                            
                            <div style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '2px dashed #cbd5e1', marginBottom: '20px'}}>
                                <p style={{fontSize: '0.9rem', color: '#64748b', margin: '0 0 5px 0'}}>Allocated Parking Slot</p>
                                <h1 style={{margin: 0, color: '#0f172a', fontSize: '3rem', letterSpacing: '2px'}}>{entryReceiptData.slot}</h1>
                            </div>
                            
                            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '15px'}}>
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`Vehicle: ${entryReceiptData.reg}\nSlot: ${entryReceiptData.slot}\nTime: ${entryReceiptData.time}`)}`} 
                                    alt="Slot Location QR Code" 
                                    style={{padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} 
                                />
                            </div>

                            <p style={{color: '#64748b', fontSize: '0.85rem', marginBottom: '25px'}}>Scan QR to find vehicle location on map</p>

                            <div style={{display: 'flex', gap: '10px'}}>
                                <button 
                                    onClick={() => { window.print(); setEntryReceiptData(null); }} 
                                    style={{flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                    Print Receipt
                                </button>
                                <button 
                                    onClick={() => setEntryReceiptData(null)} 
                                    style={{flex: 1, padding: '12px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
