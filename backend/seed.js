import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from './models/Lesson.js';
import Story from './models/Story.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/langsphere');
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};// --- DUOLINGO STYLE CURRICULUM REPOSITORY ---

const languages = ['tamil', 'hindi', 'telugu', 'kannada', 'malayalam', 'english'];

const generateBulkLessons = () => {
    const allLessons = [];

    languages.forEach(lang => {
        // Beginner Level - Unit 1: Foundations
        const unit1Topics = [
            { title: `${lang.toUpperCase()} Alphabet`, desc: 'Introduction to characters', type: 'reading' },
            { title: 'Vowels', desc: 'Core vowel sounds', type: 'reading' },
            { title: 'Consonants', desc: 'Core consonant sounds', type: 'reading' },
            { title: 'Pronunciation', desc: 'Basic speaking practice', type: 'speaking' },
            { title: 'Greetings', desc: 'Hello, Goodbye, Thank you', type: 'vocabulary' },
            { title: 'Numbers', desc: '1 to 10', type: 'vocabulary' },
            { title: 'Family', desc: 'Mother, Father, etc.', type: 'vocabulary' },
            { title: 'Colors', desc: 'Red, Blue, Green', type: 'vocabulary' },
            { title: 'Animals', desc: 'Dog, Cat, Bird', type: 'vocabulary' },
            { title: 'Unit 1 Quiz', desc: 'Test your knowledge', type: 'quiz' }
        ];

        unit1Topics.forEach((topic, index) => {
            allLessons.push({
                language: lang,
                level: 'beginner',
                unit: 1,
                lessonNumber: index + 1,
                title: topic.title,
                description: topic.desc,
                content: {
                    reading: { text: `Learn about ${topic.title}`, translation: '' },
                    writing: [{ character: 'A' }],
                    speaking: [{ phrase: `Say ${topic.title}` }]
                },
                topics: [{
                    title: topic.title,
                    introduction: topic.desc,
                    quiz: topic.type === 'quiz' ? [{ question: 'What did you learn?', options: ['A', 'B'], correctAnswer: 'A' }] : []
                }],
                xpReward: topic.type === 'quiz' ? 100 : 50,
                diamondReward: topic.type === 'quiz' ? 20 : 5
            });
        });

        // Beginner Level - Unit 2: Daily Life
        const unit2Topics = [
            { title: 'Food & Drinks', desc: 'Water, Rice, Bread', type: 'vocabulary' },
            { title: 'Common Verbs', desc: 'Eat, Drink, Sleep', type: 'vocabulary' },
            { title: 'Body Parts', desc: 'Head, Hands, Eyes', type: 'vocabulary' },
            { title: 'Time & Days', desc: 'Morning, Monday, Today', type: 'vocabulary' },
            { title: 'Weather', desc: 'Sun, Rain, Cold', type: 'vocabulary' },
            { title: 'Simple Sentences', desc: 'Subject + Verb', type: 'reading' },
            { title: 'Questions', desc: 'What, Why, Where', type: 'speaking' },
            { title: 'Directions', desc: 'Left, Right, Straight', type: 'vocabulary' },
            { title: 'Emotions', desc: 'Happy, Sad, Angry', type: 'vocabulary' },
            { title: 'Unit 2 Quiz', desc: 'Test your knowledge', type: 'quiz' }
        ];

        unit2Topics.forEach((topic, index) => {
            allLessons.push({
                language: lang,
                level: 'beginner',
                unit: 2,
                lessonNumber: index + 1, // Restarts at 1 for the new unit
                title: topic.title,
                description: topic.desc,
                content: {
                    reading: { text: `Learn about ${topic.title}`, translation: '' },
                    speaking: [{ phrase: `Practice ${topic.title}` }]
                },
                topics: [{
                    title: topic.title,
                    introduction: topic.desc,
                    quiz: topic.type === 'quiz' ? [{ question: 'Translate this', options: ['A', 'B'], correctAnswer: 'A' }] : []
                }],
                xpReward: topic.type === 'quiz' ? 120 : 60,
                diamondReward: topic.type === 'quiz' ? 25 : 10
            });
        });
        
        // Intermediate Level - Unit 1 (Example for progression)
        allLessons.push({
            language: lang,
            level: 'intermediate',
            unit: 1,
            lessonNumber: 1,
            title: 'Past Tense Basics',
            description: 'Learn how to talk about the past',
            content: { reading: { text: 'Yesterday, I walked', translation: '' } },
            xpReward: 80,
            diamondReward: 15
        });
    });

    return allLessons;
};

