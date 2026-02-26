import React, { useState } from 'react';
import './AkharaRegistration.css';

export default function AkharaRegistration() {
    const [formData, setFormData] = useState({
        akharaName: '',
        chiefMahant: '',
        contactNumber: '',
        tentCount: '',
        arrivalDate: '',
        departureDate: '',
        specialRequirements: ''
    });

    const [registrations, setRegistrations] = useState([]);
    const [message, setMessage] = useState('');
    const [viewRole, setViewRole] = useState('akhara'); // 'akhara' or 'officer'
    const [editingId, setEditingId] = useState(null);

    const handleStatusUpdate = (id, newStatus) => {
        setRegistrations(prev => prev.map(reg =>
            reg.id === id ? { ...reg, status: newStatus } : reg
        ));
    };

    const akharas = [
        'Juna Akhara',
        'Maha Nirvani Akhara',
        'Niranjani Akhara',
        'Bada Udasin Akhara',
        'Naya Udasin Akhara',
        'Nirmal Akhara',
        'Agni Akhara',
        'Avahan Akhara',
        'Anand Akhara',
        'Atal Akhara',
        'Digambar Ani Akhara',
        'Nirmohi Ani Akhara',
        'Nirvani Ani Akhara'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.akharaName || !formData.chiefMahant || !formData.tentCount) {
            setMessage('Please fill in all required fields (Akhara Name, Chief Mahant, Tent Count).');
            return;
        }

        if (editingId) {
            setRegistrations(prev => prev.map(reg =>
                reg.id === editingId ? { ...reg, ...formData, status: 'Pending Approval' } : reg
            ));
            setMessage(`Successfully updated registration for ${formData.akharaName}.`);
            setEditingId(null);
        } else {
            const newRegistration = {
                id: Date.now(),
                ...formData,
                status: 'Pending Approval'
            };
            setRegistrations(prev => [newRegistration, ...prev]);
            setMessage(`Successfully submitted registration for ${formData.akharaName}.`);
        }

        setFormData({
            akharaName: '',
            chiefMahant: '',
            contactNumber: '',
            tentCount: '',
            arrivalDate: '',
            departureDate: '',
            specialRequirements: ''
        });
    };

    const handleEdit = (reg) => {
        setFormData({
            akharaName: reg.akharaName,
            chiefMahant: reg.chiefMahant,
            contactNumber: reg.contactNumber,
            tentCount: reg.tentCount,
            arrivalDate: reg.arrivalDate,
            departureDate: reg.departureDate,
            specialRequirements: reg.specialRequirements
        });
        setEditingId(reg.id);
        setMessage('');
        setViewRole('akhara');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            akharaName: '',
            chiefMahant: '',
            contactNumber: '',
            tentCount: '',
            arrivalDate: '',
            departureDate: '',
            specialRequirements: ''
        });
        setMessage('');
    };

    return (
        <div className="akhara-registration-container">
            <div className="akhara-header">
                <h2>Kumbh 2027: Akhara Tent Registration</h2>
                <p>Official portal for allocating tent zones to the 13 revered Akharas during the Haridwar Kumbh.</p>
                <div className="role-toggle">
                    <button
                        className={`role-btn ${viewRole === 'akhara' ? 'active' : ''}`}
                        onClick={() => setViewRole('akhara')}
                    >
                        Akhara View
                    </button>
                    <button
                        className={`role-btn ${viewRole === 'officer' ? 'active' : ''}`}
                        onClick={() => setViewRole('officer')}
                    >
                        Mela Adhikari View
                    </button>
                </div>
            </div>

            <div className="akhara-content">
                {viewRole === 'akhara' && (
                    <div className="form-section">
                        <h3>{editingId ? 'Revise Registration' : 'New Tent Registration'}</h3>
                        {message && <div className="status-message">{message}</div>}

                        <form className="akhara-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Select Akhara *</label>
                                <select
                                    name="akharaName"
                                    value={formData.akharaName}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Choose Akhara --</option>
                                    {akharas.map(akhara => (
                                        <option key={akhara} value={akhara}>{akhara}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Chief Mahant / Spokesperson *</label>
                                <input
                                    type="text"
                                    name="chiefMahant"
                                    value={formData.chiefMahant}
                                    onChange={handleInputChange}
                                    placeholder="Enter Name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    placeholder="+91"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Number of Tents Required *</label>
                                    <input
                                        type="number"
                                        name="tentCount"
                                        min="1"
                                        max="5000"
                                        value={formData.tentCount}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Expected Arrival Date</label>
                                    <input
                                        type="date"
                                        name="arrivalDate"
                                        value={formData.arrivalDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group half">
                                    <label>Expected Departure Date</label>
                                    <input
                                        type="date"
                                        name="departureDate"
                                        value={formData.departureDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Special Requirements (Electricity, Water, Security)</label>
                                <textarea
                                    name="specialRequirements"
                                    value={formData.specialRequirements}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="List any special facilities needed..."
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="submit-btn btn-primary">
                                    {editingId ? 'Update Request' : 'Submit Request'}
                                </button>
                                {editingId && (
                                    <button type="button" className="submit-btn" onClick={handleCancelEdit} style={{ backgroundColor: '#9e9e9e' }}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                <div className={`registry-section ${viewRole === 'officer' ? 'full-width' : ''}`}>
                    <h3>{viewRole === 'officer' ? 'All Registration Requests' : 'Registered Akharas'} ({registrations.length})</h3>
                    <div className={`registry-list ${viewRole === 'officer' ? 'officer-grid' : ''}`}>
                        {registrations.length === 0 ? (
                            <p className="no-data">No registrations filed yet.</p>
                        ) : (
                            registrations.map(reg => (
                                <div key={reg.id} className="registry-card">
                                    <div className="card-header">
                                        <h4>{reg.akharaName}</h4>
                                        <span className={`status-badge ${reg.status.split(' ')[0].toLowerCase()}`}>{reg.status}</span>
                                    </div>
                                    <div className="card-body">
                                        <p><strong>Mahant:</strong> {reg.chiefMahant}</p>
                                        <p><strong>Contact:</strong> {reg.contactNumber || 'N/A'}</p>
                                        <p><strong>Tents requested:</strong> {reg.tentCount}</p>
                                        {reg.arrivalDate && <p><strong>Camp Dates:</strong> {reg.arrivalDate} to {reg.departureDate || 'TBD'}</p>}
                                        {viewRole === 'officer' && reg.specialRequirements && <p><strong>Special Req:</strong> {reg.specialRequirements}</p>}
                                    </div>
                                    {viewRole === 'officer' && (
                                        <div className="officer-actions">
                                            <button
                                                className="action-btn approve"
                                                onClick={() => handleStatusUpdate(reg.id, 'Approved')}
                                                disabled={reg.status === 'Approved'}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="action-btn revise"
                                                onClick={() => handleStatusUpdate(reg.id, 'Revision Requested')}
                                                disabled={reg.status === 'Revision Requested'}
                                            >
                                                Revise
                                            </button>
                                            <button
                                                className="action-btn reject"
                                                onClick={() => handleStatusUpdate(reg.id, 'Rejected')}
                                                disabled={reg.status === 'Rejected'}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {viewRole === 'akhara' && reg.status === 'Revision Requested' && (
                                        <div className="officer-actions">
                                            <button
                                                className="action-btn revise"
                                                onClick={() => handleEdit(reg)}
                                            >
                                                Edit / Revise Details
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
