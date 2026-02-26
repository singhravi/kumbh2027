const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4002;

app.use(cors());
app.use(express.json());

const mediaData = {
    '1': {
        audioUrl: 'https://cdn.freesound.org/previews/416/416179_5121236-lq.mp3', // Ganges sound
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Welcome to Har Ki Pauri... the spiritual heart of Haridwar."'
    },
    '2': {
        audioUrl: 'https://cdn.freesound.org/previews/320/320655_527080-lq.mp3', // Temple bell/chanting approximation
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Ascending the Bilwa Parvat, Mansa Devi blesses its visitors..."'
    },
    '3': {
        audioUrl: 'https://cdn.freesound.org/previews/515/515822_10816999-lq.mp3', // Forest/mountain approximation
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Reigning from Neel Parvat, Chandi Devi serves as an ancient protector."'
    },
    '4': {
        audioUrl: 'https://cdn.freesound.org/previews/416/416179_5121236-lq.mp3', // Camp/crowd approximation
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "The vibrant life of the main camp... temporary home for millions seeking liberation."'
    },
    '5': {
        audioUrl: 'https://cdn.freesound.org/previews/416/416179_5121236-lq.mp3',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Triveni Ghat... the sacred confluence where the evening Aarti mesmerizes the soul."'
    },
    '6': {
        audioUrl: 'https://cdn.freesound.org/previews/320/320655_527080-lq.mp3',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Parmarth Niketan stands tall, a beacon of spiritual solace on the banks of the Ganga."'
    },
    '7': {
        audioUrl: 'https://cdn.freesound.org/previews/416/416179_5121236-lq.mp3',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Devprayag Sangam... Behold the exact moment the Alaknanda and Bhagirathi unite to birth the holy Ganga."'
    },
    '8': {
        audioUrl: 'https://cdn.freesound.org/previews/416/416179_5121236-lq.mp3',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Subhash Ghat echoes with devotion and stories of freedom."'
    },
    '9': {
        audioUrl: 'https://cdn.freesound.org/previews/320/320655_527080-lq.mp3',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Kushavarta Ghat... where penance meets the eternal flow of the Ganges."'
    },
    '10': {
        audioUrl: 'https://cdn.freesound.org/previews/416/416179_5121236-lq.mp3',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Gau Ghat offers salvation, washing away the sins of the past seeking ancestral peace."'
    },
    '11': {
        audioUrl: 'https://cdn.freesound.org/previews/515/515822_10816999-lq.mp3',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        summary: 'AI Generated: "Vishnu Ghat stands as one of the purest steps leading to Moksha."'
    }
};

app.get('/api/media/:placeId', (req, res) => {
    const { placeId } = req.params;
    const data = mediaData[placeId] || {
        audioUrl: null, videoUrl: null, summary: 'No immersive media found for this place.'
    };
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`AI Media service running on port ${PORT}`);
});
