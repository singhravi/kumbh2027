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
