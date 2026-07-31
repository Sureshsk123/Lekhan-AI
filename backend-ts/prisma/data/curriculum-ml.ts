export const ML_CURRICULUM = {
  beginner: [
    {
      moduleTitle: 'അഭിവാദനങ്ങൾ (Greetings)',
      topics: [
        {
          topicTitle: 'അടിസ്ഥാന അഭിവാദനങ്ങൾ',
          lessons: [
            {
              title: 'നമസ്കാരം - സ്വാഗതം', type: 'VOCABULARY', xpReward: 15,
              content: 'മലയാളത്തിൽ അടിസ്ഥാന അഭിവാദനങ്ങൾ പഠിക്കുക.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'നമസ്കാരം', transliteration: 'Namaskāram', meaning: 'Hello / Greetings', example: 'നമസ്കാരം! നിങ്ങൾ എങ്ങനെ ഉണ്ട്?' },
                { word: 'നന്ദി', transliteration: 'Nandi', meaning: 'Thank you', example: 'നിങ്ങളുടെ സഹായത്തിന് നന്ദി.' },
                { word: 'ക്ഷമിക്കണം', transliteration: 'Kṣamikkaṇam', meaning: 'Sorry / Excuse me', example: 'ക്ഷമിക്കണം, ഞാൻ വൈകി.' },
                { word: 'ഉവ്വ്', transliteration: 'Uvv', meaning: 'Yes', example: 'ഉവ്വ്, ഞാൻ മനസ്സിലാക്കി.' },
                { word: 'ഇല്ല', transliteration: 'Illa', meaning: 'No', example: 'ഇല്ല, അത് ശരിയല്ല.' },
              ]}}],
              quizQuestions: [
                { text: 'മലയാളത്തിൽ "Hello" ഏത്?', answers: [{ text: 'നമസ്കാരം', isCorrect: true }, { text: 'നന്ദി', isCorrect: false }, { text: 'ഇല്ല', isCorrect: false }, { text: 'ഉവ്വ്', isCorrect: false }] },
                { text: '"നന്ദി" എന്നാൽ?', answers: [{ text: 'Thank you', isCorrect: true }, { text: 'Hello', isCorrect: false }, { text: 'Sorry', isCorrect: false }, { text: 'No', isCorrect: false }] },
              ]
            },
            {
              title: 'സ്വയം പരിചയപ്പെടുത്തൽ', type: 'SPEAKING', xpReward: 15,
              content: 'മലയാളത്തിൽ നിങ്ങളെ പരിചയപ്പെടുത്തുക.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'എന്റെ പേര്', transliteration: 'Ente pēr', meaning: 'My name', example: 'എന്റെ പേര് രോഹൻ.' },
                  { word: 'ഞാൻ', transliteration: 'Ñān', meaning: 'I / Me', example: 'ഞാൻ ഒരു വിദ്യാർഥിയാണ്.' },
                  { word: 'ഞാൻ... നിന്ന് വരുന്നു', transliteration: 'Ñān... ninn varunu', meaning: 'I come from', example: 'ഞാൻ കേരളത്തിൽ നിന്ന് വരുന്നു.' },
                ]}},
                { type: 'EXAMPLES', content: { sentences: ['നമസ്കാരം! എന്റെ പേര് പ്രിയ. ഞാൻ കൊച്ചിയിൽ നിന്ന് വരുന്നു.', 'ഞാൻ ഒരു വിദ്യാർഥിയാണ്.'] }}
              ],
              quizQuestions: [
                { text: '"ഞാൻ" എന്നാൽ?', answers: [{ text: 'I / Me', isCorrect: true }, { text: 'He', isCorrect: false }, { text: 'She', isCorrect: false }, { text: 'We', isCorrect: false }] },
              ]
            },
            {
              title: 'ചോദ്യങ്ങൾ ചോദിക്കൽ', type: 'GRAMMAR', xpReward: 15,
              content: 'മലയാളത്തിൽ ചോദ്യങ്ങൾ ചോദിക്കൽ പഠിക്കൂ.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'മലയാളത്തിൽ ചോദ്യങ്ങൾ "എവിടെ / എന്ത് / ആര് / എപ്പോൾ" ഉപയോഗിക്കും.', examples: ['നിങ്ങൾ എവിടെ പോകുന്നു?', 'ഇത് എന്ത്?', 'നിങ്ങളുടെ പേര് എന്ത്?'] }},
              ],
              quizQuestions: [
                { text: '"Where" ന് മലയാളം?', answers: [{ text: 'എവിടെ', isCorrect: true }, { text: 'എന്ത്', isCorrect: false }, { text: 'ആര്', isCorrect: false }, { text: 'എപ്പോൾ', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'സംഖ്യകളും നിറങ്ങളും',
          lessons: [
            {
              title: 'മലയാളം 1–10', type: 'VOCABULARY', xpReward: 15,
              content: 'മലയാളത്തിൽ 1 മുതൽ 10 വരെ പഠിക്കൂ.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ഒന്ന്', transliteration: 'Onn', meaning: 'One (1)', example: 'ഒന്ന് പുസ്തകം.' },
                { word: 'രണ്ട്', transliteration: 'Raṇṭ', meaning: 'Two (2)', example: 'രണ്ട് കുട്ടികൾ.' },
                { word: 'അഞ്ച്', transliteration: 'Añc', meaning: 'Five (5)', example: 'അഞ്ച് മിനിറ്റ്.' },
                { word: 'പത്ത്', transliteration: 'Patt', meaning: 'Ten (10)', example: 'പത്ത് രൂപ.' },
              ]}}],
              quizQuestions: [
                { text: '"രണ്ട്" എന്നാൽ?', answers: [{ text: 'Two', isCorrect: true }, { text: 'One', isCorrect: false }, { text: 'Five', isCorrect: false }, { text: 'Ten', isCorrect: false }] },
              ]
            },
            {
              title: 'മലയാളം നിറങ്ങൾ', type: 'VOCABULARY', xpReward: 15,
              content: 'മലയാളത്തിൽ നിറങ്ങളുടെ പേരുകൾ പഠിക്കൂ.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ചുവപ്പ്', transliteration: 'Cuvapp', meaning: 'Red', example: 'ചുവന്ന ഗുലാബം.' },
                { word: 'നീല', transliteration: 'Nīla', meaning: 'Blue', example: 'നീലആകാശം.' },
                { word: 'പച്ച', transliteration: 'Pacca', meaning: 'Green', example: 'പച്ച ഇല.' },
                { word: 'വെളുപ്പ്', transliteration: 'Veḷupp', meaning: 'White', example: 'വെള്ള ഷർട്ട്.' },
              ]}}],
              quizQuestions: [
                { text: '"Red" ന് മലയാളം?', answers: [{ text: 'ചുവപ്പ്', isCorrect: true }, { text: 'നീല', isCorrect: false }, { text: 'പച്ച', isCorrect: false }, { text: 'വെളുപ്പ്', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  intermediate: [
    {
      moduleTitle: 'മലയാള വ്യാകരണം (Grammar)',
      topics: [
        {
          topicTitle: 'ക്രിയകൾ (Verbs)',
          lessons: [
            {
              title: 'വർത്തമാനകാലം', type: 'GRAMMAR', xpReward: 25,
              content: 'മലയാളത്തിൽ വർത്തമാനകാലം പഠിക്കൂ.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'വർത്തമാനകാലത്തിൽ ക്രിയകൾ "-ുന്നു/-കിണ്ടിരിക്കുന്നു" തിൽ അവസാനിക്കും.', examples: ['ഞാൻ പഠിക്കുന്നു (I am studying)', 'അവൻ ഓടുന്നു (He is running)', 'അവൾ പാടുന്നു (She is singing)'] }},
              ],
              quizQuestions: [
                { text: '"ഞാൻ പഠിക്കുന്നു" ൻ്റെ അർഥം?', answers: [{ text: 'I am studying', isCorrect: true }, { text: 'I studied', isCorrect: false }, { text: 'I will study', isCorrect: false }, { text: 'He studies', isCorrect: false }] },
              ]
            },
            {
              title: 'ഭൂതകാലം (Past Tense)', type: 'GRAMMAR', xpReward: 25,
              content: 'മലയാളത്തിൽ ഭൂതകാലം പഠിക്കൂ.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'ഭൂതകാലത്തിൽ ക്രിയകൾ "-ി/-u" ൽ അവസാനിക്കും.', examples: ['ഞാൻ തിന്നു (I ate)', 'അവൻ വന്നു (He came)', 'അവൾ പാടി (She sang)'] }},
              ],
              quizQuestions: [
                { text: '"ഞാൻ തിന്നു" ൻ്റെ അർഥം?', answers: [{ text: 'I ate', isCorrect: true }, { text: 'I am eating', isCorrect: false }, { text: 'I will eat', isCorrect: false }, { text: 'She ate', isCorrect: false }] },
              ]
            },
            {
              title: 'ഭാവിക്കാലം', type: 'GRAMMAR', xpReward: 25,
              content: 'മലയാളത്തിൽ ഭാവിക്കാലം പഠിക്കൂ.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'ഭാവിക്കാലത്തിൽ ക്രിയകൾ "-ും" ൽ അവസാനിക്കും.', examples: ['ഞാൻ വരും (I will come)', 'അവൻ പഠിക്കും (He will study)', 'അവൾ പാടും (She will sing)'] }},
              ],
              quizQuestions: [
                { text: '"ഞാൻ വരും" ൻ്റെ അർഥം?', answers: [{ text: 'I will come', isCorrect: true }, { text: 'I came', isCorrect: false }, { text: 'I am coming', isCorrect: false }, { text: 'She will come', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  advanced: [
    {
      moduleTitle: 'മലയാള സാഹിത്യം (Literature)',
      topics: [
        {
          topicTitle: 'ക്ലാസിക്കൽ കൃതികൾ',
          lessons: [
            {
              title: 'ആദ്ധ്യാത്മ രാമായണം', type: 'READING', xpReward: 35,
              content: 'തുഞ്ചത്ത് എഴുത്തച്ഛൻ്റെ ആദ്ധ്യാത്മ രാമായണം പഠിക്കൂ.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'എഴുത്തച്ഛൻ മലയാള ഭാഷയുടെ പിതാവ് ആണ്.',
                  'ആദ്ധ്യാത്മ രാമായണം കിളിപ്പാട്ട് ശൈലിയിൽ എഴുതപ്പെട്ടു.',
                  'ഹരി ശ്രീ ഗണപതയേ നമഃ — ഇത് അദ്ദേഹത്തിൻ്റെ ആദ്യ വരികൾ.'
                ]}},
              ],
              quizQuestions: [
                { text: 'മലയാള ഭാഷയുടെ പിതാവ് ആര്?', answers: [{ text: 'തുഞ്ചത്ത് എഴുത്തച്ഛൻ', isCorrect: true }, { text: 'കുമാരനാശൻ', isCorrect: false }, { text: 'ജി. ശങ്കരക്കുറുപ്പ്', isCorrect: false }, { text: 'ചെറുശ്ശേരി', isCorrect: false }] },
              ]
            },
            {
              title: 'കുമാരനാശൻ്റെ കവിത', type: 'READING', xpReward: 40,
              content: 'കുമാരനാശൻ്റെ ആധുനിക കവിതകൾ പഠിക്കൂ.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  '"നളിനി" കുമാരനാശൻ്റെ പ്രശസ്ത ഖണ്ഡകാവ്യം.',
                  '"കരുണ" ഒരു ബൗദ്ധ കഥയെ ആധാരമാക്കി.',
                  'ആശൻ മലയാള കവിതയുടെ ത്രിമൂർത്തിയിൽ ഒരാൾ.'
                ]}},
              ],
              quizQuestions: [
                { text: 'കുമാരനാശൻ ഏത് മൂർത്തിയിൽ ഉൾപ്പെടുന്നു?', answers: [{ text: 'ആധുനിക ത്രിമൂർത്തി', isCorrect: true }, { text: 'ഭക്തി കവി', isCorrect: false }, { text: 'ക്ലാസ്സിക്കൽ കവി', isCorrect: false }, { text: 'ആദ്ദ്യകാല കവി', isCorrect: false }] },
              ]
            },
            {
              title: 'ആധുനിക മലയാള ഗദ്യം', type: 'READING', xpReward: 40,
              content: 'ആധുനിക മലയാള ഗദ്യ സാഹിത്യം പഠിക്കൂ.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'ജ്ഞാനപീഠ പുരസ്കാരം ഏഴ് മലയാള എഴുത്തുകാർക്ക് ലഭിച്ചിട്ടുണ്ട്.',
                  'ടി. എസ്. പിള്ള, ജോർജ് ഓണക്കൂർ, ആനന്ദ് എന്നിവർ ആദ്ദേഹ ഗദ്യ കൃതികൾ.',
                  'ഒ. വി. വിജയൻ്റെ "ഖസാക്കിൻ്റെ ഇതിഹാസം" ആദ്ദ്യ ആധുനിക നോവൽ.'
                ]}},
              ],
              quizQuestions: [
                { text: '"ഖസാക്കിൻ്റെ ഇതിഹാസം" ആര് എഴുതി?', answers: [{ text: 'ഒ. വി. വിജയൻ', isCorrect: true }, { text: 'മഹദേവൻ', isCorrect: false }, { text: 'കുമാരനാശൻ', isCorrect: false }, { text: 'ടി. ഇ. പിള്ള', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ]
};
