import React, { useState, useRef, useEffect } from 'react';
import './WorkerRegistration.css';

export default function WorkerRegistration() {
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        aadhaarNumber: '',
        agencyName: '',
        assignedZone: '',
        supervisorName: '',
        bloodGroup: '',
        emergencyContact: '',
    });

    const [registeredWorker, setRegisteredWorker] = useState(null);
    const [message, setMessage] = useState('');
    const [photoDataUrl, setPhotoDataUrl] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const printRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const zones = [
        'Zone A - Har Ki Pauri',
        'Zone B - Kankhal',
        'Zone C - Chandi Ghat',
        'Zone D - Bairagi Camp',
        'Zone E - Bhupatwala',
        'Zone F - Rishikesh'
    ];

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

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

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        return () => {
            stopCamera(); // Cleanup camera on unmount
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.mobileNumber || !formData.aadhaarNumber || !formData.assignedZone) {
            setMessage('Please fill in Name, Mobile, Aadhaar, and Zone fields.');
            return;
        }

        if (!photoDataUrl) {
            setMessage('Please capture a photo for the worker pass.');
            return;
        }

        if (formData.aadhaarNumber.length !== 12) {
            setMessage('Aadhaar Number must be 12 digits.');
            return;
        }

        const workerId = 'SW-' + Math.floor(100000 + Math.random() * 900000);

        setRegisteredWorker({
            ...formData,
            workerId,
            photoUrl: photoDataUrl,
            issueDate: new Date().toLocaleDateString(),
            validUntil: '30/05/2027' // Post Kumbh valid date
        });

        setMessage('Worker registered successfully! Pass generated below.');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleReset = () => {
        setRegisteredWorker(null);
        setPhotoDataUrl(null);
        setFormData({
            fullName: '', mobileNumber: '', aadhaarNumber: '', agencyName: '', assignedZone: '', supervisorName: '', bloodGroup: '', emergencyContact: ''
        });
        setMessage('');
    };

    return (
        <div className="worker-reg-container">
            <div className="worker-header">
                <h2>Sanitary Worker Registration Portal</h2>
                <p>Mela Adhikari Office - Swachh Kumbh Abhiyan 2027</p>
            </div>

            <div className="worker-content">
                <div className="form-panel no-print">
                    <h3>Register New Worker</h3>
                    {message && <div className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}

                    <div className="camera-section">
                        <h4>Worker Photo Capture *</h4>
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
                                    <img src={photoDataUrl} alt="Captured Worker Preview" className="photo-preview" />
                                    <button className="retake-btn" onClick={() => { setPhotoDataUrl(null); startCamera(); }}>Retake Photo</button>
                                </div>
                            )}
                            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="worker-form">
                        <div className="form-row">
                            <div className="form-group half">
                                <label>Full Name *</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="As per Aadhaar" required />
                            </div>
                            <div className="form-group half">
                                <label>Mobile Number *</label>
                                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="10 digit number" maxLength="10" required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Aadhaar Number *</label>
                                <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} placeholder="12 digit number" maxLength="12" required />
                            </div>
                            <div className="form-group half">
                                <label>Blood Group</label>
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
                                    <option value="">-- Select --</option>
                                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Contractor/Agency Name</label>
                                <input type="text" name="agencyName" value={formData.agencyName} onChange={handleInputChange} placeholder="E.g., Swachh Services Pvt Ltd" />
                            </div>
                            <div className="form-group half">
                                <label>Assigned Kumbh Zone *</label>
                                <select name="assignedZone" value={formData.assignedZone} onChange={handleInputChange} required>
                                    <option value="">-- Select Zone --</option>
                                    {zones.map(z => <option key={z} value={z}>{z}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Zone Supervisor Name</label>
                                <input type="text" name="supervisorName" value={formData.supervisorName} onChange={handleInputChange} />
                            </div>
                            <div className="form-group half">
                                <label>Emergency Contact</label>
                                <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Family/Supervisor Mobile" />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">Generate Worker Pass</button>
                    </form>
                </div>

                {registeredWorker && (
                    <div className="pass-panel">
                        <div className="pass-actions no-print">
                            <h3>Generated ID Pass</h3>
                            <div className="btn-group">
                                <button onClick={handlePrint} className="btn-secondary">🖨️ Print Pass</button>
                                <button onClick={handleReset} className="btn-outline">Register Another</button>
                            </div>
                        </div>

                        <div className="id-card-wrapper" ref={printRef}>
                            <div className="id-card">
                                <div className="id-header">
                                    <div className="logos">
                                        <span className="logo-placeholder">🕉️</span>
                                        <h3>KUMBH MELA 2027<br /><span>Haridwar Administration</span></h3>
                                    </div>
                                    <div className="id-title">SANITARY WORKER PASS</div>
                                </div>

                                <div className="id-body">
                                    <div className="photo-section">
                                        <div className="photo-box captured">
                                            <img src={registeredWorker.photoUrl} alt="Worker" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="worker-id-badge">ID: {registeredWorker.workerId}</div>
                                        <div className="qr-code">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=Kumbh2027-ID:${registeredWorker.workerId}%0AName:${registeredWorker.fullName}%0AAadhaar:${registeredWorker.aadhaarNumber}%0AMobile:${registeredWorker.mobileNumber}`}
                                                alt="Worker QR Code"
                                                style={{ width: '90px', height: '90px', marginTop: '10px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="details-section">
                                        <h2 className="worker-name">{registeredWorker.fullName}</h2>
                                        <table className="details-table">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Assigned Zone:</strong></td>
                                                    <td className="highlight-zone">{registeredWorker.assignedZone}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Agency:</strong></td>
                                                    <td>{registeredWorker.agencyName || 'Direct Hire'}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Aadhaar:</strong></td>
                                                    <td>XXXX-XXXX-{registeredWorker.aadhaarNumber.slice(-4)}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Blood Group:</strong></td>
                                                    <td className="blood-group">{registeredWorker.bloodGroup || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Mobile:</strong></td>
                                                    <td>+91 {registeredWorker.mobileNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Emergency:</strong></td>
                                                    <td>{registeredWorker.emergencyContact || 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="id-footer">
                                    <div className="validity">
                                        <p>Issue Date: {registeredWorker.issueDate}</p>
                                        <p>Valid Until: {registeredWorker.validUntil}</p>
                                    </div>
                                    <div className="signature">
                                        <div className="sig-line"></div>
                                        <p>Mela Adhikari</p>
                                    </div>
                                </div>
                                <div className="id-warning">
                                    This card is non-transferable and must be displayed at all times while on duty. <br />If found, return to nearest Mela Police Station.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
