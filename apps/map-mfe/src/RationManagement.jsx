import React, { useState } from 'react';
import './RationManagement.css';

export default function RationManagement() {
    const [activeTab, setActiveTab] = useState('receipts'); // receipts, requests, supply
    const [message, setMessage] = useState('');

    // State for Forms
    const [receiptData, setReceiptData] = useState({
        sourceType: 'gov-state', // gov-state, gov-central, private
        sourceName: '',
        dateReceived: '',
        vehicleNumber: '',
        items: [{ itemName: '', quantity: '', unit: 'kg' }]
    });

    const [requestData, setRequestData] = useState({
        sectorId: '',
        campName: '',
        contactPerson: '',
        contactPhone: '',
        dateRequested: '',
        itemsRequested: [{ itemName: '', quantity: '', unit: 'kg' }],
        urgency: 'normal' // normal, high, critical
    });

    const [supplyData, setSupplyData] = useState({
        distributionDate: '',
        targetSectorId: '',
        targetCampName: '',
        vehicleNumber: '',
        driverName: '',
        itemsDispatched: [{ itemName: '', quantity: '', unit: 'kg' }]
    });

    // Mock Data Registries
    const [receiptsLog, setReceiptsLog] = useState([
        { id: 'RC-001', source: 'Govt (State)', date: '2026-02-25', items: 'Rice (5000kg), Wheat (3000kg)' },
        { id: 'RC-002', source: 'Private (Reliance Trust)', date: '2026-02-26', items: 'Cooking Oil (500L), Dal (1000kg)' }
    ]);

    const [requestsLog, setRequestsLog] = useState([
        { id: 'RQ-101', camp: 'Sector 4 Base Camp', date: '2026-02-27', items: 'Rice (500kg), Dal (200kg)', urgency: 'high', status: 'Pending' },
        { id: 'RQ-102', camp: 'Akhanda Ashram', date: '2026-02-26', items: 'Wheat (1000kg)', urgency: 'normal', status: 'Fulfilled' }
    ]);

    const [supplyLog, setSupplyLog] = useState([
        { id: 'SP-050', target: 'Sector 2 Camps', date: '2026-02-26', vehicle: 'UK08-TA-1234', status: 'Dispatched' }
    ]);

    // Item Array Handlers
    const handleItemChange = (stateObj, setStateFunc, arrayName, index, field, value) => {
        const newItems = [...stateObj[arrayName]];
        newItems[index][field] = value;
        setStateFunc({ ...stateObj, [arrayName]: newItems });
    };

    const addItemRow = (stateObj, setStateFunc, arrayName) => {
        setStateFunc({ ...stateObj, [arrayName]: [...stateObj[arrayName], { itemName: '', quantity: '', unit: 'kg' }] });
    };

    const removeItemRow = (stateObj, setStateFunc, arrayName, index) => {
        const newItems = stateObj[arrayName].filter((_, i) => i !== index);
        setStateFunc({ ...stateObj, [arrayName]: newItems });
    };

    // Handlers
    const handleReceiptSubmit = (e) => {
        e.preventDefault();
        setMessage('Ration receipt recorded successfully!');
        const itemSummary = receiptData.items.map(i => `${i.itemName} (${i.quantity}${i.unit})`).join(', ');

        setReceiptsLog([{
            id: `RC-00${receiptsLog.length + 1}`,
            source: receiptData.sourceType.replace('-', ' ').toUpperCase(),
            date: receiptData.dateReceived || new Date().toISOString().split('T')[0],
            items: itemSummary || `${receiptData.items.length} item(s) logged`
        }, ...receiptsLog]);

        setReceiptData({ sourceType: 'gov-state', sourceName: '', dateReceived: '', vehicleNumber: '', items: [{ itemName: '', quantity: '', unit: 'kg' }] });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        setMessage('Ration request submitted successfully!');
        const itemSummary = requestData.itemsRequested.map(i => `${i.itemName} (${i.quantity}${i.unit})`).join(', ');

        setRequestsLog([{
            id: `RQ-10${requestsLog.length + 1}`,
            camp: requestData.campName,
            date: requestData.dateRequested || new Date().toISOString().split('T')[0],
            items: itemSummary || `${requestData.itemsRequested.length} item(s) requested`,
            urgency: requestData.urgency,
            status: 'Pending'
        }, ...requestsLog]);

        setRequestData({ sectorId: '', campName: '', contactPerson: '', contactPhone: '', dateRequested: '', itemsRequested: [{ itemName: '', quantity: '', unit: 'kg' }], urgency: 'normal' });
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSupplySubmit = (e) => {
        e.preventDefault();
        setMessage('Supply dispatch recorded successfully!');
        const itemSummary = supplyData.itemsDispatched.map(i => `${i.itemName} (${i.quantity}${i.unit})`).join(', ');

        setSupplyLog([{
            id: `SP-05${supplyLog.length + 1}`,
            target: supplyData.targetCampName,
            date: supplyData.distributionDate || new Date().toISOString().split('T')[0],
            vehicle: supplyData.vehicleNumber,
            status: 'Dispatched',
            items: itemSummary
        }, ...supplyLog]);

        setSupplyData({ distributionDate: '', targetSectorId: '', targetCampName: '', vehicleNumber: '', driverName: '', itemsDispatched: [{ itemName: '', quantity: '', unit: 'kg' }] });
        setTimeout(() => setMessage(''), 3000);
    };

    const renderReceiptsTab = () => (
        <div className="ration-panel">
            <div className="form-section">
                <h3>Log Incoming Ration Receipt</h3>
                <form onSubmit={handleReceiptSubmit} className="ration-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Source Type *</label>
                            <select value={receiptData.sourceType} onChange={(e) => setReceiptData({ ...receiptData, sourceType: e.target.value })} required>
                                <option value="gov-state">Government (State)</option>
                                <option value="gov-central">Government (Central)</option>
                                <option value="private">Private / NGO</option>
                            </select>
                        </div>
                        <div className="form-group half">
                            <label>Source/Organization Name *</label>
                            <input type="text" placeholder="e.g. FCI, State Supply Dept, NGO Name" value={receiptData.sourceName} onChange={(e) => setReceiptData({ ...receiptData, sourceName: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Date Received *</label>
                            <input type="date" value={receiptData.dateReceived} onChange={(e) => setReceiptData({ ...receiptData, dateReceived: e.target.value })} required />
                        </div>
                        <div className="form-group half">
                            <label>Transport Vehicle Number</label>
                            <input type="text" placeholder="e.g. UK07-XY-9876" value={receiptData.vehicleNumber} onChange={(e) => setReceiptData({ ...receiptData, vehicleNumber: e.target.value })} />
                        </div>
                    </div>

                    <div className="items-section">
                        <h4>Items Received</h4>
                        <div className="items-list">
                            {receiptData.items.map((item, index) => (
                                <div className="form-row dynamic-item-row" key={index}>
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <input type="text" placeholder="Item Name (e.g. Rice)" value={item.itemName} onChange={e => handleItemChange(receiptData, setReceiptData, 'items', index, 'itemName', e.target.value)} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(receiptData, setReceiptData, 'items', index, 'quantity', e.target.value)} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <select value={item.unit} onChange={e => handleItemChange(receiptData, setReceiptData, 'items', index, 'unit', e.target.value)}>
                                            <option value="kg">Kg</option>
                                            <option value="liters">Liters</option>
                                            <option value="packets">Packets</option>
                                            <option value="boxes">Boxes</option>
                                        </select>
                                    </div>
                                    {receiptData.items.length > 1 && (
                                        <button type="button" className="btn-remove-item" onClick={() => removeItemRow(receiptData, setReceiptData, 'items', index)} title="Remove Item">✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn-add-item" onClick={() => addItemRow(receiptData, setReceiptData, 'items')}>+ Add Another Item</button>
                    </div>

                    <button type="submit" className="btn-primary">Record Receipt</button>
                </form>
            </div>

            <div className="list-section">
                <h3>Recent Receipts Log</h3>
                <div className="registry-table-container">
                    <table className="ration-table">
                        <thead>
                            <tr>
                                <th>Receipt ID</th>
                                <th>Source</th>
                                <th>Date</th>
                                <th>Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptsLog.map(log => (
                                <tr key={log.id}>
                                    <td><strong>{log.id}</strong></td>
                                    <td>{log.source}</td>
                                    <td>{log.date}</td>
                                    <td>{log.items}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderRequestsTab = () => (
        <div className="ration-panel">
            <div className="form-section">
                <h3>Submit Ration Request</h3>
                <form onSubmit={handleRequestSubmit} className="ration-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Sector / Zone *</label>
                            <select value={requestData.sectorId} onChange={(e) => setRequestData({ ...requestData, sectorId: e.target.value })} required>
                                <option value="">Select Sector</option>
                                <option value="sector-1">Sector 1 (Har Ki Pauri)</option>
                                <option value="sector-2">Sector 2 (Kankhal)</option>
                                <option value="sector-3">Sector 3 (Bairagi Camp)</option>
                            </select>
                        </div>
                        <div className="form-group half">
                            <label>Camp/Akhara Name *</label>
                            <input type="text" placeholder="Name of camp making request" value={requestData.campName} onChange={(e) => setRequestData({ ...requestData, campName: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Contact Person & Phone *</label>
                            <input type="text" placeholder="Name - Phone" value={requestData.contactPerson} onChange={(e) => setRequestData({ ...requestData, contactPerson: e.target.value })} required />
                        </div>
                        <div className="form-group half">
                            <label>Urgency Level *</label>
                            <select value={requestData.urgency} onChange={(e) => setRequestData({ ...requestData, urgency: e.target.value })} required>
                                <option value="normal">Normal (Standard Supply)</option>
                                <option value="high">High (Running low)</option>
                                <option value="critical">Critical (Out of stock)</option>
                            </select>
                        </div>
                    </div>

                    <div className="items-section">
                        <h4>Items Needed</h4>
                        <div className="items-list">
                            {requestData.itemsRequested.map((item, index) => (
                                <div className="form-row dynamic-item-row" key={index}>
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <input type="text" placeholder="Required Item" value={item.itemName} onChange={e => handleItemChange(requestData, setRequestData, 'itemsRequested', index, 'itemName', e.target.value)} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(requestData, setRequestData, 'itemsRequested', index, 'quantity', e.target.value)} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <select value={item.unit} onChange={e => handleItemChange(requestData, setRequestData, 'itemsRequested', index, 'unit', e.target.value)}>
                                            <option value="kg">Kg</option>
                                            <option value="liters">Liters</option>
                                            <option value="packets">Packets</option>
                                            <option value="boxes">Boxes</option>
                                        </select>
                                    </div>
                                    {requestData.itemsRequested.length > 1 && (
                                        <button type="button" className="btn-remove-item" onClick={() => removeItemRow(requestData, setRequestData, 'itemsRequested', index)} title="Remove Item">✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn-add-item" onClick={() => addItemRow(requestData, setRequestData, 'itemsRequested')}>+ Add Another Item</button>
                    </div>

                    <button type="submit" className="btn-primary">Submit Request</button>
                </form>
            </div>

            <div className="list-section">
                <h3>Active Ration Requests</h3>
                <div className="registry-table-container">
                    <table className="ration-table">
                        <thead>
                            <tr>
                                <th>Req ID</th>
                                <th>Camp/Sector</th>
                                <th>Urgency</th>
                                <th>Status</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestsLog.map(log => (
                                <tr key={log.id}>
                                    <td><strong>{log.id}</strong></td>
                                    <td>{log.camp}</td>
                                    <td><span className={`urgency-badge ${log.urgency}`}>{log.urgency.toUpperCase()}</span></td>
                                    <td><span className={`status-badge ${log.status.toLowerCase()}`}>{log.status}</span></td>
                                    <td>{log.items}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderSupplyTab = () => (
        <div className="ration-panel">
            <div className="form-section">
                <h3>Record Supply Dispatch</h3>
                <form onSubmit={handleSupplySubmit} className="ration-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Link to Request ID (Optional)</label>
                            <input type="text" placeholder="e.g. RQ-101" />
                        </div>
                        <div className="form-group half">
                            <label>Date of Dispatch *</label>
                            <input type="date" value={supplyData.distributionDate} onChange={(e) => setSupplyData({ ...supplyData, distributionDate: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Destination Camp/Sector *</label>
                            <input type="text" placeholder="Where is this supply going?" value={supplyData.targetCampName} onChange={(e) => setSupplyData({ ...supplyData, targetCampName: e.target.value })} required />
                        </div>
                        <div className="form-group half">
                            <label>Vehicle Number *</label>
                            <input type="text" placeholder="e.g. UK08-AB-5555" value={supplyData.vehicleNumber} onChange={(e) => setSupplyData({ ...supplyData, vehicleNumber: e.target.value })} required />
                        </div>
                    </div>

                    <div className="items-section">
                        <h4>Items Dispatched</h4>
                        <div className="items-list">
                            {supplyData.itemsDispatched.map((item, index) => (
                                <div className="form-row dynamic-item-row" key={index}>
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <input type="text" placeholder="Item Name" value={item.itemName} onChange={e => handleItemChange(supplyData, setSupplyData, 'itemsDispatched', index, 'itemName', e.target.value)} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(supplyData, setSupplyData, 'itemsDispatched', index, 'quantity', e.target.value)} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <select value={item.unit} onChange={e => handleItemChange(supplyData, setSupplyData, 'itemsDispatched', index, 'unit', e.target.value)}>
                                            <option value="kg">Kg</option>
                                            <option value="liters">Liters</option>
                                            <option value="packets">Packets</option>
                                            <option value="boxes">Boxes</option>
                                        </select>
                                    </div>
                                    {supplyData.itemsDispatched.length > 1 && (
                                        <button type="button" className="btn-remove-item" onClick={() => removeItemRow(supplyData, setSupplyData, 'itemsDispatched', index)} title="Remove Item">✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn-add-item" onClick={() => addItemRow(supplyData, setSupplyData, 'itemsDispatched')}>+ Add Another Item</button>
                    </div>

                    <button type="submit" className="btn-primary">Log Dispatch</button>
                </form>
            </div>

            <div className="list-section">
                <h3>Supply Delivery Log</h3>
                <div className="registry-table-container">
                    <table className="ration-table">
                        <thead>
                            <tr>
                                <th>Dispatch ID</th>
                                <th>Destination</th>
                                <th>Date</th>
                                <th>Vehicle</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplyLog.map(log => (
                                <tr key={log.id}>
                                    <td><strong>{log.id}</strong></td>
                                    <td>{log.target}</td>
                                    <td>{log.date}</td>
                                    <td>{log.vehicle}</td>
                                    <td><span className={`status-badge ${log.status.toLowerCase()}`}>{log.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="ration-container">
            <div className="ration-header">
                <h2>Ration Management</h2>
                <p>Track incoming supplies, camp requests, and outbound distributions</p>
            </div>

            {message && <div className="status-message success">{message}</div>}

            <div className="ration-tabs-nav">
                <button
                    className={`ration-tab-btn ${activeTab === 'receipts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('receipts')}
                >
                    Incoming Receipts (Govt/Private)
                </button>
                <button
                    className={`ration-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Camp Requests
                </button>
                <button
                    className={`ration-tab-btn ${activeTab === 'supply' ? 'active' : ''}`}
                    onClick={() => setActiveTab('supply')}
                >
                    Supply & Distribution
                </button>
            </div>

            <div className="ration-tab-content">
                {activeTab === 'receipts' && renderReceiptsTab()}
                {activeTab === 'requests' && renderRequestsTab()}
                {activeTab === 'supply' && renderSupplyTab()}
            </div>
        </div>
    );
}
