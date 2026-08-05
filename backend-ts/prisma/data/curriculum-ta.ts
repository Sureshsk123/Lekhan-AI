export const TA_CURRICULUM = {
  beginner: [
    {
      moduleTitle: 'வாழ்த்துகள் (Greetings)',
      topics: [
        {
          topicTitle: 'அடிப்படை வாழ்த்துகள் (Basic Greetings)',
          lessons: [
            {
              title: 'வணக்கம் சொல்வது', type: 'VOCABULARY', xpReward: 15,
              content: 'தமிழில் அடிப்படை வாழ்த்துகளை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'வணக்கம்', transliteration: 'Vanakkam', meaning: 'Hello / Greetings', example: 'வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?' },
                { word: 'நன்றி', transliteration: 'Nandri', meaning: 'Thank you', example: 'உங்கள் உதவிக்கு நன்றி.' },
                { word: 'மன்னிக்கவும்', transliteration: 'Mannikkavum', meaning: 'Sorry / Excuse me', example: 'மன்னிக்கவும், நான் தாமதமாக வந்தேன்.' },
                { word: 'சரி', transliteration: 'Sari', meaning: 'OK / Alright', example: 'சரி, நாளை பார்க்கலாம்.' },
              ]}}],
              quizQuestions: [
                { text: 'தமிழில் "Hello" என்றால் என்ன?', answers: [{ text: 'வணக்கம்', isCorrect: true }, { text: 'நன்றி', isCorrect: false }, { text: 'சரி', isCorrect: false }, { text: 'மன்னிக்கவும்', isCorrect: false }] },
                { text: '"நன்றி" என்றால் என்ன?', answers: [{ text: 'Thank you', isCorrect: true }, { text: 'Hello', isCorrect: false }, { text: 'Sorry', isCorrect: false }, { text: 'OK', isCorrect: false }] },
              ]
            },
            {
              title: 'என்னை அறிமுகப்படுத்துவது', type: 'SPEAKING', xpReward: 15,
              content: 'தமிழில் உங்களை அறிமுகப்படுத்துவதை கற்கவும்.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'என் பெயர்', transliteration: 'En peyar', meaning: 'My name', example: 'என் பெயர் அர்ஜுன்.' },
                  { word: 'நான்', transliteration: 'Naan', meaning: 'I / Me', example: 'நான் மாணவன்.' },
                  { word: 'எங்கிருந்து', transliteration: 'Engirundhu', meaning: 'From where', example: 'நான் சென்னையிலிருந்து வருகிறேன்.' },
                ]}},
                { type: 'EXAMPLES', content: { sentences: ['வணக்கம்! என் பெயர் பிரியா. நான் கோவையிலிருந்து வருகிறேன்.', 'நான் ஒரு மாணவி. எனக்கு தமிழ் மிகவும் பிடிக்கும்.'] }}
              ],
              quizQuestions: [
                { text: '"நான்" என்றால் என்ன?', answers: [{ text: 'I / Me', isCorrect: true }, { text: 'He', isCorrect: false }, { text: 'She', isCorrect: false }, { text: 'We', isCorrect: false }] },
              ]
            },
            {
              title: 'கேள்விகள் கேட்பது', type: 'GRAMMAR', xpReward: 15,
              content: 'தமிழில் அடிப்படை கேள்விகளை கற்கவும்.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'தமிழில் கேள்விகளுக்கு "ஆ?" அல்லது "எங்கே / என்ன / யார்" சேர்க்கப்படும்.', examples: ['நீங்கள் எங்கே போகிறீர்கள்?', 'இது என்ன?', 'அவர் யார்?'] }},
              ],
              quizQuestions: [
                { text: '"Where" என்பதை தமிழில் என்ன?', answers: [{ text: 'எங்கே', isCorrect: true }, { text: 'என்ன', isCorrect: false }, { text: 'யார்', isCorrect: false }, { text: 'எப்போது', isCorrect: false }] },
              ]
            },
            {
              title: 'விடைபெறுவது', type: 'SPEAKING', xpReward: 15,
              content: 'தமிழில் நட்புடன் விடைபெறும் வழக்கங்களை கற்கவும்.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'போய் வருகிறேன்', transliteration: 'Poi varukireen', meaning: 'Goodbye (I am leaving)', example: 'போய் வருகிறேன், நாளை பார்க்கலாம்.' },
                  { word: 'சீக்கிரம் வாருங்கள்', transliteration: 'Seekiram varungal', meaning: 'Come soon', example: 'சீக்கிரம் வாருங்கள், காத்திருக்கிறேன்.' },
                ]}},
              ],
              quizQuestions: [
                { text: '"Goodbye (formal)" என்று தமிழில் எப்படி சொல்வீர்கள்?', answers: [{ text: 'போய் வருகிறேன்', isCorrect: true }, { text: 'வணக்கம்', isCorrect: false }, { text: 'நன்றி', isCorrect: false }, { text: 'சரி', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'எண்கள் மற்றும் நிறங்கள்',
          lessons: [
            {
              title: 'தமிழ் எண்கள் 1–10', type: 'VOCABULARY', xpReward: 15,
              content: 'தமிழில் 1 முதல் 10 வரை எண்களை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ஒன்று', transliteration: 'Ondru', meaning: 'One (1)', example: 'ஒன்று மேசை.' },
                { word: 'இரண்டு', transliteration: 'Irandu', meaning: 'Two (2)', example: 'இரண்டு புத்தகங்கள்.' },
                { word: 'ஐந்து', transliteration: 'Aindhu', meaning: 'Five (5)', example: 'ஐந்து மாணவர்கள்.' },
                { word: 'பத்து', transliteration: 'Pathu', meaning: 'Ten (10)', example: 'பத்து மாடிகள்.' },
              ]}}],
              quizQuestions: [
                { text: '"இரண்டு" என்றால் என்ன?', answers: [{ text: 'Two', isCorrect: true }, { text: 'One', isCorrect: false }, { text: 'Five', isCorrect: false }, { text: 'Ten', isCorrect: false }] },
              ]
            },
            {
              title: 'நிறங்களை சொல்வது', type: 'VOCABULARY', xpReward: 15,
              content: 'தமிழில் அடிப்படை நிறங்களை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'சிவப்பு', transliteration: 'Sivappu', meaning: 'Red', example: 'சிவப்பு ரோஜா.' },
                { word: 'நீலம்', transliteration: 'Neelam', meaning: 'Blue', example: 'நீல வானம்.' },
                { word: 'பச்சை', transliteration: 'Pachai', meaning: 'Green', example: 'பச்சை இலை.' },
                { word: 'வெள்ளை', transliteration: 'Vellai', meaning: 'White', example: 'வெள்ளை சட்டை.' },
              ]}}],
              quizQuestions: [
                { text: '"Red" என்பதை தமிழில் என்ன?', answers: [{ text: 'சிவப்பு', isCorrect: true }, { text: 'நீலம்', isCorrect: false }, { text: 'பச்சை', isCorrect: false }, { text: 'வெள்ளை', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'அன்றாட வாழ்க்கை (Daily Life)',
      topics: [
        {
          topicTitle: 'உணவு (Food)',
          lessons: [
            {
              title: 'தமிழ் உணவுகள்', type: 'VOCABULARY', xpReward: 15,
              content: 'பொதுவான தமிழ் உணவு பெயர்களை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'இட்லி', transliteration: 'Idli', meaning: 'Steamed rice cake', example: 'காலையில் இட்லி சாப்பிடுகிறேன்.' },
                { word: 'தோசை', transliteration: 'Dosai', meaning: 'Rice crepe', example: 'தோசை மிகவும் சுவையாக இருக்கும்.' },
                { word: 'சாம்பார்', transliteration: 'Sambhar', meaning: 'Lentil vegetable stew', example: 'இட்லியுடன் சாம்பார் சாப்பிடுவேன்.' },
                { word: 'பொங்கல்', transliteration: 'Pongal', meaning: 'Rice and lentil dish', example: 'பொங்கல் திருவிழாவில் செய்வோம்.' },
              ]}}],
              quizQuestions: [
                { text: 'இட்லி எதனால் செய்யப்படுகிறது?', answers: [{ text: 'அரிசி மற்றும் உளுந்து', isCorrect: true }, { text: 'கோதுமை', isCorrect: false }, { text: 'சோளம்', isCorrect: false }, { text: 'ரவை மட்டும்', isCorrect: false }] },
              ]
            },
            {
              title: 'சமையலறையில் உரையாடல்', type: 'SPEAKING', xpReward: 20,
              content: 'உணவு தொடர்பான உரையாடல்களை கற்கவும்.',
              exercises: [
                { type: 'CONVERSATION', content: { lines: [
                  { speaker: 'அம்மா', text: 'என்ன சாப்பிட வேண்டும்?' },
                  { speaker: 'மகன்', text: 'இட்லி மற்றும் சாம்பார் வேண்டும்.' },
                  { speaker: 'அம்மா', text: 'சரி, இப்போது செய்கிறேன்.' },
                ]}},
              ],
              quizQuestions: [
                { text: '"என்ன சாப்பிட வேண்டும்?" என்பதன் பொருள் என்ன?', answers: [{ text: 'What do you want to eat?', isCorrect: true }, { text: 'Where is the food?', isCorrect: false }, { text: 'When did you eat?', isCorrect: false }, { text: 'Who cooked?', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'பள்ளி மற்றும் படிப்பு',
          lessons: [
            {
              title: 'பள்ளி சொற்கள்', type: 'VOCABULARY', xpReward: 15,
              content: 'பள்ளி தொடர்பான முக்கியமான வார்த்தைகளை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ஆசிரியர்', transliteration: 'Aasiriyar', meaning: 'Teacher', example: 'ஆசிரியர் மிகவும் நல்லவர்.' },
                { word: 'மாணவன்', transliteration: 'Maanavan', meaning: 'Student (male)', example: 'அவன் ஒரு நல்ல மாணவன்.' },
                { word: 'புத்தகம்', transliteration: 'Puthagam', meaning: 'Book', example: 'நான் புத்தகம் படிக்கிறேன்.' },
                { word: 'வகுப்பறை', transliteration: 'Vakupparai', meaning: 'Classroom', example: 'வகுப்பறை சுத்தமாக இருக்கிறது.' },
              ]}}],
              quizQuestions: [
                { text: '"ஆசிரியர்" என்றால் என்ன?', answers: [{ text: 'Teacher', isCorrect: true }, { text: 'Student', isCorrect: false }, { text: 'Book', isCorrect: false }, { text: 'School', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'குடும்பம் மற்றும் உறவினர் (Family)',
      topics: [
        {
          topicTitle: 'குடும்ப உறுப்பினர்கள்',
          lessons: [
            {
              title: 'குடும்ப சொற்கள்', type: 'VOCABULARY', xpReward: 15,
              content: 'தமிழில் குடும்ப உறவினரின் பெயர்களை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'அம்மா', transliteration: 'Amma', meaning: 'Mother', example: 'என் அம்மா மிகவும் அன்பானவர்.' },
                { word: 'அப்பா', transliteration: 'Appa', meaning: 'Father', example: 'என் அப்பா மருத்துவர்.' },
                { word: 'அண்ணன்', transliteration: 'Annan', meaning: 'Elder brother', example: 'என் அண்ணன் கல்லூரியில் படிக்கிறார்.' },
                { word: 'அக்கா', transliteration: 'Akka', meaning: 'Elder sister', example: 'என் அக்கா ஆசிரியை.' },
                { word: 'தம்பி', transliteration: 'Thambi', meaning: 'Younger brother', example: 'என் தம்பி 5வது படிக்கிறான்.' },
                { word: 'தாத்தா', transliteration: 'Thatha', meaning: 'Grandfather', example: 'தாத்தா கதை சொல்கிறார்.' },
              ]}}],
              quizQuestions: [
                { text: '"Amma" என்றால் என்ன?', answers: [{ text: 'Mother', isCorrect: true }, { text: 'Father', isCorrect: false }, { text: 'Sister', isCorrect: false }, { text: 'Brother', isCorrect: false }] },
                { text: '"அண்ணன்" என்றால் என்ன?', answers: [{ text: 'Elder brother', isCorrect: true }, { text: 'Younger brother', isCorrect: false }, { text: 'Elder sister', isCorrect: false }, { text: 'Father', isCorrect: false }] },
              ]
            },
            {
              title: 'குடும்பத்தைப் பற்றி பேசுவது', type: 'SPEAKING', xpReward: 20,
              content: 'உங்கள் குடும்பத்தைப் பற்றி தமிழில் அறிமுகப்படுத்துவதை கற்கவும்.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['என் குடும்பத்தில் நான்கு பேர் இருக்கிறோம்.', 'என் அம்மாவுக்கு சமைப்பது மிகவும் பிடிக்கும்.', 'என் அப்பா தினமும் அலுவலகம் செல்கிறார்.'] }}
              ],
              quizQuestions: [
                { text: '"My family has four people" — தமிழில் எப்படி?', answers: [{ text: 'என் குடும்பத்தில் நான்கு பேர் இருக்கிறோம்', isCorrect: true }, { text: 'என் குடும்பம் மிகவும் பெரியது', isCorrect: false }, { text: 'நாங்கள் சென்னையில் வாழ்கிறோம்', isCorrect: false }, { text: 'என் அம்மா நல்லவர்', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'இடங்களும் திசைகளும் (Places & Directions)',
      topics: [
        {
          topicTitle: 'ஊர் மற்றும் கட்டிடங்கள்',
          lessons: [
            {
              title: 'இடங்களின் பெயர்கள்', type: 'VOCABULARY', xpReward: 20,
              content: 'தமிழில் பொதுவான இடங்களின் பெயர்களை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'கடை', transliteration: 'Kadai', meaning: 'Shop / Store', example: 'நான் கடைக்கு போகிறேன்.' },
                { word: 'மருத்துவமனை', transliteration: 'Maruthuvamani', meaning: 'Hospital', example: 'மருத்துவமனை அடுத்த தெருவில் இருக்கிறது.' },
                { word: 'பேரூந்து நிலையம்', transliteration: 'Perundu Nilayam', meaning: 'Bus stand', example: 'பேரூந்து நிலையம் எங்கே இருக்கிறது?' },
                { word: 'பூங்கா', transliteration: 'Pungka', meaning: 'Park / Garden', example: 'குழந்தைகள் பூங்காவில் விளையாடுகிறார்கள்.' },
              ]}}],
              quizQuestions: [
                { text: '"கடை" என்றால் என்ன?', answers: [{ text: 'Shop', isCorrect: true }, { text: 'Hospital', isCorrect: false }, { text: 'Park', isCorrect: false }, { text: 'School', isCorrect: false }] },
              ]
            },
            {
              title: 'திசைகள் சொல்வது', type: 'VOCABULARY', xpReward: 20,
              content: 'தமிழில் திசைகளை சொல்வதை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'கிழக்கு', transliteration: 'Kizhakku', meaning: 'East', example: 'சூரியன் கிழக்கில் உதிக்கும்.' },
                { word: 'மேற்கு', transliteration: 'Meerku', meaning: 'West', example: 'சூரியன் மேற்கில் மறையும்.' },
                { word: 'வலது', transliteration: 'Valathu', meaning: 'Right', example: 'வலது திருப்பம் எடுங்கள்.' },
                { word: 'இடது', transliteration: 'Idathu', meaning: 'Left', example: 'இடது பக்கம் போங்கள்.' },
              ]}}],
              quizQuestions: [
                { text: '"East" என்பதை தமிழில் என்ன?', answers: [{ text: 'கிழக்கு', isCorrect: true }, { text: 'மேற்கு', isCorrect: false }, { text: 'வலது', isCorrect: false }, { text: 'இடது', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'நேரம் மற்றும் வானிலை (Time & Weather)',
      topics: [
        {
          topicTitle: 'நேரம் சொல்வது',
          lessons: [
            {
              title: 'காலம் மற்றும் நேரம்', type: 'VOCABULARY', xpReward: 20,
              content: 'தமிழில் நேரத்தை சொல்வதை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'காலை', transliteration: 'Kaalai', meaning: 'Morning', example: 'காலை 6 மணிக்கு எழுந்திருக்கிறேன்.' },
                { word: 'மாலை', transliteration: 'Maalai', meaning: 'Evening', example: 'மாலை 5 மணிக்கு வீட்டிற்கு வருவேன்.' },
                { word: 'இரவு', transliteration: 'Iravu', meaning: 'Night', example: 'இரவு 10 மணிக்கு தூங்குவேன்.' },
                { word: 'நடுப்பகல்', transliteration: 'Nadupakal', meaning: 'Noon / Midday', example: 'நடுப்பகலில் சாப்பிடுவேன்.' },
              ]}}],
              quizQuestions: [
                { text: '"Morning" என்பதை தமிழில் என்ன?', answers: [{ text: 'காலை', isCorrect: true }, { text: 'மாலை', isCorrect: false }, { text: 'இரவு', isCorrect: false }, { text: 'நடுப்பகல்', isCorrect: false }] },
              ]
            },
            {
              title: 'வானிலை வார்த்தைகள்', type: 'VOCABULARY', xpReward: 20,
              content: 'தமிழில் வானிலையைப் பற்றி பேசுவதை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'மழை', transliteration: 'Mazhai', meaning: 'Rain', example: 'இன்று மழை பெய்கிறது.' },
                { word: 'வெயில்', transliteration: 'Veyil', meaning: 'Sunshine / Heat', example: 'வெயில் மிகவும் கடுமையாக இருக்கிறது.' },
                { word: 'காற்று', transliteration: 'Kaatru', meaning: 'Wind', example: 'நல்ல காற்று வீசுகிறது.' },
                { word: 'குளிர்', transliteration: 'Kulir', meaning: 'Cold', example: 'இன்று மிகவும் குளிராக இருக்கிறது.' },
              ]}}],
              quizQuestions: [
                { text: '"Rain" என்பதை தமிழில் என்ன?', answers: [{ text: 'மழை', isCorrect: true }, { text: 'வெயில்', isCorrect: false }, { text: 'காற்று', isCorrect: false }, { text: 'குளிர்', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  intermediate: [
    {
      moduleTitle: 'தமிழ் இலக்கணம் (Grammar)',
      topics: [
        {
          topicTitle: 'வினைச்சொற்கள் (Verbs)',
          lessons: [
            {
              title: 'எளிய வினைகள்', type: 'GRAMMAR', xpReward: 25,
              content: 'தமிழ் வினைகளின் அடிப்படை வடிவங்களை கற்கவும்.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'தமிழ் வினைகள் காலம் மற்றும் பால் அடிப்படையில் மாறுகின்றன.', examples: ['நான் படிக்கிறேன் (I am studying)', 'அவன் ஓடுகிறான் (He is running)', 'அவள் பேசுகிறாள் (She is talking)'] }},
              ],
              quizQuestions: [
                { text: '"நான் படிக்கிறேன்" என்பதன் பொருள்?', answers: [{ text: 'I am studying', isCorrect: true }, { text: 'I studied', isCorrect: false }, { text: 'I will study', isCorrect: false }, { text: 'He is studying', isCorrect: false }] },
              ]
            },
            {
              title: 'கடந்த காலம் (Past Tense)', type: 'GRAMMAR', xpReward: 25,
              content: 'தமிழில் கடந்த காலம் பற்றி கற்கவும்.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'தமிழில் கடந்த காலத்தில் வினைகள் "-த்தேன் / -ந்தேன்" என்று முடியும்.', examples: ['நான் சாப்பிட்டேன் (I ate)', 'அவள் பாடினாள் (She sang)', 'நாங்கள் விளையாடினோம் (We played)'] }},
              ],
              quizQuestions: [
                { text: '"நான் சாப்பிட்டேன்" என்பதன் பொருள்?', answers: [{ text: 'I ate', isCorrect: true }, { text: 'I am eating', isCorrect: false }, { text: 'I will eat', isCorrect: false }, { text: 'She ate', isCorrect: false }] },
              ]
            },
            {
              title: 'எதிர்கால வினைகள்', type: 'GRAMMAR', xpReward: 25,
              content: 'தமிழில் எதிர்கால வினைகளை கற்கவும்.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'எதிர்காலத்தில் வினைகள் "-வேன் / -வாள்" என்று முடியும்.', examples: ['நான் வருவேன் (I will come)', 'அவன் படிப்பான் (He will study)', 'அவள் பேசுவாள் (She will speak)'] }},
              ],
              quizQuestions: [
                { text: '"நான் வருவேன்" என்பதன் பொருள்?', answers: [{ text: 'I will come', isCorrect: true }, { text: 'I came', isCorrect: false }, { text: 'I am coming', isCorrect: false }, { text: 'She will come', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'திருவிழாக்கள் (Festivals)',
          lessons: [
            {
              title: 'பொங்கல் திருவிழா', type: 'READING', xpReward: 25,
              content: 'பொங்கல் திருவிழாவைப் பற்றி கற்கவும்.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['பொங்கல் தமிழர்களின் முக்கியமான அறுவடைத் திருவிழா.', 'இது தைமாதத்தில் கொண்டாடப்படுகிறது.', 'புதுப்பானை பொங்கல் வேகவைப்பது மரபு.'] }},
              ],
              quizQuestions: [
                { text: 'பொங்கல் திருவிழா எந்த மாதத்தில் கொண்டாடப்படுகிறது?', answers: [{ text: 'தை மாதம்', isCorrect: true }, { text: 'ஆடி மாதம்', isCorrect: false }, { text: 'கார்த்திகை மாதம்', isCorrect: false }, { text: 'வைகாசி மாதம்', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'தமிழ் சமூகம் மற்றும் கலாச்சாரம் (Society & Culture)',
      topics: [
        {
          topicTitle: 'கலை மற்றும் இசை',
          lessons: [
            {
              title: 'தமிழ் இசை மற்றும் நடனம்', type: 'READING', xpReward: 30,
              content: 'தமிழ் கலை வடிவங்களைப் பற்றி கற்கவும்.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'பரதநாட்டியம்', transliteration: 'Bharatanatyam', meaning: 'Classical dance form', example: 'பரதநாட்டியம் தமிழரின் பாரம்பரிய நடனம்.' },
                  { word: 'கர்நாடக இசை', transliteration: 'Carnatic Isai', meaning: 'Carnatic music', example: 'கர்நாடக இசை மிகவும் சிக்கலான கலை.' },
                  { word: 'கோலம்', transliteration: 'Kolam', meaning: 'Rangoli / Floor pattern', example: 'தினமும் கோலம் போடுவது நம் மரபு.' },
                ]}},
              ],
              quizQuestions: [
                { text: '"Bharatanatyam" என்றால் என்ன?', answers: [{ text: 'பரதநாட்டியம் — ஒரு பாரம்பரிய நடன வடிவம்', isCorrect: true }, { text: 'ஒரு இசை வகை', isCorrect: false }, { text: 'ஒரு சமையல் உணவு', isCorrect: false }, { text: 'ஒரு திருவிழா', isCorrect: false }] },
              ]
            },
            {
              title: 'திருமணம் மற்றும் பண்பாடு', type: 'READING', xpReward: 30,
              content: 'தமிழ் திருமண மரபுகளைப் பற்றி கற்கவும்.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['தமிழ் திருமணங்கள் கோவில்களில் நடைபெறும்.', 'மாப்பிள்ளை வீட்டிற்கு வந்து மணமகளை அழைத்து செல்வர்.', 'திருமண நாளில் தாலி கட்டுவது முக்கிய சடங்கு.'] }},
              ],
              quizQuestions: [
                { text: 'தமிழ் திருமணங்கள் பொதுவாக எங்கே நடைபெறும்?', answers: [{ text: 'கோவிலில்', isCorrect: true }, { text: 'கடற்கரையில்', isCorrect: false }, { text: 'மலையில்', isCorrect: false }, { text: 'பூங்காவில்', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'தொழில் மற்றும் வணிகம் (Work & Business)',
      topics: [
        {
          topicTitle: 'அலுவலக தமிழ்',
          lessons: [
            {
              title: 'அலுவலக வார்த்தைகள்', type: 'VOCABULARY', xpReward: 30,
              content: 'தமிழ் அலுவலகச் சூழலில் பயன்படும் வார்த்தைகளை கற்கவும்.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'கூட்டம்', transliteration: 'Kootam', meaning: 'Meeting', example: 'நாளை காலை கூட்டம் இருக்கிறது.' },
                { word: 'திட்டம்', transliteration: 'Thittam', meaning: 'Project / Plan', example: 'புதிய திட்டத்தை நேற்று ஆரம்பித்தோம்.' },
                { word: 'அறிக்கை', transliteration: 'Arikkai', meaning: 'Report', example: 'மாதாந்திர அறிக்கை தயார் செய்யுங்கள்.' },
                { word: 'நிர்வாகி', transliteration: 'Nirvagi', meaning: 'Manager', example: 'நிர்வாகி முடிவு எடுப்பார்.' },
              ]}}],
              quizQuestions: [
                { text: '"Meeting" என்பதை தமிழில் என்ன?', answers: [{ text: 'கூட்டம்', isCorrect: true }, { text: 'திட்டம்', isCorrect: false }, { text: 'அறிக்கை', isCorrect: false }, { text: 'நிர்வாகி', isCorrect: false }] },
              ]
            },
            {
              title: 'வேலை தேடுவது', type: 'SPEAKING', xpReward: 30,
              content: 'வேலை நேர்முகத்தில் பயன்படும் தமிழ் வாக்கியங்களை கற்கவும்.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['நான் 5 ஆண்டுகள் அனுபவம் உள்ளவன்.', 'இந்த நிறுவனத்தில் பணிபுரிய ஆசைப்படுகிறேன்.', 'என் தகுதி மற்றும் திறமை இந்த பதவிக்கு பொருந்தும்.'] }},
              ],
              quizQuestions: [
                { text: '"I have 5 years experience" — தமிழில்?', answers: [{ text: 'நான் 5 ஆண்டுகள் அனுபவம் உள்ளவன்', isCorrect: true }, { text: 'நான் மிகவும் திறமையானவன்', isCorrect: false }, { text: 'என் பெயர் ராஜன்', isCorrect: false }, { text: 'நான் கல்லூரி முடித்தேன்', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  advanced: [
    {
      moduleTitle: 'தமிழ் இலக்கியம் (Literature)',
      topics: [
        {
          topicTitle: 'திருக்குறள் (Thirukkural)',
          lessons: [
            {
              title: 'திருக்குறள் அறிமுகம்', type: 'READING', xpReward: 35,
              content: 'திருக்குறளின் அழகியல் மற்றும் தத்துவம் பற்றி அறியவும்.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['அகர முதல எழுத்தெல்லாம் ஆதி — குறள் 1', 'கற்க கசடற கற்பவை கற்றபின் நிற்க அதற்குத் தக — குறள் 391', 'அன்பிலார் எல்லாம் தமக்குரியர் அன்புடையார் என்பும் உரியர் பிறர்க்கு — குறள் 72'] }},
              ],
              quizQuestions: [
                { text: 'திருக்குறளை எழுதியவர் யார்?', answers: [{ text: 'திருவள்ளுவர்', isCorrect: true }, { text: 'கம்பர்', isCorrect: false }, { text: 'இளங்கோ அடிகள்', isCorrect: false }, { text: 'பாரதியார்', isCorrect: false }] },
                { text: 'திருக்குறளில் எத்தனை குறள்கள் உள்ளன?', answers: [{ text: '1330', isCorrect: true }, { text: '1000', isCorrect: false }, { text: '500', isCorrect: false }, { text: '108', isCorrect: false }] },
              ]
            },
            {
              title: 'சுப்பிரமணிய பாரதி கவிதைகள்', type: 'READING', xpReward: 40,
              content: 'பாரதியாரின் பிரசித்தமான கவிதைகளை படிக்கவும்.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['வாழிய செந்தமிழ் வாழிய — பாரதியார்', 'யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் இனிதாவது எங்கும் காணோம்.', 'நடிக்கும் விளையாட்டு பாவே — வாரீர்!'] }},
              ],
              quizQuestions: [
                { text: 'சுப்பிரமணிய பாரதி எந்த காலத்தின் கவிஞர்?', answers: [{ text: 'சுதந்திரப் போராட்ட காலம்', isCorrect: true }, { text: 'சங்க காலம்', isCorrect: false }, { text: 'மக்கள் ஆட்சி காலம்', isCorrect: false }, { text: 'திருவிழா காலம்', isCorrect: false }] },
              ]
            },
            {
              title: 'சங்க இலக்கியம்', type: 'READING', xpReward: 40,
              content: 'தமிழ் சங்க இலக்கியத்தின் சிறப்புகளை கற்கவும்.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['யாதும் ஊரே யாவரும் கேளிர் — புறநானூறு', 'தினைத்துணை நன்றி செய்யினும் — பழமொழி', 'நன்றி மறப்பது நன்றன்று — குறள்'] }},
              ],
              quizQuestions: [
                { text: '"யாதும் ஊரே யாவரும் கேளிர்" என்ற வரி எங்கிருந்து?', answers: [{ text: 'புறநானூறு', isCorrect: true }, { text: 'திருக்குறள்', isCorrect: false }, { text: 'சிலப்பதிகாரம்', isCorrect: false }, { text: 'மணிமேகலை', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'நவீன தமிழ் (Modern Tamil)',
      topics: [
        {
          topicTitle: 'நாளிதழ் தமிழ் மற்றும் ஊடகம்',
          lessons: [
            {
              title: 'செய்தி தமிழ் வாசிப்பு', type: 'READING', xpReward: 45,
              content: 'தமிழ் செய்தி மொழியை புரிந்துகொள்வது கற்கவும்.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'செய்தி மொழியில் செயவினை (passive voice) அதிகமாக பயன்படுத்தப்படுகிறது.', examples: ['தேர்தல் நடத்தப்பட்டது. (The election was conducted.)', 'திட்டம் அறிவிக்கப்பட்டது. (The plan was announced.)', 'சந்திப்பு நேற்று நடந்தது. (The meeting took place yesterday.)'] }},
              ],
              quizQuestions: [
                { text: '"The plan was announced" — தமிழில்?', answers: [{ text: 'திட்டம் அறிவிக்கப்பட்டது', isCorrect: true }, { text: 'திட்டம் நல்லது', isCorrect: false }, { text: 'அறிவிப்பு வந்தது', isCorrect: false }, { text: 'திட்டம் உள்ளது', isCorrect: false }] },
              ]
            },
            {
              title: 'சமூக வலைதள தமிழ்', type: 'SPEAKING', xpReward: 40,
              content: 'தமிழ் சமூக வலைதளங்களில் பயன்படும் வார்த்தைகளை கற்கவும்.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'பகிர்', transliteration: 'Pagir', meaning: 'Share (online)', example: 'இந்த படத்தை பகிருங்கள்.' },
                  { word: 'போட்டோ', transliteration: 'Photo', meaning: 'Photo / Image', example: 'அழகான போட்டோ போட்டீர்கள்.' },
                  { word: 'கருத்து', transliteration: 'Karuthu', meaning: 'Comment / Opinion', example: 'உங்கள் கருத்தை தெரிவியுங்கள்.' },
                ]}},
              ],
              quizQuestions: [
                { text: '"Share" என்பதை தமிழில் என்ன?', answers: [{ text: 'பகிர்', isCorrect: true }, { text: 'கருத்து', isCorrect: false }, { text: 'போட்டோ', isCorrect: false }, { text: 'இணைய', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'தமிழ் மொழி ஆராய்ச்சி (Linguistics)',
      topics: [
        {
          topicTitle: 'மொழியியல் கோட்பாடுகள்',
          lessons: [
            {
              title: 'தமிழ் மொழியின் வரலாறு', type: 'READING', xpReward: 50,
              content: 'தமிழ் மொழியின் தொன்மை வரலாற்றைப் பற்றி அறியவும்.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['தமிழ் உலகின் பழமையான தொடர்ந்து பேசப்படும் மொழிகளில் ஒன்று.', 'தமிழ் மொழியின் வரலாறு சுமார் 2,000 ஆண்டுகளுக்கும் மேல் ஆகும்.', 'தமிழ் எழுத்துமுறை 247 எழுத்துகளைக் கொண்டுள்ளது.'] }},
              ],
              quizQuestions: [
                { text: 'தமிழ் எழுத்துமுறையில் மொத்தம் எத்தனை எழுத்துகள் உள்ளன?', answers: [{ text: '247', isCorrect: true }, { text: '26', isCorrect: false }, { text: '100', isCorrect: false }, { text: '512', isCorrect: false }] },
              ]
            },
            {
              title: 'செந்தமிழ் மற்றும் கொடுந்தமிழ்', type: 'GRAMMAR', xpReward: 50,
              content: 'உயர் தமிழ் மற்றும் பேச்சு வழக்கு தமிழை ஒப்பிட்டு கற்கவும்.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'செந்தமிழ் என்பது இலக்கண ரீதியில் சரியான தமிழ். கொடுந்தமிழ் என்பது பேச்சு வழக்கில் உள்ள தமிழ்.', examples: ['செந்தமிழ்: நான் செல்கிறேன். கொடுந்தமிழ்: நான் போறேன்.', 'செந்தமிழ்: அவர் வருகிறார். கொடுந்தமிழ்: அவரு வர்றாரு.'] }},
              ],
              quizQuestions: [
                { text: '"நான் போறேன்" என்பது எந்த வகை தமிழ்?', answers: [{ text: 'கொடுந்தமிழ் (Spoken Tamil)', isCorrect: true }, { text: 'செந்தமிழ் (Classical Tamil)', isCorrect: false }, { text: 'இலக்கண தமிழ்', isCorrect: false }, { text: 'கவிதை தமிழ்', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ]
};
