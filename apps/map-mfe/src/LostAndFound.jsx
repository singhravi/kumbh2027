import React, { useState, useRef } from 'react';
import './LostAndFound.css';

export default function LostAndFound() {
    const [activeTab, setActiveTab] = useState('report'); // 'report', 'log', 'search'
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');

    const [reportData, setReportData] = useState({
        itemName: '',
        category: '',
        description: '',
        lastSeenLocation: '',
        dateLost: '',
        contactName: '',
        contactPhone: '',
        itemImage: null,
        relationship: ''
    });

    const [logData, setLogData] = useState({
        itemName: '',
        category: '',
        description: '',
        foundLocation: '',
        dateFound: '',
        depositedAt: '',
        itemImage: null,
        relationship: ''
    });

    // Camera State
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [activeCameraForm, setActiveCameraForm] = useState(null); // 'report' or 'log'
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const categories = [
        'Electronics (Phones, Cameras)',
        'Wallet / Cash / Cards',
        'Bags / Luggage',
        'Jewelry / Valuables',
        'Clothing / Accessories',
        'Documents / ID',
        'People (Lost Children/Elderly)',
        'Other'
    ];

    const locations = [
        'Har Ki Pauri',
        'Chandi Ghat',
        'Kankhal',
        'Mansa Devi Ropeway',
        'Chandi Devi',
        'Railway Station',
        'Bus Stand',
        'Sector 1',
        'Sector 2',
        'Sector 3',
        'Other'
    ];

    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReportData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogChange = (e) => {
        const { name, value } = e.target;
        setLogData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e, formType) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (formType === 'report') {
                    setReportData(prev => ({ ...prev, itemImage: reader.result }));
                } else {
                    setLogData(prev => ({ ...prev, itemImage: reader.result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async (formType, preferredFacingMode = facingMode) => {
        // Stop existing stream if any before starting a new one
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: preferredFacingMode }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setActiveCameraForm(formType);
            setFacingMode(preferredFacingMode);
            setIsCameraActive(true);
            setMessage(''); // Clear any previous errors
        } catch (err) {
            console.error("Error accessing webcam: ", err);
            setMessage("Unable to access camera. Please check permissions.");
        }
    };

    const toggleCamera = () => {
        const newMode = facingMode === 'environment' ? 'user' : 'environment';
        startCamera(activeCameraForm, newMode);
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
        setActiveCameraForm(null);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            const dataUrl = canvasRef.current.toDataURL('image/png');

            if (activeCameraForm === 'report') {
                setReportData(prev => ({ ...prev, itemImage: dataUrl }));
            } else if (activeCameraForm === 'log') {
                setLogData(prev => ({ ...prev, itemImage: dataUrl }));
            }

            stopCamera();
        }
    };

    const handleReportSubmit = (e) => {
        e.preventDefault();
        if (!reportData.itemName || !reportData.contactPhone) {
            setMessage('Item Name and Contact Phone are required.');
            return;
        }

        const newItem = {
            id: `L-${Date.now()}`,
            type: 'LOST',
            status: 'Searching',
            ...reportData,
            dateReported: new Date().toLocaleDateString()
        };

        setItems(prev => [newItem, ...prev]);
        setMessage('Lost item reported successfully. Our teams have been notified.');
        setReportData({
            itemName: '', category: '', description: '', lastSeenLocation: '', dateLost: '', contactName: '', contactPhone: '', itemImage: null, relationship: ''
        });
    };

    const handleLogSubmit = (e) => {
        e.preventDefault();
        if (!logData.itemName || !logData.depositedAt) {
            setMessage('Item Name and Deposition Location are required.');
            return;
        }

        const newItem = {
            id: `F-${Date.now()}`,
            type: 'FOUND',
            status: 'Safe',
            ...logData,
            dateReported: new Date().toLocaleDateString()
        };

        setItems(prev => [newItem, ...prev]);
        setMessage('Found item logged successfully.');
        setLogData({
            itemName: '', category: '', description: '', foundLocation: '', dateFound: '', depositedAt: '', itemImage: null, relationship: ''
        });
    };

    const markAsResolved = (id) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, status: item.type === 'LOST' ? 'Recovered' : 'Claimed' } : item
        ));
    };

    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="lnf-container">
            <div className="lnf-header">
                <h2>Lost & Found Dashboard</h2>
                <p>Central Registry for Kumbh Mela 2027</p>
            </div>

            <div className="lnf-navbar">
                <button className={`lnf-tab ${activeTab === 'report' ? 'active' : ''}`} onClick={() => { setActiveTab('report'); setMessage(''); }}>Report Lost Item</button>
                <button className={`lnf-tab ${activeTab === 'log' ? 'active' : ''}`} onClick={() => { setActiveTab('log'); setMessage(''); }}>Log Found Item</button>
                <button className={`lnf-tab ${activeTab === 'search' ? 'active' : ''}`} onClick={() => { setActiveTab('search'); setMessage(''); }}>Search Registry</button>
            </div>

            <div className="lnf-content">
                {message && <div className="status-message">{message}</div>}

                {activeTab === 'report' && (
                    <form className="lnf-form" onSubmit={handleReportSubmit}>
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Item Name / Description *</label>
                                <input type="text" name="itemName" value={reportData.itemName} onChange={handleReportChange} required />
                            </div>
                            <div className="form-group half">
                                <label>Category</label>
                                <select name="category" value={reportData.category} onChange={handleReportChange}>
                                    <option value="">-- Select Category --</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {reportData.category === 'People (Lost Children/Elderly)' && (
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>Relationship to Lost Person *</label>
                                    <input type="text" name="relationship" value={reportData.relationship} onChange={handleReportChange} placeholder="e.g., Parent, Sibling, Friend" required={reportData.category === 'People (Lost Children/Elderly)'} />
                                </div>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Last Seen Location</label>
                                <select name="lastSeenLocation" value={reportData.lastSeenLocation} onChange={handleReportChange}>
                                    <option value="">-- Select Location --</option>
                                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="form-group half">
                                <label>Date Lost</label>
                                <input type="date" name="dateLost" value={reportData.dateLost} onChange={handleReportChange} />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Detailed Description</label>
                            <textarea name="description" value={reportData.description} onChange={handleReportChange} rows="2" placeholder="Color, brand, identifying marks..."></textarea>
                        </div>

                        <div className="form-group full-width">
                            <label>Item Image</label>

                            {isCameraActive && activeCameraForm === 'report' ? (
                                <div className="camera-section">
                                    <div className="camera-container">
                                        <video ref={videoRef} autoPlay playsInline muted></video>
                                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                    </div>
                                    <div className="camera-controls">
                                        <button type="button" className="action-btn switch-cam-btn" onClick={toggleCamera}>🔄 Switch</button>
                                        <button type="button" className="action-btn capture-btn" onClick={capturePhoto}>📸 Capture</button>
                                        <button type="button" className="action-btn cancel-cam-btn" onClick={stopCamera}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="image-upload-container">
                                    <div className="upload-options">
                                        <input type="file" accept="image/*" id="reportImage" onChange={(e) => handleImageUpload(e, 'report')} style={{ display: 'none' }} />
                                        <label htmlFor="reportImage" className="upload-btn">
                                            📁 Upload Image
                                        </label>
                                        <button type="button" className="upload-btn alt-btn" onClick={() => startCamera('report')}>
                                            📷 Take Picture
                                        </button>
                                    </div>

                                    {reportData.itemImage && (
                                        <div className="photo-preview-container">
                                            <img src={reportData.itemImage} alt="Preview" className="image-preview" />
                                            <button type="button" className="retake-btn" onClick={() => setReportData(prev => ({ ...prev, itemImage: null }))}>Remove Image</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Contact Name</label>
                                <input type="text" name="contactName" value={reportData.contactName} onChange={handleReportChange} />
                            </div>
                            <div className="form-group half">
                                <label>Contact Phone / Alt. Number *</label>
                                <input type="text" name="contactPhone" value={reportData.contactPhone} onChange={handleReportChange} required />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn lnf-btn-red">Report as Lost</button>
                    </form>
                )}

                {activeTab === 'log' && (
                    <form className="lnf-form" onSubmit={handleLogSubmit}>
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Found Item Name *</label>
                                <input type="text" name="itemName" value={logData.itemName} onChange={handleLogChange} required />
                            </div>
                            <div className="form-group half">
                                <label>Category</label>
                                <select name="category" value={logData.category} onChange={handleLogChange}>
                                    <option value="">-- Select Category --</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {logData.category === 'People (Lost Children/Elderly)' && (
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>Relationship to Found Person (If known/applicable)</label>
                                    <input type="text" name="relationship" value={logData.relationship} onChange={handleLogChange} placeholder="e.g., Volunteer, Police, Helpful Citizen" />
                                </div>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Found Location</label>
                                <select name="foundLocation" value={logData.foundLocation} onChange={handleLogChange}>
                                    <option value="">-- Select Location --</option>
                                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="form-group half">
                                <label>Date Found</label>
                                <input type="date" name="dateFound" value={logData.dateFound} onChange={handleLogChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Where is the item currently deposited? *</label>
                            <input type="text" name="depositedAt" value={logData.depositedAt} onChange={handleLogChange} placeholder="e.g., Har Ki Pauri Police Booth 3" required />
                        </div>

                        <div className="form-group full-width">
                            <label>Identifying Characteristics (Visible to Staff Only)</label>
                            <textarea name="description" value={logData.description} onChange={handleLogChange} rows="2"></textarea>
                        </div>

                        <div className="form-group full-width">
                            <label>Item Image</label>

                            {isCameraActive && activeCameraForm === 'log' ? (
                                <div className="camera-section">
                                    <div className="camera-container">
                                        <video ref={videoRef} autoPlay playsInline muted></video>
                                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                    </div>
                                    <div className="camera-controls">
                                        <button type="button" className="action-btn switch-cam-btn" onClick={toggleCamera}>🔄 Switch</button>
                                        <button type="button" className="action-btn capture-btn" onClick={capturePhoto}>📸 Capture</button>
                                        <button type="button" className="action-btn cancel-cam-btn" onClick={stopCamera}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="image-upload-container">
                                    <div className="upload-options">
                                        <input type="file" accept="image/*" id="logImage" onChange={(e) => handleImageUpload(e, 'log')} style={{ display: 'none' }} />
                                        <label htmlFor="logImage" className="upload-btn">
                                            📁 Upload Image
                                        </label>
                                        <button type="button" className="upload-btn alt-btn" onClick={() => startCamera('log')}>
                                            📷 Take Picture
                                        </button>
                                    </div>

                                    {logData.itemImage && (
                                        <div className="photo-preview-container">
                                            <img src={logData.itemImage} alt="Preview" className="image-preview" />
                                            <button type="button" className="retake-btn" onClick={() => setLogData(prev => ({ ...prev, itemImage: null }))}>Remove Image</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="submit-btn lnf-btn-green">Log Found Item</button>
                    </form>
                )}

                {activeTab === 'search' && (
                    <div className="lnf-search-view">
                        <input
                            type="text"
                            className="lnf-search-bar"
                            placeholder="Search by ID, Name, or Category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <div className="lnf-grid">
                            {filteredItems.length === 0 ? (
                                <p className="no-items">No items found matching your search.</p>
                            ) : (
                                filteredItems.map(item => (
                                    <div key={item.id} className={`lnf-card ${item.type.toLowerCase()}`}>
                                        <div className="card-header">
                                            <span className={`badge ${item.type}`}>{item.type}</span>
                                            <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                                        </div>
                                        {item.itemImage && (
                                            <div className="card-image-wrapper">
                                                <img src={item.itemImage} alt="Item" className="lnf-card-image" />
                                            </div>
                                        )}
                                        <h3>{item.itemName}</h3>
                                        <p className="detail"><small>ID:</small> {item.id}</p>
                                        <p className="detail"><small>Category:</small> {item.category || 'N/A'}</p>
                                        {item.category === 'People (Lost Children/Elderly)' && item.relationship && (
                                            <p className="detail"><small>Relationship:</small> {item.relationship}</p>
                                        )}
                                        {item.type === 'LOST' ? (
                                            <>
                                                <p className="detail"><small>Last Seen:</small> {item.lastSeenLocation || 'N/A'}</p>
                                                <p className="detail"><small>Contact:</small> {item.contactPhone}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="detail"><small>Found at:</small> {item.foundLocation || 'N/A'}</p>
                                                <p className="detail"><small>Deposited at:</small> {item.depositedAt}</p>
                                            </>
                                        )}

                                        {item.status !== 'Recovered' && item.status !== 'Claimed' && (
                                            <button
                                                className="resolve-btn"
                                                onClick={() => markAsResolved(item.id)}
                                            >
                                                Mark as {item.type === 'LOST' ? 'Recovered' : 'Claimed'}
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
