import React, { useState } from 'react';
import './LaserShow.css';

export default function LaserShow() {
    const [selectedMonth, setSelectedMonth] = useState('January');

    const scheduleData = [
        {
            date: 'Jan 14, 2027',
            month: 'January',
            theme: 'Makar Sankranti Special: Samudra Manthan',
            description: 'The epic churning of the ocean of milk by Devas and Asuras to obtain Amrita (nectar of immortality). A spectacular visual journey of the 14 Ratnas emerging from the sea.',
            time: '6:30 PM - 10:00 PM',
            featured: true
        },
        {
            date: 'Jan 26, 2027',
            month: 'January',
            theme: 'Tales of Lord Shiva: The Descent of Ganga',
            description: 'The story of Bhagiratha\'s penance and Lord Shiva catching the mighty river Ganga in his matted hair to prevent the destruction of Earth.',
            time: '6:30 PM - 10:00 PM',
            featured: false
        },
        {
            date: 'Feb 11, 2027',
            month: 'February',
            theme: 'Vasant Panchami: Goddess Saraswati',
            description: 'Celebrating the arrival of spring with the manifestation of Saraswati, the goddess of knowledge, music, arts, wisdom, and learning.',
            time: '6:30 PM - 10:00 PM',
            featured: true
        },
        {
            date: 'Feb 25, 2027',
            month: 'February',
            theme: 'Dashavatara: The Ten Avatars of Vishnu',
            description: 'A mesmerizing sequence showing Lord Vishnu descending into the world across different yugas to restore cosmic order (Dharma).',
            time: '6:30 PM - 10:00 PM',
            featured: false
        },
        {
            date: 'Mar 08, 2027',
            month: 'March',
            theme: 'Maha Shivaratri: The Dance of Nataraja',
            description: 'High-energy laser choreography depicting the Ananda Tandava (Dance of Bliss) performed by Lord Shiva, symbolizing the cosmic cycles of creation and destruction.',
            time: '6:30 PM - 10:00 PM',
            featured: true
        },
        {
            date: 'Mar 24, 2027',
            month: 'March',
            theme: 'Holi Special: Radha Krishna Raas Leela',
            description: 'A vibrant, colorful laser display celebrating the divine love of Radha and Krishna and the joyous festival of colors in Vrindavan.',
            time: '6:30 PM - 10:00 PM',
            featured: true
        },
        {
            date: 'Apr 04, 2027',
            month: 'April',
            theme: 'Chaitra Navratri: The Nine Forms of Durga',
            description: 'Honoring the emergence of Goddess Durga and her nine majestic forms (Navadurga) to defeat the buffalo demon Mahishasura.',
            time: '6:30 PM - 10:00 PM',
            featured: false
        },
        {
            date: 'Apr 14, 2027',
            month: 'April',
            theme: 'Baisakhi & Maha Kumbh Finale: The Eternal Kumbh',
            description: 'The grand finale showcasing the origin of the Kumbh Mela, the flight of Garuda with the nectar pitcher, and the blessing of the holy rivers.',
            time: '6:30 PM - 10:00 PM',
            featured: true
        }
    ];

    const filteredSchedule = scheduleData.filter(item => item.month === selectedMonth);

    return (
        <div className="laser-show-container">
            <div className="laser-header">
                <h2>Kumbh Mela 2027 Laser Show Extravaganza</h2>
                <p className="laser-subtitle">A divine visual journey across Hindu Mythology (Jan 14 - Apr 14)</p>
                <div className="laser-info-pill">
                    <span>🕒 Daily Timing: 6:30 PM - 10:00 PM</span>
                </div>
            </div>

            <div className="laser-controls">
                <div className="month-tabs">
                    {['January', 'February', 'March', 'April'].map(month => (
                        <button
                            key={month}
                            className={`month-tab ${selectedMonth === month ? 'active' : ''}`}
                            onClick={() => setSelectedMonth(month)}
                        >
                            {month} 2027
                        </button>
                    ))}
                </div>
            </div>

            <div className="laser-schedule-grid">
                {filteredSchedule.map((event, index) => (
                    <div key={index} className={`laser-card ${event.featured ? 'featured' : ''}`}>
                        {event.featured && <div className="featured-badge">Special Event</div>}
                        <div className="card-date">{event.date}</div>
                        <h3 className="card-theme">{event.theme}</h3>
                        <p className="card-time">Time: {event.time}</p>
                        <p className="card-desc">{event.description}</p>
                    </div>
                ))}
                {filteredSchedule.length === 0 && (
                    <div className="no-events">No major themed events listed for this month. Regular shows continue daily.</div>
                )}
            </div>

            <div className="laser-footer-note">
                <p>* Note: Regular 30-minute light and sound shows loop daily from 6:30 PM to 10:00 PM. The schedule above highlights special thematic presentations.</p>
            </div>
        </div>
    );
}
