const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4002;

app.use(cors());
app.use(express.json());

const mediaData = {
    '1': {
        audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg', // Ganges sound
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        summary: 'AI Generated: "Welcome to Har Ki Pauri... the spiritual heart of Haridwar."'
    },
    '2': {
        audioUrl: 'https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg', // Temple bell/chanting approximation
        videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
        summary: 'AI Generated: "Ascending the Bilwa Parvat, Mansa Devi blesses its visitors..."'
    },
    '3': {
        audioUrl: 'https://actions.google.com/sounds/v1/ambient/jungle_ambience.ogg', // Forest/mountain approximation
        videoUrl: 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
        summary: 'AI Generated: "Reigning from Neel Parvat, Chandi Devi serves as an ancient protector."'
    },
    '4': {
        audioUrl: 'https://actions.google.com/sounds/v1/crowds/large_crowd_talking_and_cheering.ogg', // Camp/crowd approximation
        videoUrl: 'https://test-videos.co.uk/vids/tears-of-steel/mp4/h264/360/Tears_of_Steel_360_10s_1MB.mp4',
        summary: 'AI Generated: "The vibrant life of the main camp... temporary home for millions seeking liberation."'
    },
    '5': {
        audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
        videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
        summary: 'AI Generated: "Triveni Ghat... the sacred confluence where the evening Aarti mesmerizes the soul."'
    },
    '6': {
        audioUrl: 'https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg',
        videoUrl: 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
        summary: 'AI Generated: "Parmarth Niketan stands tall, a beacon of spiritual solace on the banks of the Ganga."'
    },
    '7': {
        audioUrl: 'https://actions.google.com/sounds/v1/water/splash_and_bubble.ogg',
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        summary: 'AI Generated: "Devprayag Sangam... Behold the exact moment the Alaknanda and Bhagirathi unite to birth the holy Ganga."'
    },
    '8': {
        audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
        videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
        summary: 'AI Generated: "Subhash Ghat echoes with devotion and stories of freedom."'
    },
    '9': {
        audioUrl: 'https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg',
        videoUrl: 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
        summary: 'AI Generated: "Kushavarta Ghat... where penance meets the eternal flow of the Ganges."'
    },
    '10': {
        audioUrl: 'https://actions.google.com/sounds/v1/water/splash_and_bubble.ogg',
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        summary: 'AI Generated: "Gau Ghat offers salvation, washing away the sins of the past seeking ancestral peace."'
    },
    '11': {
        audioUrl: 'https://actions.google.com/sounds/v1/ambient/jungle_ambience.ogg',
        videoUrl: 'https://test-videos.co.uk/vids/tears-of-steel/mp4/h264/360/Tears_of_Steel_360_10s_1MB.mp4',
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
