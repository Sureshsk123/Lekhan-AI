import Lesson from '../models/Lesson.js';
import Story from '../models/Story.js';
import ShopItem from '../models/ShopItem.js';
import Achievement from '../models/Achievement.js';

export const achievementsCatalog = [
    { achievementId: 'first_lesson', name: 'First Steps', icon: '🌱', description: 'Complete your first lesson', xpReward: 100, diamondReward: 10 },
    { achievementId: 'quiz_master', name: 'Quiz Master', icon: '🎓', description: 'Get a perfect score on 5 quizzes', xpReward: 500, diamondReward: 50 },
    { achievementId: 'streak_7', name: 'Week Warrior', icon: '🔥', description: 'Maintain a 7-day streak', xpReward: 200, diamondReward: 20 },
    { achievementId: 'writing_expert', name: 'Calligraphy King', icon: '✍️', description: 'Get 90+ score in 3 writing exercises', xpReward: 300, diamondReward: 30 },
    { achievementId: 'polyglot', name: 'Polyglot', icon: '🌍', description: 'Enrolled in 3 or more languages', xpReward: 400, diamondReward: 40 }
];

export const rewardsCatalog = [
    { itemId: 'theme_dark', name: 'Dark Theme', category: 'themes', price: 200, emoji: '🌙', description: 'Sleek dark mode for night learners' },
    { itemId: 'theme_space', name: 'Space Theme', category: 'themes', price: 300, emoji: '🚀', description: 'Intergalactic learning experience' },
    { itemId: 'theme_nature', name: 'Nature Theme', category: 'themes', price: 250, emoji: '🌿', description: 'Calming forest aesthetic' },
    { itemId: 'theme_anime', name: 'Anime Theme', category: 'themes', price: 350, emoji: '🎭', description: 'Vibrant manga-style UI' },
    { itemId: 'theme_culture', name: 'Traditional Theme', category: 'themes', price: 300, emoji: '🛕', description: 'Traditional cultural patterns' },
    { itemId: 'emoji_pack_1', name: 'Tamil Sticker Pack', category: 'stickers', price: 50, emoji: '🎭', description: 'Standard language stickers' },
    { itemId: 'avatar_premium_1', name: 'Dragon Master', category: 'avatars', price: 500, emoji: '🐲', description: 'Elite dragon avatar' },
    { itemId: 'frame_gold', name: 'Gold Frame', category: 'frames', price: 400, emoji: '🖼️', description: 'Golden border for your profile' },
    { itemId: 'title_pro', name: 'Language Pro', category: 'titles', price: 150, emoji: '🎗️', description: 'Exclusive profile title' }
];

export const defaultStories = [
    {
        customId: 's1',
        language: 'tamil',
        category: 'short',
        title: 'புத்திசாலிக் காகம் (Clever Crow)',
        content: 'ஒரு தாகமுள்ள காகம் ஒரு ஜாடியில் கல்லைப் போட்டுத் தண்ணீரை உயர்த்தித் தாகத்தைத் தீர்த்துக்கொண்டது.',
        translation: 'A thirsty crow dropped stones into a jar to raise the water level and quenched its thirst.',
        readCount: 0
    },
    {
        customId: 's2',
        language: 'hindi',
        category: 'short',
        title: 'चतुर कौआ (Clever Crow)',
        content: 'एक प्यासे कौवे ने घड़े में कंकड़ डाले और पानी पीकर अपनी प्यास बुझाई।',
        translation: 'A thirsty crow dropped pebbles into a pot and quenched its thirst by drinking water.',
        readCount: 0
    },
    {
        customId: 's3',
        language: 'telugu',
        category: 'short',
        title: 'తెలివైన కాకి (Clever Crow)',
        content: 'ఒక దాహం వేసిన కాకి గొట్టంలో రాళ్లను వేసి నీటి స్థాయిని పెంచి తన దాహాన్ని తీర్చుకుంది.',
        translation: 'A thirsty crow dropped stones into a tube to raise the water level and quenched its thirst.',
        readCount: 0
    },
    {
        customId: 's4',
        language: 'malayalam',
        category: 'short',
        title: 'ബുദ്ധിമാനായ കാക്ക (Clever Crow)',
        content: 'ഒരു ദാഹിച്ച കാക്ക ഒരു ഭരണയിൽ കല്ലുകൾ ഇട്ട് വെള്ളം പൊക്കി കുടിച്ച് ദാഹം തീർത്തു.',
        translation: 'A thirsty crow dropped stones into a jar to raise the water and quenched its thirst.',
        readCount: 0
    }
];

