import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import './VirtualDip.css';

export default function VirtualDip({ onComplete }) {
    const webcamRef = useRef(null);
    const audioRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [dipState, setDipState] = useState('capture'); // 'capture', 'walking', 'dipping', 'emerging', 'done'

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setDipState('walking');
    }, [webcamRef, setImgSrc]);

    useEffect(() => {
        if (dipState === 'walking') {
            setTimeout(() => setDipState('dipping'), 2500); // Walk for 2.5s
        } else if (dipState === 'dipping') {
            if (audioRef.current) {
                audioRef.current.play(); // Play splash
            }
            setTimeout(() => setDipState('emerging'), 3000); // Dip for 3s
        } else if (dipState === 'emerging') {
            setTimeout(() => setDipState('done'), 2000); // Emerge and show blessing
        }
    }, [dipState]);

    return (
        <div className="virtual-dip-container">
            {dipState === 'capture' && (
                <div className="capture-screen">
                    <h3>Take a picture for the Virtual Dip</h3>
                    <div className="webcam-wrapper">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{ facingMode: "user" }}
                        />
                    </div>
                    <button className="capture-btn" onClick={capture}>Capture Picture</button>
                </div>
            )}

            {dipState !== 'capture' && (
                <div className="dip-simulation-screen">
                    <video
                        className="background-river-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        {/* Using a placeholder river video */}
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    </video>

                    <audio ref={audioRef} src="https://actions.google.com/sounds/v1/water/splash_and_bubble.ogg" />

                    {/* User's captured face */}
                    <div className={`user-avatar ${dipState}`}>
                        <img src={imgSrc} alt="Pilgrim" />
                    </div>

                    {/* Water overlay for immersion */}
                    <div className={`water-overlay ${dipState}`}></div>

                    {dipState === 'done' && (
                        <div className="blessing-message">
                            <h2>Dip Completed Successfully!</h2>
                            <p>May Mother Ganga wash away your sins and grant you peace and prosperity.</p>
                            <button className="finish-btn" onClick={onComplete}>Return to Map</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
