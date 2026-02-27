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
        setMovementLog([{ id: Date.now(), time: new Date().toLocaleTimeString(), type: 'OUT', reg, slot: slotId, payment: paymentMethod }, ...movementLog]);

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
            <div className="parking-controls">
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

                <div className="stats-board">
                    <h3>Parking Status</h3>
                    <div className="stat-row"><span>Total Capacity:</span> <strong>{stats.total}</strong></div>
                    <div className="stat-row"><span>Available spots:</span> <strong className="text-success">{stats.available}</strong></div>
                    <div className="stat-row"><span>Occupied spots:</span> <strong className="text-danger">{stats.occupied}</strong></div>
                    {message && <div className="system-message">{message}</div>}
                </div>
            </div>

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
                    <h4>Viewing: {activeSector} - {activeBay}</h4>
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
                                            <span className="car-time">{slot.time}</span>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="movement-details">
                <div className="log-tabs-nav">
                    <button
                        className={`log-tab-btn ${activeLogTab === 'movement' ? 'active' : ''}`}
                        onClick={() => setActiveLogTab('movement')}
                    >
                        Movement Activity Log
                    </button>
                    <button
                        className={`log-tab-btn ${activeLogTab === 'parked' ? 'active' : ''}`}
                        onClick={() => setActiveLogTab('parked')}
                    >
                        Currently Parked ({stats.occupied})
                    </button>
                </div>

                <div className="log-tab-content">
                    {activeLogTab === 'movement' && (
                        <div className="movement-log">
                            <div className="log-header">
                                <h4>Recent Movements</h4>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search Vehicle Reg..."
                                    value={movementSearch}
                                    onChange={(e) => setMovementSearch(e.target.value)}
                                />
                            </div>
                            <div className="log-list">
                                {filteredMovementLog.length === 0 ? <p className="text-muted">No matching movements.</p> : (
                                    <ul>
                                        {filteredMovementLog.map(log => (
                                            <li key={log.id} className={`log-item ${log.type.toLowerCase()}`}>
                                                <span className="log-time">[{log.time}]</span>
                                                <span className={`log-type ${log.type === 'IN' ? 'text-success' : 'text-danger'}`}><strong>{log.type}</strong></span>
                                                <span className="log-reg">{log.reg}</span>
                                                <span className="log-slot">Slot: {log.slot}</span>
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
                                <h4>Vehicles in Lot</h4>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search Vehicle Reg..."
                                    value={parkedSearch}
                                    onChange={(e) => setParkedSearch(e.target.value)}
                                />
                            </div>
                            <div className="parked-list">
                                {filteredParkedList.length === 0 ? <p className="text-muted">No matching vehicles parked.</p> : (
                                    <ul>
                                        {filteredParkedList.map((car, i) => (
                                            <li key={i} className="parked-item">
                                                <div>
                                                    <span className="reg-badge">{car.reg}</span> - <span>{car.slot}</span>
                                                </div>
                                                <div style={{ fontSize: '0.8em', color: '#666' }}>Since: {car.time}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
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
        </div>
    );
}
