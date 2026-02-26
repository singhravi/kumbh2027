import React, { useEffect, useState } from 'react';
import VirtualDip from './VirtualDip';

export default function InfoModal({ place, onClose }) {
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVirtualDipActive, setIsVirtualDipActive] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:4000/media/${place.id}`)
            .then(res => res.json())
            .then(data => {
                setMedia(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [place.id]);

    if (!place) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2 className="modal-title">{place.name}</h2>
                <span className="badge">{place.type}</span>

                <p className="modal-desc">{place.description}</p>

                <div className="status-badges" style={{ display: 'flex', gap: '10px', marginTop: '10px', marginBottom: '15px' }}>
                    {place.crowdLevel && (
                        <span className="badge crowd-badge" style={{
                            backgroundColor: place.crowdLevel === 'Low' ? '#10b981' : place.crowdLevel === 'Moderate' ? '#f59e0b' : '#ef4444',
                            color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', border: 'none'
                        }}>
                            👥 Crowd: {place.crowdLevel}
                        </span>
                    )}
                    {place.trafficCondition && (
                        <span className="badge traffic-badge" style={{
                            backgroundColor: place.trafficCondition === 'Clear' ? '#10b981' : place.trafficCondition === 'Moderate' ? '#f59e0b' : '#ef4444',
                            color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', border: 'none'
                        }}>
                            🚗 Traffic: {place.trafficCondition}
                        </span>
                    )}
                </div>

                {place.trafficCondition === 'Heavy' && place.alternateRouteMap && (
                    <div className="alternate-route" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px' }}>
                        <strong style={{ color: '#856404', display: 'block', marginBottom: '5px' }}>⚠️ Heavy Traffic Alert</strong>
                        <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#856404' }}>Consider using this alternate route to avoid delays.</p>
                        {place.alternateRouteMap.includes('google.com/maps/embed') ? (
                            <iframe
                                src={place.alternateRouteMap}
                                width="100%"
                                height="200"
                                style={{ border: 0, borderRadius: '6px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Alternate route for ${place.name}`}>
                            </iframe>
                        ) : (
                            <img src={place.alternateRouteMap} alt={`Alternate Route for ${place.name}`} style={{ width: '100%', borderRadius: '6px' }} />
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="loading">Loading Immersive AI Experience...</div>
                ) : isVirtualDipActive ? (
                    <VirtualDip onComplete={() => setIsVirtualDipActive(false)} />
                ) : media ? (
                    <div className="media-section">
                        <div className="ai-summary">
                            <strong>AI Summary:</strong> {media.summary}
                        </div>

                        {['Har Ki Pauri', 'Triveni Ghat (Rishikesh)', 'Devprayag Sangam', 'Subhash Ghat', 'Kushavarta Ghat', 'Gau Ghat', 'Vishnu Ghat'].includes(place.name) && (
                            <button
                                className="take-dip-btn"
                                onClick={() => setIsVirtualDipActive(true)}
                            >
                                🌊 Take Immersive Virtual Dip
                            </button>
                        )}

                        {media.videoUrl && (
                            <div className="video-container">
                                <video controls style={{ width: '100%', borderRadius: '8px' }}>
                                    <source src={media.videoUrl} type="video/mp4" />
                                    Your browser does not support HTML video.
                                </video>
                            </div>
                        )}

                        {media.audioUrl && (
                            <div className="audio-container">
                                <audio controls style={{ width: '100%' }}>
                                    <source src={media.audioUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No extra information available.</p>
                )}
            </div>
        </div>
    );
}