export const alphabetData = {
    tamil: {
        vowels: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'],
        consonants: ['க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்', 'த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்'],
        nouns: [
            { w: 'அம்மா', m: 'Mother' }, { w: 'அப்பா', m: 'Father' }, { w: 'மரம்', m: 'Tree' }, { w: 'வீடு', m: 'House' },
            { w: 'பள்ளி', m: 'School' }, { w: 'பழம்', m: 'Fruit' }, { w: 'வானம்', m: 'Sky' }, { w: 'மலை', m: 'Mountain' }
        ],
        verbs: [
            { v: 'நட', e: 'Walk' }, { v: 'ஓடு', e: 'Run' }, { v: 'படி', e: 'Read' }, { v: 'எழுது', e: 'Write' }
        ],
        templates: [
            { s: 'இது ஒரு {n}.', m: 'This is a {e}.' },
            { s: 'எனக்கு {n} பிடிக்கும்.', m: 'I like {e}.' }
        ]
    },
    hindi: {
        vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
        consonants: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'],
        nouns: [
            { w: 'माँ', m: 'Mother' }, { w: 'पिता', m: 'Father' }, { w: 'पेड़', m: 'Tree' }, { w: 'घर', m: 'House' }
        ],
        verbs: [
            { v: 'चलना', e: 'Walk' }, { v: 'दौड़ना', e: 'Run' }, { v: 'पढ़ना', e: 'Read' }
        ],
        templates: [
            { s: 'यह एक {n} है।', m: 'This is a {e}.' },
            { s: 'मुझे {n} पसंद है।', m: 'I like {e}.' }
        ]
    },
    telugu: {
        vowels: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ'],
        consonants: ['క', 'ఖ', 'గ', 'ఘ', 'చ', 'ఛ', 'జ', 'ఝ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ'],
        nouns: [{ w: 'అమ్మ', m: 'Mother' }, { w: 'నాన్న', m: 'Father' }, { w: 'చెట్టు', m: 'Tree' }, { w: 'ఇల్లు', m: 'House' }],
        verbs: [{ v: 'నడవడం', e: 'Walk' }, { v: 'పరుగెత్తడం', e: 'Run' }],
        templates: [{ s: 'ఇది ఒక {n}.', m: 'This is a {e}.' }]
    },
    kannada: {
        vowels: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ'],
        consonants: ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ'],
        nouns: [{ w: 'ಅಮ್ಮ', m: 'Mother' }, { w: 'ಅಪ್ಪ', m: 'Father' }, { w: 'ಮರ', m: 'Tree' }, { w: 'ಮನೆ', m: 'House' }],
        verbs: [{ v: 'ನಡೆಯುವುದು', e: 'Walk' }],
        templates: [{ s: 'ಇದು ಒಂದು {n}.', m: 'This is a {e}.' }]
    },
    malayalam: {
        vowels: ['അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'],
        consonants: ['ക', 'ഖ', 'ഗ', 'ഘ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ', 'ത', 'ഥ', 'ദ', 'ധ', 'ന', 'പ', 'ഫ', 'ബ', 'ഭ', 'മ', 'യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ'],
        nouns: [{ w: 'അമ്മ', m: 'Mother' }, { w: 'അച്ഛൻ', m: 'Father' }, { w: 'മരം', m: 'Tree' }, { w: 'വീട്', m: 'House' }],
        verbs: [{ v: 'നടക്കുക', e: 'Walk' }],
        templates: [{ s: 'ഇതൊരു {n} ആണ്.', m: 'This is a {e}.' }]
    },
    english: {
        vowels: ['A', 'E', 'I', 'O', 'U'],
        consonants: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
        nouns: [{ w: 'Mother', m: 'Mother' }, { w: 'Father', m: 'Father' }, { w: 'Tree', m: 'Tree' }, { w: 'House', m: 'House' }],
        verbs: [{ v: 'walk', e: 'walk' }],
        templates: [{ s: 'This is a {n}.', m: 'This is a {n}.' }]
    }
};

