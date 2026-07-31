export const KN_CURRICULUM = {
  beginner: [
    {
      moduleTitle: 'ಶುಭಾಶಯಗಳು (Greetings)',
      topics: [
        {
          topicTitle: 'ಮೂಲ ಶುಭಾಶಯಗಳು',
          lessons: [
            {
              title: 'ನಮಸ್ಕಾರ - ಶುಭಾಶಯ', type: 'VOCABULARY', xpReward: 15,
              content: 'ಕನ್ನಡದಲ್ಲಿ ಮೂಲ ಶುಭಾಶಯಗಳನ್ನು ಕಲಿಯಿರಿ.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ನಮಸ್ಕಾರ', transliteration: 'Namaskāra', meaning: 'Hello / Greetings', example: 'ನಮಸ್ಕಾರ! ನೀವು ಹೇಗಿದ್ದೀರಿ?' },
                { word: 'ಧನ್ಯವಾದ', transliteration: 'Dhanyavāda', meaning: 'Thank you', example: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ಧನ್ಯವಾದ.' },
                { word: 'ಕ್ಷಮಿಸಿ', transliteration: 'Kṣamisi', meaning: 'Sorry / Excuse me', example: 'ಕ್ಷಮಿಸಿ, ನಾನು ತಡವಾಗಿ ಬಂದೆ.' },
                { word: 'ಹೌದು', transliteration: 'Haudu', meaning: 'Yes', example: 'ಹೌದು, ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡೆ.' },
                { word: 'ಇಲ್ಲ', transliteration: 'Illa', meaning: 'No', example: 'ಇಲ್ಲ, ಅದು ಸರಿಯಲ್ಲ.' },
              ]}}],
              quizQuestions: [
                { text: 'ಕನ್ನಡದಲ್ಲಿ "Hello" ಏನು?', answers: [{ text: 'ನಮಸ್ಕಾರ', isCorrect: true }, { text: 'ಧನ್ಯವಾದ', isCorrect: false }, { text: 'ಇಲ್ಲ', isCorrect: false }, { text: 'ಹೌದು', isCorrect: false }] },
                { text: '"ಧನ್ಯವಾದ" ಅಂದರೆ?', answers: [{ text: 'Thank you', isCorrect: true }, { text: 'Hello', isCorrect: false }, { text: 'Sorry', isCorrect: false }, { text: 'No', isCorrect: false }] },
              ]
            },
            {
              title: 'ನನ್ನನ್ನು ಪರಿಚಯಿಸಿಕೊಳ್ಳುವುದು', type: 'SPEAKING', xpReward: 15,
              content: 'ಕನ್ನಡದಲ್ಲಿ ನಿಮ್ಮನ್ನು ಪರಿಚಯಿಸಿಕೊಳ್ಳಿ.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'ನನ್ನ ಹೆಸರು', transliteration: 'Nanna hesaru', meaning: 'My name', example: 'ನನ್ನ ಹೆಸರು ರೋಹನ್.' },
                  { word: 'ನಾನು', transliteration: 'Nānu', meaning: 'I / Me', example: 'ನಾನು ಒಬ್ಬ ವಿದ್ಯಾರ್ಥಿ.' },
                  { word: 'ನಾನು ... ನಿಂದ ಬಂದೆ', transliteration: 'Nānu...ninda bande', meaning: 'I came from', example: 'ನಾನು ಬೆಂಗಳೂರಿನಿಂದ ಬಂದೆ.' },
                ]}},
                { type: 'EXAMPLES', content: { sentences: ['ನಮಸ್ಕಾರ! ನನ್ನ ಹೆಸರು ಪ್ರಿಯ. ನಾನು ಮೈಸೂರಿನಿಂದ ಬಂದಿದ್ದೇನೆ.', 'ನಾನು ವಿದ್ಯಾರ್ಥಿ ಮತ್ತು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ.'] }}
              ],
              quizQuestions: [
                { text: '"ನಾನು" ಅಂದರೆ?', answers: [{ text: 'I / Me', isCorrect: true }, { text: 'He', isCorrect: false }, { text: 'She', isCorrect: false }, { text: 'We', isCorrect: false }] },
              ]
            },
            {
              title: 'ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುವುದು', type: 'GRAMMAR', xpReward: 15,
              content: 'ಕನ್ನಡದಲ್ಲಿ ಮೂಲ ಪ್ರಶ್ನೆಗಳನ್ನು ಕಲಿಯಿರಿ.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'ಕನ್ನಡದಲ್ಲಿ "ಎಲ್ಲಿ / ಏನು / ಯಾರು / ಯಾವಾಗ" ಉಪಯೋಗಿಸಿ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.', examples: ['ನೀವು ಎಲ್ಲಿ ಹೋಗುತ್ತೀರಿ?', 'ಇದು ಏನು?', 'ನಿಮ್ಮ ಹೆಸರು ಏನು?'] }},
              ],
              quizQuestions: [
                { text: '"Where" ಗೆ ಕನ್ನಡ?', answers: [{ text: 'ಎಲ್ಲಿ', isCorrect: true }, { text: 'ಏನು', isCorrect: false }, { text: 'ಯಾರು', isCorrect: false }, { text: 'ಯಾವಾಗ', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಬಣ್ಣಗಳು',
          lessons: [
            {
              title: 'ಕನ್ನಡ 1–10', type: 'VOCABULARY', xpReward: 15,
              content: 'ಕನ್ನಡದಲ್ಲಿ 1 ರಿಂದ 10 ರ ವರೆಗೆ ಕಲಿಯಿರಿ.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ಒಂದು', transliteration: 'Ondu', meaning: 'One (1)', example: 'ಒಂದು ಪುಸ್ತಕ.' },
                { word: 'ಎರಡು', transliteration: 'Eraḍu', meaning: 'Two (2)', example: 'ಎರಡು ಮಕ್ಕಳು.' },
                { word: 'ಐದು', transliteration: 'Aidu', meaning: 'Five (5)', example: 'ಐದು ನಿಮಿಷ.' },
                { word: 'ಹತ್ತು', transliteration: 'Hattu', meaning: 'Ten (10)', example: 'ಹತ್ತು ರೂಪಾಯಿ.' },
              ]}}],
              quizQuestions: [
                { text: '"ಎರಡು" ಅಂದರೆ?', answers: [{ text: 'Two', isCorrect: true }, { text: 'One', isCorrect: false }, { text: 'Five', isCorrect: false }, { text: 'Ten', isCorrect: false }] },
              ]
            },
            {
              title: 'ಕನ್ನಡ ಬಣ್ಣಗಳು', type: 'VOCABULARY', xpReward: 15,
              content: 'ಕನ್ನಡದಲ್ಲಿ ಬಣ್ಣಗಳ ಹೆಸರು ಕಲಿಯಿರಿ.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ಕೆಂಪು', transliteration: 'Kempu', meaning: 'Red', example: 'ಕೆಂಪು ಗುಲಾಬಿ.' },
                { word: 'ನೀಲಿ', transliteration: 'Nīli', meaning: 'Blue', example: 'ನೀಲಿ ಆಕಾಶ.' },
                { word: 'ಹಸಿರು', transliteration: 'Hasiru', meaning: 'Green', example: 'ಹಸಿರು ಎಲೆ.' },
                { word: 'ಬಿಳಿ', transliteration: 'Biḷi', meaning: 'White', example: 'ಬಿಳಿ ಶರ್ಟ್.' },
              ]}}],
              quizQuestions: [
                { text: '"Red" ಗೆ ಕನ್ನಡ?', answers: [{ text: 'ಕೆಂಪು', isCorrect: true }, { text: 'ನೀಲಿ', isCorrect: false }, { text: 'ಹಸಿರು', isCorrect: false }, { text: 'ಬಿಳಿ', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  intermediate: [
    {
      moduleTitle: 'ಕನ್ನಡ ವ್ಯಾಕರಣ (Grammar)',
      topics: [
        {
          topicTitle: 'ಕ್ರಿಯಾಪದಗಳು (Verbs)',
          lessons: [
            {
              title: 'ವರ್ತಮಾನ ಕಾಲ', type: 'GRAMMAR', xpReward: 25,
              content: 'ಕನ್ನಡದಲ್ಲಿ ವರ್ತಮಾನ ಕಾಲ ಕ್ರಿಯಾಪದಗಳನ್ನು ಕಲಿಯಿರಿ.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'ವರ್ತಮಾನ ಕಾಲದಲ್ಲಿ ಕ್ರಿಯಾಪದಗಳು "-ತ್ತೇನೆ/-ತ್ತಾನೆ/-ತ್ತಾಳೆ" ತಿ ಅಂತ್ಯಗೊಳ್ಳುತ್ತವೆ.', examples: ['ನಾನು ಓದುತ್ತೇನೆ (I am reading)', 'ಅವನು ಓಡುತ್ತಾನೆ (He is running)', 'ಅವಳು ಹಾಡುತ್ತಾಳೆ (She is singing)'] }},
              ],
              quizQuestions: [
                { text: '"ನಾನು ಓದುತ್ತೇನೆ" ಅಂದರೆ?', answers: [{ text: 'I am reading', isCorrect: true }, { text: 'I read', isCorrect: false }, { text: 'I will read', isCorrect: false }, { text: 'He reads', isCorrect: false }] },
              ]
            },
            {
              title: 'ಭೂತ ಕಾಲ (Past Tense)', type: 'GRAMMAR', xpReward: 25,
              content: 'ಕನ್ನಡದಲ್ಲಿ ಭೂತ ಕಾಲ ಕ್ರಿಯಾಪದಗಳನ್ನು ಕಲಿಯಿರಿ.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'ಭೂತ ಕಾಲದಲ್ಲಿ ಕ್ರಿಯಾಪದಗಳು "-ದೆ/-ದನು/-ದಳು" ತಿ ಅಂತ್ಯಗೊಳ್ಳುತ್ತವೆ.', examples: ['ನಾನು ತಿಂದೆ (I ate)', 'ಅವನು ಬಂದನು (He came)', 'ಅವಳು ಹಾಡಿದಳು (She sang)'] }},
              ],
              quizQuestions: [
                { text: '"ನಾನು ತಿಂದೆ" ಅಂದರೆ?', answers: [{ text: 'I ate', isCorrect: true }, { text: 'I am eating', isCorrect: false }, { text: 'I will eat', isCorrect: false }, { text: 'She ate', isCorrect: false }] },
              ]
            },
            {
              title: 'ಭವಿಷ್ಯ ಕಾಲ', type: 'GRAMMAR', xpReward: 25,
              content: 'ಕನ್ನಡದಲ್ಲಿ ಭವಿಷ್ಯ ಕಾಲ ಕಲಿಯಿರಿ.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'ಭವಿಷ್ಯ ಕಾಲದಲ್ಲಿ ಕ್ರಿಯಾಪದಗಳು "-ತ್ತೇನೆ/-ಈನು" ತಿ ಅಂತ್ಯಗೊಳ್ಳುತ್ತವೆ.', examples: ['ನಾನು ಬರುತ್ತೇನೆ (I will come)', 'ಅವನು ಓದುತ್ತಾನೆ (He will study)', 'ಅವಳು ಹಾಡುತ್ತಾಳೆ (She will sing)'] }},
              ],
              quizQuestions: [
                { text: '"ನಾನು ಬರುತ್ತೇನೆ" ಅಂದರೆ?', answers: [{ text: 'I will come', isCorrect: true }, { text: 'I came', isCorrect: false }, { text: 'I am coming', isCorrect: false }, { text: 'She will come', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  advanced: [
    {
      moduleTitle: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ (Literature)',
      topics: [
        {
          topicTitle: 'ಕವಿಗಳು ಮತ್ತು ಕೃತಿಗಳು',
          lessons: [
            {
              title: 'ಕುವೆಂಪು ಅವರ ಕಾವ್ಯ', type: 'READING', xpReward: 35,
              content: 'ಕನ್ನಡ ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ಅವರ ಕಾವ್ಯ ಕಲಿಯಿರಿ.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ — ಕುವೆಂಪು',
                  '"ಕಾನೂರು ಹೆಗ್ಗಡತಿ" ಅವರ ಪ್ರಸಿದ್ಧ ಕಾದಂಬರಿ.',
                  'ಕುವೆಂಪು ಕರ್ನಾಟಕ ಭಾರತ ರತ್ನ ಪ್ರಶಸ್ತಿ ಪಡೆದ ಮೊದಲ ಕನ್ನಡ ಸಾಹಿತಿ.'
                ]}},
              ],
              quizQuestions: [
                { text: 'ಕನ್ನಡ ರಾಷ್ಟ್ರಕವಿ ಯಾರು?', answers: [{ text: 'ಕುವೆಂಪು', isCorrect: true }, { text: 'ದ.ರಾ. ಬೇಂದ್ರೆ', isCorrect: false }, { text: 'ಮಾಸ್ತಿ', isCorrect: false }, { text: 'ಪಂಪ', isCorrect: false }] },
              ]
            },
            {
              title: 'ದ.ರಾ. ಬೇಂದ್ರೆ ಕಾವ್ಯ', type: 'READING', xpReward: 40,
              content: 'ಅಂಬಿಕಾತನಯದತ್ತ ದ.ರಾ. ಬೇಂದ್ರೆ ಅವರ ಕಾವ್ಯ ಕಲಿಯಿರಿ.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'ಬೇಂದ್ರೆ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ಪಡೆದ ಕನ್ನಡ ಕವಿ.',
                  '"ನಾಕು ತಂತಿ" ಅವರ ಪ್ರಸಿದ್ಧ ಕಾವ್ಯ ಸಂಕಲನ.',
                  'ಅವರ ಕವನ ಭಾಷೆ ಉತ್ತರ ಕರ್ನಾಟಕ ಭಾಷೆಯ ಮಣ್ಣಿನ ಘಮ ಇರುತ್ತದೆ.'
                ]}},
              ],
              quizQuestions: [
                { text: 'ಬೇಂದ್ರೆ ಅವರ ಉಪನಾಮ ಏನು?', answers: [{ text: 'ಅಂಬಿಕಾತನಯದತ್ತ', isCorrect: true }, { text: 'ಮಲ್ಲಿಗೆ', isCorrect: false }, { text: 'ಕನ್ನಡ ಕಾವ್ಯ', isCorrect: false }, { text: 'ಕವನ ರತ್ನ', isCorrect: false }] },
              ]
            },
            {
              title: 'ಆದಿಕವಿ ಪಂಪ', type: 'READING', xpReward: 40,
              content: 'ಕನ್ನಡ ಆದಿಕವಿ ಪಂಪ ಅವರ ಕೃತಿಗಳ ಬಗ್ಗೆ ಕಲಿಯಿರಿ.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'ಪಂಪ ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಆದಿ ಕವಿ.',
                  '"ಆದಿಪುರಾಣ" ಮತ್ತು "ವಿಕ್ರಮಾರ್ಜುನ ವಿಜಯ" ಅವರ ಮಹಾಕಾವ್ಯಗಳು.',
                  'ಪಂಪ ಕಾಲ ಕ್ರಿ.ಶ. 10ನೇ ಶತಮಾನ.'
                ]}},
              ],
              quizQuestions: [
                { text: 'ಕನ್ನಡ ಆದಿ ಕವಿ ಯಾರು?', answers: [{ text: 'ಪಂಪ', isCorrect: true }, { text: 'ಕುವೆಂಪು', isCorrect: false }, { text: 'ಬೇಂದ್ರೆ', isCorrect: false }, { text: 'ಮಾಸ್ತಿ', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ]
};
