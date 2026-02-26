import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import './VirtualDip.css';

export default function VirtualDip({ onComplete }) {
    const webcamRef = useRef(null);
    const audioRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [dipState, setDipState] = useState('capture'); // 'capture', 'walking', 'dipping', 'emerging', 'done'
    const [gender, setGender] = useState('male'); // 'male', 'female'

    useEffect(() => {
        // Pre-load voices to ensure they are available when charting
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
    }, []);

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
            // Chant loudly
            if ('speechSynthesis' in window) {
                const chant = new SpeechSynthesisUtterance("Har Har Gangay!");
                chant.volume = 1.0; // Loudly

                // Adjusting rate and pitch for a natural, robust North Indian Hindi chanting tone
                chant.rate = 0.75; // Slower, more deliberate chant pace

                if (gender === 'male') {
                    // Deep, resonant tone but without extreme pitch distortion
                    chant.pitch = 0.85;
                } else {
                    // Clear, bright tone
                    chant.pitch = 1.1;
                }

                const voices = window.speechSynthesis.getVoices();
                const hiVoices = voices.filter(v => v.lang.startsWith('hi'));

                console.log("Available Hindi Voices:", hiVoices);

                if (hiVoices.length > 0) {
                    let selectedVoice = null;
                    const isMale = gender === 'male';

                    // 1. Try explicit 'male' / 'female' in the name
                    selectedVoice = hiVoices.find(v =>
                        isMale ? v.name.toLowerCase().includes('male') : v.name.toLowerCase().includes('female')
                    );

                    // 2. Fallbacks for macOS/iOS (Rishi = Male, Lekha = Female)
                    if (!selectedVoice) {
                        if (isMale) {
                            selectedVoice = hiVoices.find(v => v.name.includes('Rishi') || v.name.includes('Hemant') || v.name.includes('Madhur'));
                        } else {
                            selectedVoice = hiVoices.find(v => v.name.includes('Lekha') || v.name.includes('Kalpana') || v.name.includes('Swara'));
                        }
                    }

                    // 3. Last fallback: try to find Google's generic voices
                    if (!selectedVoice) {
                        // Some engines just return 'Google हिन्दी'
                        const genericVoices = hiVoices.filter(v => v.name.includes('Google') || v.name.includes('Microsoft'));
                        if (genericVoices.length > 1) {
                            // Guessing: usually Voice 0 is female, Voice 1 might be male. Adjust accordingly.
                            selectedVoice = isMale ? genericVoices[1] : genericVoices[0];
                        }
                    }

                    chant.voice = selectedVoice || hiVoices[0];
                    console.log("Selected Voice:", chant.voice?.name || "Default");
                }

                chant.lang = "hi-IN"; // Hindi voice if available
                window.speechSynthesis.speak(chant);
            }

            setTimeout(() => setDipState('emerging'), 3000); // Dip for 3s
        } else if (dipState === 'emerging') {
            setTimeout(() => setDipState('done'), 2000); // Emerge and show blessing
        }
    }, [dipState, gender]);

    return (
        <div className="virtual-dip-container">
            {dipState === 'capture' && (
                <div className="capture-screen">
                    <h3>Take a picture for the Virtual Dip</h3>
                    <div className="gender-selection" style={{ marginBottom: '15px' }}>
                        <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                value="male"
                                checked={gender === 'male'}
                                onChange={(e) => setGender(e.target.value)}
                            /> Male
                        </label>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                                type="radio"
                                value="female"
                                checked={gender === 'female'}
                                onChange={(e) => setGender(e.target.value)}
                            /> Female
                        </label>
                    </div>
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

                    <audio ref={audioRef} src="https://cdn.freesound.org/previews/416/416179_5121236-lq.mp3" />

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
