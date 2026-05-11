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
        itemVideo: null,
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
        itemVideo: null,
        relationship: ''
    });

    // Camera State
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
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
                setReportData(prev => ({ ...prev, itemImage: dataUrl, itemVideo: null }));
            } else if (activeCameraForm === 'log') {
                setLogData(prev => ({ ...prev, itemImage: dataUrl, itemVideo: null }));
            }

            stopCamera();
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        recordedChunksRef.current = [];
        const stream = streamRef.current;
        if (!stream) return;
        
        try {
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current.addEventListener('dataavailable', ({ data }) => {
                if (data.size > 0) {
                    recordedChunksRef.current.push(data);
                }
            });
            mediaRecorderRef.current.addEventListener('stop', () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                if (activeCameraForm === 'report') {
                    setReportData(prev => ({ ...prev, itemVideo: url, itemImage: null }));
                } else if (activeCameraForm === 'log') {
                    setLogData(prev => ({ ...prev, itemVideo: url, itemImage: null }));
                }
                setIsRecording(false);
                stopCamera();
            });
            mediaRecorderRef.current.start();
            
            setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                    mediaRecorderRef.current.stop();
                }
            }, 5000);
        } catch (e) {
            console.error("MediaRecorder error", e);
            setMessage("Video recording not supported in this browser.");
            setIsRecording(false);
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
                <button className={`lnf-tab ${activeTab === 'notice' ? 'active' : ''}`} onClick={() => { setActiveTab('notice'); setMessage(''); }} style={{ background: activeTab === 'notice' ? '#dc2626' : '', color: activeTab === 'notice' ? 'white' : ''}}>🚨 Digital Notice Board</button>
                <button className={`lnf-tab ${activeTab === 'report' ? 'active' : ''}`} onClick={() => { setActiveTab('report'); setMessage(''); }}>Report Lost</button>
                <button className={`lnf-tab ${activeTab === 'log' ? 'active' : ''}`} onClick={() => { setActiveTab('log'); setMessage(''); }}>Log Found</button>
                <button className={`lnf-tab ${activeTab === 'search' ? 'active' : ''}`} onClick={() => { setActiveTab('search'); setMessage(''); }}>Search</button>
            </div>

            <div className="lnf-content">
                {message && <div className="status-message">{message}</div>}

                {activeTab === 'notice' && (
                    <div className="notice-board-view" style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', color: 'white' }}>
                        <h2 style={{ textAlign: 'center', color: '#fbbf24', fontSize: '28px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', borderBottom: '2px solid #334155', paddingBottom: '10px' }}>
                            🚨 Digital Notice Board: Missing & Found Persons 🚨
                        </h2>
                        <div className="lnf-grid">
                            {items.filter(i => i.category === 'People (Lost Children/Elderly)' && (i.status === 'Searching' || i.status === 'Safe')).length === 0 ? (
                                <p style={{ textAlign: 'center', width: '100%', fontSize: '18px', color: '#94a3b8' }}>No persons currently reported lost or found.</p>
                            ) : (
                                items.filter(i => i.category === 'People (Lost Children/Elderly)' && (i.status === 'Searching' || i.status === 'Safe')).map(person => (
                                    <div key={person.id} className="notice-card" style={{ background: person.type === 'LOST' ? '#7f1d1d' : '#14532d', border: '2px solid', borderColor: person.type === 'LOST' ? '#ef4444' : '#22c55e', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        <div className="notice-header" style={{ padding: '15px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.4)', fontWeight: 'bold', fontSize: '20px' }}>
                                            {person.type === 'LOST' ? 'MISSING PERSON' : 'FOUND PERSON'}
                                        </div>
                                        {(person.itemImage || person.itemVideo) && (
                                            <div className="notice-media" style={{ width: '100%', height: '220px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {person.itemVideo ? (
                                                    <video src={person.itemVideo} controls autoPlay loop style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                                ) : (
                                                    <img src={person.itemImage} alt="Person" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                                )}
                                            </div>
                                        )}
                                        <div className="notice-body" style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', textAlign: 'center' }}>{person.itemName}</h3>
                                            
                                            {person.type === 'LOST' ? (
                                                <>
                                                    <p style={{ margin: 0 }}><strong>Last Seen:</strong> {person.lastSeenLocation || 'Unknown'}</p>
                                                    <p style={{ margin: 0 }}><strong>Date:</strong> {person.dateLost}</p>
                                                    <p style={{ margin: 0, color: '#fca5a5' }}><strong>Please Contact:</strong> {person.contactPhone} ({person.contactName})</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p style={{ margin: 0 }}><strong>Found At:</strong> {person.foundLocation || 'Unknown'}</p>
                                                    <p style={{ margin: 0 }}><strong>Date:</strong> {person.dateFound}</p>
                                                    <p style={{ margin: 0, color: '#86efac', fontSize: '18px', fontWeight: 'bold' }}><strong>Collect From:</strong> {person.depositedAt}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

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
                                        {isRecording && <div style={{position:'absolute', top: 10, right: 10, background: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', animation: 'pulse-water 1s infinite'}}>Recording...</div>}
                                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                    </div>
                                    <div className="camera-controls">
                                        <button type="button" className="action-btn switch-cam-btn" onClick={toggleCamera}>🔄 Switch</button>
                                        <button type="button" className="action-btn capture-btn" onClick={capturePhoto} disabled={isRecording}>📸 Capture</button>
                                        <button type="button" className="action-btn" style={{background:'#d97706', color:'white'}} onClick={startRecording} disabled={isRecording}>🎥 Record 5s Video</button>
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
                                            📷 Take Media
                                        </button>
                                    </div>

                                    {(reportData.itemImage || reportData.itemVideo) && (
                                        <div className="photo-preview-container">
                                            {reportData.itemVideo ? (
                                                <video src={reportData.itemVideo} controls autoPlay loop className="image-preview" style={{maxHeight:'200px'}} />
                                            ) : (
                                                <img src={reportData.itemImage} alt="Preview" className="image-preview" />
                                            )}
                                            <button type="button" className="retake-btn" onClick={() => setReportData(prev => ({ ...prev, itemImage: null, itemVideo: null }))}>Remove Media</button>
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
                                        {isRecording && <div style={{position:'absolute', top: 10, right: 10, background: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', animation: 'pulse-water 1s infinite'}}>Recording...</div>}
                                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                    </div>
                                    <div className="camera-controls">
                                        <button type="button" className="action-btn switch-cam-btn" onClick={toggleCamera}>🔄 Switch</button>
                                        <button type="button" className="action-btn capture-btn" onClick={capturePhoto} disabled={isRecording}>📸 Capture</button>
                                        <button type="button" className="action-btn" style={{background:'#d97706', color:'white'}} onClick={startRecording} disabled={isRecording}>🎥 Record 5s Video</button>
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
                                            📷 Take Media
                                        </button>
                                    </div>

                                    {(logData.itemImage || logData.itemVideo) && (
                                        <div className="photo-preview-container">
                                            {logData.itemVideo ? (
                                                <video src={logData.itemVideo} controls autoPlay loop className="image-preview" style={{maxHeight:'200px'}} />
                                            ) : (
                                                <img src={logData.itemImage} alt="Preview" className="image-preview" />
                                            )}
                                            <button type="button" className="retake-btn" onClick={() => setLogData(prev => ({ ...prev, itemImage: null, itemVideo: null }))}>Remove Media</button>
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
                                        {(item.itemImage || item.itemVideo) && (
                                            <div className="card-image-wrapper">
                                                {item.itemVideo ? (
                                                    <video src={item.itemVideo} controls autoPlay loop className="lnf-card-image" style={{maxHeight:'100%'}} />
                                                ) : (
                                                    <img src={item.itemImage} alt="Item" className="lnf-card-image" />
                                                )}
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
