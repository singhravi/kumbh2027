import React, { useState } from 'react';
import './MedicalAssistance.css';

export default function MedicalAssistance() {
    const [activeTab, setActiveTab] = useState('emergency'); // 'emergency', 'hospitals', 'firstaid'

    const emergencyContacts = [
        { name: 'Kumbh Control Room (Toll Free)', number: '1920', icon: '🚨' },
        { name: 'Ambulance Services', number: '108', icon: '🚑' },
        { name: 'Police Help', number: '112', icon: '🚓' },
        { name: 'Women Helpline', number: '1090', icon: '👩' },
        { name: 'Disaster Management', number: '1070', icon: '⚠️' },
        { name: 'Lost Child Helpline', number: '1098', icon: '👶' }
    ];

    const hospitals = [
        {
            zone: 'Har Ki Pauri & Core Zone',
            camps: [
                { name: 'Sector 1 Base Camp Hospital', type: 'Temporary Hospital (100 beds)', coords: '29.9548° N, 78.1724° E', phone: '01334-222XXX' },
                { name: 'Mela Bhawan Dispensary', type: 'First Aid & Pharmacy', coords: 'Near Mela Control Room', phone: '01334-223XXX' }
            ]
        },
        {
            zone: 'Kankhal & Daksh Prajapati',
            camps: [
                { name: 'Kankhal Zonal Hospital', type: 'Primary Care (50 beds)', coords: '29.9320° N, 78.1560° E', phone: '01334-231XXX' },
                { name: 'Ramakrishna Mission Hospital', type: 'Multi-Specialty (Permanent)', coords: 'Kankhal Main Road', phone: '01334-241XXX' }
            ]
        },
        {
            zone: 'Bairagi Camp & Surrounding',
            camps: [
                { name: 'Bairagi Base Hospital', type: 'Trauma & Emergency (150 beds)', coords: '29.9200° N, 78.1400° E', phone: '01334-255XXX' },
                { name: 'Mobile Medical Van Base', type: 'Quick Response Fleet', coords: 'Sector 4 Parking', phone: '108' }
            ]
        }
    ];

    const firstAidTips = [
        {
            title: 'Stampede / Crowd Crush',
            icon: '🚶',
            steps: [
                'Do not fight the crowd. Keep your hands up by your chest like a boxer to protect your ribs.',
                'Stay on your feet at all costs. If you drop something, leave it.',
                'Move diagonally across the crowd flow to slowly make your way to the edges.',
                'If you fall, curl into a ball to protect your head and organs.'
            ]
        },
        {
            title: 'Water Emergencies (Drowning)',
            icon: '🌊',
            steps: [
                'Shout for help immediately. Identify the nearest Jal Police or SDRF responder.',
                'Throw a rope, flotation ring, or long pole if you are on the shore. Do NOT jump in if you are not a trained rescuer.',
                'Once the person is out, check for breathing. If they are not breathing, begin CPR immediately.',
                'Keep the person warm and wait for the ambulance.'
            ]
        },
        {
            title: 'Heat Exhaustion / Dehydration',
            icon: '☀️',
            steps: [
                'Move the person to a cool, shaded place immediately.',
                'Provide small, frequent sips of water or ORS (Oral Rehydration Solution).',
                'Loosen tight clothing and apply cool, wet cloths to the neck, face, and arms.',
                'If they begin vomiting or losing consciousness, call 108 for an ambulance as this may be heatstroke.'
            ]
        },
        {
            title: 'Minor Cuts & Scrapes',
            icon: '🩹',
            steps: [
                'Wash your hands, then gently wash the wound with clean water.',
                'Apply gentle pressure with a clean cloth to stop any bleeding.',
                'Apply an antibiotic ointment and cover with a sterile bandage.',
                'Visit the nearest First Aid booth if the cut is deep or shows signs of infection.'
            ]
        }
    ];

    return (
        <div className="medical-container">
            <div className="medical-header">
                <h2>Medical & Emergency Support</h2>
                <p>Kumbh Mela 2027 Rapid Response System</p>
            </div>

            <div className="medical-nav">
                <button
                    className={`nav-btn ${activeTab === 'emergency' ? 'active-red' : ''}`}
                    onClick={() => setActiveTab('emergency')}
                >
                    🚨 SOS Contacts
                </button>
                <button
                    className={`nav-btn ${activeTab === 'hospitals' ? 'active-blue' : ''}`}
                    onClick={() => setActiveTab('hospitals')}
                >
                    🏥 Hospitals & Camps
                </button>
                <button
                    className={`nav-btn ${activeTab === 'firstaid' ? 'active-green' : ''}`}
                    onClick={() => setActiveTab('firstaid')}
                >
                    🩹 First Aid Guide
                </button>
            </div>

            <div className="medical-content">
                {/* EMERGENCY CONTACTS TAB */}
                {activeTab === 'emergency' && (
                    <div className="emergency-grid">
                        <div className="sos-banner">
                            <h3>IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, DIAL 108 IMMEDIATELY.</h3>
                        </div>
                        <div className="contacts-container">
                            {emergencyContacts.map((contact, index) => (
                                <a href={`tel:${contact.number}`} className="contact-card" key={index}>
                                    <div className="contact-icon">{contact.icon}</div>
                                    <div className="contact-info">
                                        <h4>{contact.name}</h4>
                                        <span className="contact-number">{contact.number}</span>
                                    </div>
                                    <div className="call-action">📞 Call</div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* HOSPITALS & CAMPS TAB */}
                {activeTab === 'hospitals' && (
                    <div className="hospitals-view">
                        <p className="tab-description">Locate the nearest medical facility based on your current Mela zone.</p>

                        {hospitals.map((zoneData, idx) => (
                            <div key={idx} className="zone-cluster">
                                <h3 className="zone-title">📍 {zoneData.zone}</h3>
                                <div className="camps-grid">
                                    {zoneData.camps.map((camp, cIdx) => (
                                        <div key={cIdx} className="camp-card">
                                            <h4>{camp.name}</h4>
                                            <span className="camp-type">{camp.type}</span>
                                            <div className="camp-details">
                                                <p><strong>Location:</strong> {camp.coords}</p>
                                                <p><strong>Contact:</strong> <a href={`tel:${camp.phone}`}>{camp.phone}</a></p>
                                            </div>
                                            <button className="navigate-btn">🗺️ Navigate Here</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FIRST AID TAB */}
                {activeTab === 'firstaid' && (
                    <div className="firstaid-view">
                        <p className="tab-description">Quick reference guides for common emergencies. Note: This does not replace professional medical advice.</p>

                        <div className="tips-grid">
                            {firstAidTips.map((tip, idx) => (
                                <div key={idx} className="tip-card">
                                    <div className="tip-header">
                                        <span className="tip-icon">{tip.icon}</span>
                                        <h3>{tip.title}</h3>
                                    </div>
                                    <ul className="tip-steps">
                                        {tip.steps.map((step, sIdx) => (
                                            <li key={sIdx}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
