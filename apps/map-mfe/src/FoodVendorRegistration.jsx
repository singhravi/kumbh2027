import React, { useState, useRef, useEffect } from 'react';
import './FoodVendorRegistration.css';

export default function FoodVendorRegistration() {
    const [viewRole, setViewRole] = useState('vendor'); // 'vendor' or 'adhikari'
    const [activeTab, setActiveTab] = useState('new'); // 'new', 'status' (for vendor) or 'all' (for adhikari)
    const [message, setMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        organizationName: '',
        gstNumber: '',
        ownerName: '',
        mobileNumber: '',
        aadhaarNumber: '',
        fssaiLicense: '',
        stallType: '',
        proposedZone: '',
        specialRequirements: ''
    });

    const [photoDataUrl, setPhotoDataUrl] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Mock initial registry
    const [registry, setRegistry] = useState([
        {
            id: 'FSR-10023',
            organizationName: 'Shree Ganga Bhojnalaya',
            gstNumber: '05AAAAA1234A1Z5',
            ownerName: 'Ramesh Sharma',
            mobileNumber: '9876543210',
            aadhaarNumber: '123456789012',
            fssaiLicense: 'FSSAI-1029384756',
            stallType: 'Thali Meals',
            proposedZone: 'Har Ki Pauri',
            specialRequirements: 'Needs running water connection',
            status: 'Approved',
            submissionDate: '15/10/2026'
        },
        {
            id: 'FSR-10045',
            organizationName: 'Bikaner Sweets & Snacks',
            gstNumber: '05BBBBB5678B2Z6',
            ownerName: 'Sanjay Gupta',
            mobileNumber: '8765432109',
            aadhaarNumber: '987654321098',
            fssaiLicense: 'FSSAI-7364829104',
            stallType: 'Snacks/Sweets',
            proposedZone: 'Kankhal',
            specialRequirements: 'Requires 3-phase electricity',
            status: 'Pending',
            submissionDate: '16/10/2026'
        }
    ]);

    const [selectedVendorForPass, setSelectedVendorForPass] = useState(null);
    const printRef = useRef(null);

    const zones = [
        'Har Ki Pauri', 'Kankhal', 'Chandi Ghat', 'Bairagi Camp', 'Bhupatwala', 'Rishikesh'
    ];

    const stallTypes = [
        'Thali Meals', 'Snacks/Sweets', 'Tea/Beverages', 'Packed Foods', 'Langar (Free Meals)'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
            setIsCameraActive(true);
            setPhotoDataUrl(null);
        } catch (err) {
            console.error("Error accessing camera: ", err);
            setMessage("Error accessing camera. Please ensure permissions are granted.");
        }
    };

    const capturePhoto = (e) => {
        e.preventDefault();
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const dataUrl = canvasRef.current.toDataURL('image/png');
            setPhotoDataUrl(dataUrl);
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.organizationName || !formData.ownerName || !formData.mobileNumber || !formData.proposedZone || !formData.stallType || !photoDataUrl) {
            setMessage('Please fill in all mandatory fields and capture a photo of the owner.');
            return;
        }
        if (formData.mobileNumber.length !== 10) {
            setMessage('Mobile number must be 10 digits.');
            return;
        }

        if (isEditing) {
            // Update existing request specifically from Revise state back to Pending
            const updatedRegistry = registry.map(item => {
                if (item.id === editingId) {
                    return { ...item, ...formData, photoUrl: photoDataUrl, status: 'Pending' };
                }
                return item;
            });
            setRegistry(updatedRegistry);
            setMessage(`Registration ${editingId} successfully updated and resubmitted.`);

        } else {
            // Handle New Request
            const newRegistration = {
                id: `FSR-${Math.floor(10000 + Math.random() * 90000)}`,
                ...formData,
                photoUrl: photoDataUrl,
                status: 'Pending',
                submissionDate: new Date().toLocaleDateString()
            };

            setRegistry([newRegistration, ...registry]);
            setMessage(`Registration submitted successfully! Your tracking ID is ${newRegistration.id}.`);
        }

        resetForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setActiveTab('status'), 1500);
    };

    const resetForm = () => {
        setFormData({
            organizationName: '', gstNumber: '', ownerName: '', mobileNumber: '', aadhaarNumber: '', fssaiLicense: '', stallType: '', proposedZone: '', specialRequirements: ''
        });
        setPhotoDataUrl(null);
        setIsEditing(false);
        setEditingId(null);
        setMessage('');
    };

    const startEdit = (vendor) => {
        setFormData({
            organizationName: vendor.organizationName,
            gstNumber: vendor.gstNumber || '',
            ownerName: vendor.ownerName,
            mobileNumber: vendor.mobileNumber,
            aadhaarNumber: vendor.aadhaarNumber,
            fssaiLicense: vendor.fssaiLicense,
            stallType: vendor.stallType,
            proposedZone: vendor.proposedZone,
            specialRequirements: vendor.specialRequirements
        });
        setPhotoDataUrl(vendor.photoUrl || null); // Load existing photo if available
        setIsEditing(true);
        setEditingId(vendor.id);
        setActiveTab('new');
        setMessage(`Editing Application: ${vendor.id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStatusUpdate = (id, newStatus) => {
        const updatedRegistry = registry.map(item => {
            if (item.id === id) {
                return { ...item, status: newStatus };
            }
            return item;
        });
        setRegistry(updatedRegistry);
        setMessage(`Registration ${id} explicitly marked as ${newStatus}.`);
    };

    const generatePass = (vendor) => {
        setSelectedVendorForPass({
            ...vendor,
            issueDate: new Date().toLocaleDateString(),
            validUntil: '30/05/2027'
        });
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const closePassPreview = () => {
        setSelectedVendorForPass(null);
    };

    const handlePrint = () => {
        const element = printRef.current;
        const opt = {
            margin:       10,
            filename:     'food-vendor-pass.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        if (!window.html2pdf) {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.onload = () => {
                window.html2pdf().set(opt).from(element).save();
            };
            document.body.appendChild(script);
        } else {
            window.html2pdf().set(opt).from(element).save();
        }
    };

    // Switch tabs when changing roles
    useEffect(() => {
        if (viewRole === 'adhikari') {
            setActiveTab('all');
        } else {
            setActiveTab('new');
        }
        setMessage('');
        closePassPreview();
    }, [viewRole]);


    return (
        <div className="food-vendor-container">
            <div className="vendor-header">
                <h2>Kumbh 2027 Food Stall Registration</h2>
                <div className="role-toggle">
                    <label>Viewing As: </label>
                    <select value={viewRole} onChange={(e) => setViewRole(e.target.value)} className="role-select">
                        <option value="vendor">Vendor / Organization</option>
                        <option value="adhikari">Mela Adhikari (Admin)</option>
                    </select>
                </div>
            </div>

            {message && <div className={`status-message ${message.includes('successfully') || message.includes('Approved') ? 'success' : 'info'}`}>{message}</div>}

            <div className="tab-navigation">
                {viewRole === 'vendor' ? (
                    <>
                        <button className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`} onClick={() => { setActiveTab('new'); if (!isEditing) resetForm(); }}>
                            {isEditing ? '📝 Edit Application' : '📝 New Registration'}
                        </button>
                        <button className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`} onClick={() => setActiveTab('status')}>📋 My Applications Status</button>
                    </>
                ) : (
                    <button className={`tab-btn active`}>🛡️ Central Vendor Registry</button>
                )}
            </div>

            <div className="tab-content">
                {/* VENDOR VIEW - FORM */}
                {viewRole === 'vendor' && activeTab === 'new' && (
                    <div className="form-panel">
                        <h3>{isEditing ? `Revise Application: ${editingId}` : 'Submit New Food Stall Application'}</h3>

                        <div className="camera-section">
                            <h4>Owner Photo Capture *</h4>
                            <div className="camera-container">
                                {!photoDataUrl ? (
                                    <>
                                        <video ref={videoRef} autoPlay playsInline style={{ display: isCameraActive ? 'block' : 'none' }}></video>
                                        {!isCameraActive ? (
                                            <div className="camera-placeholder" onClick={startCamera}>
                                                <span className="camera-icon">📷</span>
                                                <p>Click to Start Camera</p>
                                            </div>
                                        ) : (
                                            <button className="capture-btn" onClick={capturePhoto}>Capture Photo</button>
                                        )}
                                    </>
                                ) : (
                                    <div className="photo-preview-container">
                                        <img src={photoDataUrl} alt="Captured Owner Preview" className="photo-preview" />
                                        <button className="retake-btn" onClick={() => { setPhotoDataUrl(null); startCamera(); }}>Retake Photo</button>
                                    </div>
                                )}
                                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="vendor-form">
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Organization / Stall Name *</label>
                                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange} placeholder="E.g., Shree Ganga Bhojnalaya" required />
                                </div>
                                <div className="form-group half">
                                    <label>GST Number (Optional)</label>
                                    <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="15 character GSTIN" maxLength="15" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Owner/Applicant Name *</label>
                                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group half">
                                    <label>Mobile Number *</label>
                                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} maxLength="10" placeholder="10 Digits" required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Aadhaar Number</label>
                                    <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} maxLength="12" placeholder="12 Digits" />
                                </div>
                                <div className="form-group half">
                                    <label>FSSAI License Number (Optional for Langars)</label>
                                    <input type="text" name="fssaiLicense" value={formData.fssaiLicense} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Proposed Zone *</label>
                                    <select name="proposedZone" value={formData.proposedZone} onChange={handleInputChange} required>
                                        <option value="">-- Choose Zone --</option>
                                        {zones.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label>Stall Type *</label>
                                    <select name="stallType" value={formData.stallType} onChange={handleInputChange} required>
                                        <option value="">-- Choose Type --</option>
                                        {stallTypes.map(st => <option key={st} value={st}>{st}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Special Utility Requirements</label>
                                <textarea name="specialRequirements" value={formData.specialRequirements} onChange={handleInputChange} rows="2" placeholder="E.g., High capacity electricity, dedicated water line etc."></textarea>
                            </div>

                            <div className="form-actions">
                                {isEditing && <button type="button" className="btn-outline" onClick={resetForm}>Cancel Edit</button>}
                                <button type="submit" className="btn-primary">{isEditing ? 'Resubmit Application' : 'Submit Application'}</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* LIST VIEW (Vendor Status OR Adhikari Dashboard) */}
                {((viewRole === 'vendor' && activeTab === 'status') || viewRole === 'adhikari') && (
                    <div className="list-panel">
                        <h3>{viewRole === 'adhikari' ? 'All Vendor Registrations' : 'Your Submitted Applications'}</h3>

                        {registry.length === 0 ? (
                            <p className="no-data">No registrations found.</p>
                        ) : (
                            <div className="registry-list">
                                {registry.map(vendor => (
                                    <div key={vendor.id} className={`registry-card ${vendor.status.toLowerCase().replace(' ', '-')}`}>
                                        <div className="card-header">
                                            <span className="reg-id">{vendor.id}</span>
                                            <span className={`status-badge ${vendor.status.toLowerCase().replace(' ', '-')}`}>{vendor.status}</span>
                                        </div>

                                        <div className="card-body">
                                            <h4>{vendor.organizationName}</h4>
                                            <p><strong>Proposed Zone:</strong> {vendor.proposedZone}</p>
                                            <p><strong>Type:</strong> {vendor.stallType}</p>
                                            <p><strong>Applicant:</strong> {vendor.ownerName} ({vendor.mobileNumber})</p>
                                            {vendor.gstNumber && <p><strong>GST:</strong> {vendor.gstNumber}</p>}
                                            {vendor.fssaiLicense && <p><strong>FSSAI:</strong> {vendor.fssaiLicense}</p>}
                                            <p className="submission-date">Submitted: {vendor.submissionDate}</p>
                                        </div>

                                        <div className="card-actions">
                                            {/* VENDOR ACTIONS */}
                                            {viewRole === 'vendor' && vendor.status === 'Approved' && (
                                                <button className="btn-primary" onClick={() => generatePass(vendor)}>🎫 Generate Pass</button>
                                            )}
                                            {viewRole === 'vendor' && vendor.status === 'Revision Requested' && (
                                                <button className="btn-secondary" onClick={() => startEdit(vendor)}>✏️ Edit & Resubmit</button>
                                            )}

                                            {/* MELA ADHIKARI ACTIONS */}
                                            {viewRole === 'adhikari' && (
                                                <div className="officer-actions">
                                                    {vendor.status === 'Pending' || vendor.status === 'Revision Requested' ? (
                                                        <>
                                                            <button className="btn-approve" onClick={() => handleStatusUpdate(vendor.id, 'Approved')}>✓ Approve</button>
                                                            <button className="btn-revise" onClick={() => handleStatusUpdate(vendor.id, 'Revision Requested')}>↩ Request Revision</button>
                                                            <button className="btn-reject" onClick={() => handleStatusUpdate(vendor.id, 'Rejected')}>✗ Reject</button>
                                                        </>
                                                    ) : null}

                                                    {vendor.status === 'Approved' && (
                                                        <button className="btn-blacklist" onClick={() => handleStatusUpdate(vendor.id, 'Blacklisted')}>🚫 Blacklist / Revoke</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PASS GENERATION PREVIEW (Vendor Only on Approved Items) */}
                {selectedVendorForPass && viewRole === 'vendor' && (
                    <div className="pass-panel">
                        <div className="pass-actions no-print">
                            <h3>Official Vendor Pass</h3>
                            <div className="btn-group">
                                <button onClick={handlePrint} className="btn-secondary">🖨️ Print Pass</button>
                                <button onClick={closePassPreview} className="btn-outline">Close Preview</button>
                            </div>
                        </div>

                        <div className="vendor-pass-wrapper" ref={printRef}>
                            <div className="vendor-pass">
                                <div className="pass-header">
                                    <span className="logo-placeholder">🕉️</span>
                                    <h3>KUMBH MELA 2027<br /><span>Haridwar Administration</span></h3>
                                    <div className="pass-title">AUTHORIZED FOOD VENDOR</div>
                                </div>

                                <div className="pass-body">
                                    <div className="qr-section">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=VendorID:${selectedVendorForPass.id}%0AOrg:${selectedVendorForPass.organizationName}%0AZone:${selectedVendorForPass.proposedZone}%0AMobile:${selectedVendorForPass.mobileNumber}`}
                                            alt="Vendor QR"
                                        />
                                        <div className="vendor-id-badge">ID: {selectedVendorForPass.id}</div>
                                    </div>

                                    <div className="vendor-details-section">
                                        <div className="owner-photo-pass">
                                            {selectedVendorForPass.photoUrl ? (
                                                <img src={selectedVendorForPass.photoUrl} alt="Owner" />
                                            ) : (
                                                <span className="photo-placeholder">👤</span>
                                            )}
                                        </div>
                                        <h2 className="org-name">{selectedVendorForPass.organizationName}</h2>
                                        <h4 className="owner-name">Prop: {selectedVendorForPass.ownerName}</h4>
                                        <table className="pass-details-table">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Assigned Zone:</strong></td>
                                                    <td className="highlight-zone">{selectedVendorForPass.proposedZone}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Stall Type:</strong></td>
                                                    <td>{selectedVendorForPass.stallType}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Mobile:</strong></td>
                                                    <td>+91 {selectedVendorForPass.mobileNumber}</td>
                                                </tr>
                                                {selectedVendorForPass.gstNumber && (
                                                    <tr>
                                                        <td><strong>GSTIN:</strong></td>
                                                        <td>{selectedVendorForPass.gstNumber}</td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td><strong>FSSAI:</strong></td>
                                                    <td>{selectedVendorForPass.fssaiLicense || 'Exempted/Langar'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="pass-footer">
                                    <div className="validity">
                                        <p>Issue Date: {selectedVendorForPass.issueDate}</p>
                                        <p>Valid Until: {selectedVendorForPass.validUntil}</p>
                                    </div>
                                    <div className="signature">
                                        <div className="sig-line"></div>
                                        <p>Mela Adhikari</p>
                                    </div>
                                </div>
                                <div className="pass-warning">
                                    This pass must be displayed prominently at the stall location. Subject to random inspections.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