const storiesData = {
    tamil: [
        { title: 'தமிழர் திருநாள் (Pongal)', category: 'festival', content: 'தைப்பிறந்தால் வழி பிறக்கும்...', emoji: '🎉', difficulty: 'easy' },
        { title: 'புத்திசாலிக் காகம் (Clever Crow)', category: 'short', content: 'ஒரு தாகமுள்ள காகம்...', emoji: '🐦', difficulty: 'easy' },
        { title: 'உத்தம விவசாயி (Honest Farmer)', category: 'moral', content: 'ஒரு ஏழை விவசாயி...', emoji: '🌾', difficulty: 'medium' }
    ],
    hindi: [
        { title: 'दीपावली (Diwali)', category: 'festival', content: 'दिवाली दीपों का त्योहार है...', emoji: '🪔', difficulty: 'easy' },
        { title: 'चतुर कौआ (Clever Crow)', category: 'short', content: 'एक प्यासा कौआ...', emoji: '🐦', difficulty: 'easy' },
        { title: 'ईमानदार लकड़हारा (Honest Woodsman)', category: 'moral', content: 'एक गरीब लकड़हारा...', emoji: '🪓', difficulty: 'medium' }
    ],
    telugu: [
        { title: 'సంక్రాంతి (Sankranti)', category: 'festival', content: 'సంక్రాంతి పెద్ద పండుగ...', emoji: '🪁', difficulty: 'easy' },
        { title: 'తెలివైన కాకి (Clever Crow)', category: 'short', content: 'ఒక దాహం వేసిన కాకి...', emoji: '🐦', difficulty: 'easy' },
        { title: 'మర్యాద రామన్న (Maryada Ramanna)', category: 'moral', content: 'Maryada Ramanna stories...', emoji: '⚖️', difficulty: 'medium' }
    ],
    kannada: [
        { title: 'ದಸರಾ (Dasara)', category: 'festival', content: 'ಮೈಸೂರು ದಸರಾ ವಿಶ್ವಪ್ರಸಿದ್ಧ...', emoji: '🐘', difficulty: 'easy' },
        { title: 'ಜಾಣ ಕಾಗೆ (Clever Crow)', category: 'short', content: 'ಒಂದು ಬಾಯಾರಿದ ಕಾಗೆ...', emoji: '🐦', difficulty: 'easy' },
        { title: 'ತೆನಾಲಿ ರಾಮ (Tenali Rama)', category: 'moral', content: 'Tenali Rama stories...', emoji: '🎭', difficulty: 'medium' }
    ],
    malayalam: [
        { title: 'ഓണം (Onam)', category: 'festival', content: 'കേരളീയരുടെ പ്രിയപ്പെട്ട ആഘോഷമാണ് ഓണം...', emoji: '🌸', difficulty: 'easy' },
        { title: 'ബുദ്ധിമാനായ കാക്ക (Clever Crow)', category: 'short', content: 'ഒരു ദാഹിച്ച കാക്ക...', emoji: '🐦', difficulty: 'easy' },
        { title: 'മാവേലി ചരിതം (Maveli)', category: 'epic', content: 'മഹാബലി ചക്രവർത്തിയുടെ കഥ...', emoji: '👑', difficulty: 'medium' }
    ],
    english: [
        { title: 'The Honest Woodcutter', category: 'moral', content: 'Once there was a poor woodcutter...', emoji: '🪓', difficulty: 'easy' },
        { title: 'The Golden Touch', category: 'epic', content: 'King Midas wished for a golden touch...', emoji: '👑', difficulty: 'medium' },
        { title: 'The Clever Fox', category: 'short', content: 'A hungry fox sees a piece of cheese...', emoji: '🦊', difficulty: 'easy' }
    ]
};

const seedDatabase = async () => {
    try {
        await connectDB();
        await Lesson.deleteMany({});
        await Story.deleteMany({});
        console.log("🧹 Database cleared.");

        const lessons = generateBulkLessons();
        console.log(`🚀 Injecting ${lessons.length} Massive Neural Lessons...`);

        // Chunked insertion to prevent hanging large payloads
        const chunkSize = 200;
        for (let i = 0; i < lessons.length; i += chunkSize) {
            const chunk = lessons.slice(i, i + chunkSize);
            await Lesson.insertMany(chunk);
            console.log(`✅ Progress: ${i + chunk.length}/${lessons.length}`);
        }

        const stories = [];
        Object.keys(storiesData).forEach(lang => {
            storiesData[lang].forEach(s => {
                stories.push({
                    language: lang,
                    ...s,
                    translation: `English translation for ${s.title}`,
                    readCount: 0
                });
            });
        });

        console.log(`📖 Injecting ${stories.length} Cultural Masterpieces...`);
        await Story.insertMany(stories);

        console.log('✨ Mission Complete! Languages context fully restored.');
        process.exit(0);
    } catch (e) {
        console.error('🔥 Seeding Error:', e);
        process.exit(1);
    }
};

seedDatabase();
