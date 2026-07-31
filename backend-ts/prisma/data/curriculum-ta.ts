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
    }
  ]
};