export const generateInitialLessons = () => {
    const allLessons = [];
    Object.keys(alphabetData).forEach(lang => {
        const data = alphabetData[lang];
        let counter = 1;

        if (lang === 'english') {
            ['A', 'B', 'C', 'D', 'E', 'F'].forEach(char => {
                allLessons.push({
                    customId: `l-${lang}-${counter}`,
                    language: lang,
                    level: 'alphabets',
                    lessonNumber: counter++,
                    title: `English Alphabet: ${char}`,
                    description: `Learn the letter '${char}' of the English alphabet.`,
                    content: {
                        reading: { text: char, translation: `Letter ${char}` },
                        writing: [{ character: char }],
                        speaking: [{ phrase: char }]
                    },
                    vocabulary: [{ word: char, translation: `Letter ${char}` }],
                    xpReward: 40,
                    diamondReward: 5
                });
            });
        } else {
            allLessons.push({
                customId: `l-${lang}-${counter}`,
                language: lang,
                level: 'alphabets',
                lessonNumber: counter++,
                title: `${lang.toUpperCase()} Alphabet: Mastering the Basics`,
                description: `A complete overview of the ${lang.toUpperCase()} script.`,
                content: { reading: { text: "Welcome to your first step!", translation: "Welcome" } },
                vocabulary: [{ word: "Welcome", translation: "Welcome" }],
                xpReward: 100,
                diamondReward: 20
            });
        }

        data.vowels.slice(0, 5).forEach((char) => {
            allLessons.push({
                customId: `l-${lang}-${counter}`,
                language: lang,
                level: 'vowels',
                lessonNumber: counter++,
                title: `${lang.toUpperCase()} Vowel: ${char}`,
                description: `Learn the shape and pronunciation of '${char}'`,
                content: { reading: { text: char, translation: char }, writing: [{ character: char }], speaking: [{ phrase: char }] },
                vocabulary: [{ word: char, translation: char }],
                xpReward: 50,
                diamondReward: 5
            });
        });

        data.consonants.slice(0, 5).forEach((char) => {
            allLessons.push({
                customId: `l-${lang}-${counter}`,
                language: lang,
                level: 'consonants',
                lessonNumber: counter++,
                title: `${lang.toUpperCase()} Consonant: ${char}`,
                description: `Master the basic consonant '${char}'`,
                content: { reading: { text: char, translation: char }, writing: [{ character: char }], speaking: [{ phrase: char }] },
                vocabulary: [{ word: char, translation: char }],
                xpReward: 60,
                diamondReward: 8
            });
        });

        data.nouns.slice(0, 5).forEach((base, idx) => {
            allLessons.push({
                customId: `l-${lang}-${counter}`,
                language: lang,
                level: 'words',
                lessonNumber: counter++,
                title: `${lang.toUpperCase()} Vocabulary: ${base.w}`,
                description: `Learn the word '${base.m}'`,
                content: { reading: { text: base.w, translation: base.m } },
                vocabulary: [{ word: base.w, translation: base.m }],
                xpReward: 80,
                diamondReward: 10
            });
        });
    });
    return allLessons;
};

export const seedDatabase = async () => {
    try {
        const achievementCount = await Achievement.countDocuments();
        if (achievementCount === 0) {
            await Achievement.insertMany(achievementsCatalog);
            console.log('✅ Seeded Achievements into MongoDB');
        }

        const shopItemCount = await ShopItem.countDocuments();
        if (shopItemCount === 0) {
            await ShopItem.insertMany(rewardsCatalog);
            console.log('✅ Seeded Shop Items into MongoDB');
        }

        const storyCount = await Story.countDocuments();
        if (storyCount === 0) {
            await Story.insertMany(defaultStories);
            console.log('✅ Seeded Stories into MongoDB');
        }

        const lessonCount = await Lesson.countDocuments();
        if (lessonCount === 0) {
            const lessonsToSeed = generateInitialLessons();
            await Lesson.insertMany(lessonsToSeed);
            console.log(`✅ Seeded ${lessonsToSeed.length} Lessons into MongoDB`);
        }
    } catch (error) {
        console.error('❌ Database Seeding Error:', error.message);
    }
};
