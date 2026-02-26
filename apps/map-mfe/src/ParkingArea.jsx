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
                if (parkingData[sectorKey][bay].includes(reg)) {
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
        newData[availableSlot.sector][availableSlot.bay][availableSlot.index] = reg;

        const slotId = `${availableSlot.sector}-${availableSlot.bay}-${String(availableSlot.index + 1).padStart(3, '0')}`;

        setParkingData(newData);
        setMovementLog([{ id: Date.now(), time: new Date().toLocaleTimeString(), type: 'IN', reg, slot: slotId }, ...movementLog]);
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

        let found = false;
        const newData = { ...parkingData };

        for (let s = 1; s <= TOTAL_SECTORS; s++) {
            const sectorKey = `S${s}`;
            for (const bay of ['A1', 'A2']) {
                const slotIndex = newData[sectorKey][bay].findIndex(slot => slot === reg);
                if (slotIndex !== -1) {
                    // Car found, empty slot
                    newData[sectorKey][bay] = [...newData[sectorKey][bay]];
                    newData[sectorKey][bay][slotIndex] = null;
                    found = true;

                    const slotId = `${sectorKey}-${bay}-${String(slotIndex + 1).padStart(3, '0')}`;

                    setParkingData(newData);
                    setMovementLog([{ id: Date.now(), time: new Date().toLocaleTimeString(), type: 'OUT', reg, slot: slotId }, ...movementLog]);
                    setExitRegInput('');
                    setMessage(`Car ${reg} exited from ${slotId}`);
                    setActiveSector(sectorKey);
                    setActiveBay(bay);
                    return;
                }
            }
        }

        if (!found) {
            setMessage(`Car ${reg} not found in parking.`);
        }
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
                        parkedList.push({ reg: slot, slot: `${sectorKey}-${bay}-${String(index + 1).padStart(3, '0')}` });
                    }
                });
            }
        }
        return { total, occupied, available: total - occupied, parkedList };
    };

    const stats = calculateOccupancy();

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
                                    title={slot ? `Occupied by ${slot}` : 'Empty'}
                                >
                                    <span className="slot-number">{String(index + 1).padStart(3, '0')}</span>
                                    {slot && <span className="car-reg">{slot}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="movement-details">
                <div className="movement-log">
                    <h4>Movement Activity Log</h4>
                    <div className="log-list">
                        {movementLog.length === 0 ? <p className="text-muted">No movements yet.</p> : (
                            <ul>
                                {movementLog.map(log => (
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

                <div className="parked-cars">
                    <h4>Currently Parked Vehicles ({stats.occupied})</h4>
                    <div className="parked-list">
                        {stats.parkedList.length === 0 ? <p className="text-muted">Parking lot is empty.</p> : (
                            <ul>
                                {stats.parkedList.map((car, i) => (
                                    <li key={i} className="parked-item">
                                        <span className="reg-badge">{car.reg}</span> - <span>{car.slot}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
