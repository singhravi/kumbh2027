const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4001;

app.use(cors());
app.use(express.json());

const haridwarPlaces = [
    {
        id: '1',
        name: 'Har Ki Pauri',
        type: 'Ghat',
        coordinates: [29.9538, 78.1717],
        description: 'The most famous ghat on the banks of the Ganges. Central to the Kumbh Mela rituals and the famous Ganga Aarti.'
    },
    {
        id: '2',
        name: 'Mansa Devi Temple',
        type: 'Temple',
        coordinates: [29.9515, 78.1633],
        description: 'A popular religious temple situated atop the Bilwa Parvat. Provides panoramic views of Haridwar.'
    },
    {
        id: '3',
        name: 'Chandi Devi Temple',
        type: 'Temple',
        coordinates: [29.9304, 78.1818],
        description: 'A major pilgrimage site situated atop the Neel Parvat, widely visited during the Kumbh.'
    },
    {
        id: '4',
        name: 'Kumbh Main Camp (Astha Path)',
        type: 'Camp',
        coordinates: [29.9400, 78.1680],
        description: 'Temporary extensive camper settlement for thousands of visiting Akharas and pilgrims during the 2027 Kumbh Mela.'
    },
    {
        id: '5',
        name: 'Triveni Ghat (Rishikesh)',
        type: 'Ghat',
        coordinates: [30.1062, 78.2977],
        description: 'The confluence of the Ganges, Yamuna, and Saraswati rivers in Rishikesh. Famous for the evening Maha Aarti and ritual dips.'
    },
    {
        id: '6',
        name: 'Parmarth Niketan (Rishikesh)',
        type: 'Ashram/Ghat',
        coordinates: [30.1197, 78.3129],
        description: 'One of the largest ashrams in Rishikesh. Thousands flock here for spiritual retreats and the mesmerizing Ganga Aarti on its ghat.'
    },
    {
        id: '7',
        name: 'Devprayag Sangam',
        type: 'Confluence',
        coordinates: [30.1458, 78.5997],
        description: 'The sacred confluence where the Alaknanda and Bhagirathi rivers meet to officially form the holy river Ganga. Highly revered for ablutions.'
    },
    {
        id: '8',
        name: 'Subhash Ghat',
        type: 'Ghat',
        coordinates: [29.9535, 78.1715],
        description: 'Adjacent to Har Ki Pauri, this lively ghat is known for its statue of Netaji Subhash Chandra Bose and continuous flow of pilgrims performing rituals.'
    },
    {
        id: '9',
        name: 'Kushavarta Ghat',
        type: 'Ghat',
        coordinates: [29.9525, 78.1705],
        description: 'A historic ghat where the great sage Dattatreya is believed to have performed penance. It is considered highly auspicious for performing Shraddha rites.'
    },
    {
        id: '10',
        name: 'Gau Ghat',
        type: 'Ghat',
        coordinates: [29.9515, 78.1695],
        description: 'Situated south of Subhash Ghat, Gau Ghat is specifically sought for seeking pardon for the sin of cow slaughter and offering peace to ancestral souls.'
    },
    {
        id: '11',
        name: 'Vishnu Ghat',
        type: 'Ghat',
        coordinates: [29.9505, 78.1685],
        description: 'Named after Lord Vishnu, this ghat is considered one among the most sacred and pristine bathing ghats in Haridwar.'
    }
];

app.get('/api/places', (req, res) => {
    res.json(haridwarPlaces);
});

app.listen(PORT, () => {
    console.log(`Places service running on port ${PORT}`);
});
