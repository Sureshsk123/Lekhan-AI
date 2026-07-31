export const TE_CURRICULUM = {
  beginner: [
    {
      moduleTitle: 'శుభాకాంక్షలు (Greetings)',
      topics: [
        {
          topicTitle: 'ప్రాథమిక శుభాకాంక్షలు',
          lessons: [
            {
              title: 'నమస్కారం - అభివందనాలు', type: 'VOCABULARY', xpReward: 15,
              content: 'తెలుగులో ప్రాథమిక శుభాకాంక్షలు నేర్చుకోండి.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'నమస్కారం', transliteration: 'Namaskāram', meaning: 'Hello / Greetings', example: 'నమస్కారం! మీరు ఎలా ఉన్నారు?' },
                { word: 'ధన్యవాదాలు', transliteration: 'Dhanyavādālu', meaning: 'Thank you', example: 'మీ సహాయానికి ధన్యవాదాలు.' },
                { word: 'క్షమించండి', transliteration: 'Kshaminchaṇḍi', meaning: 'Sorry / Excuse me', example: 'క్షమించండి, నేను ఆలస్యంగా వచ్చాను.' },
                { word: 'అవును', transliteration: 'Avunu', meaning: 'Yes', example: 'అవును, నేను అర్థం చేసుకున్నాను.' },
                { word: 'కాదు', transliteration: 'Kādu', meaning: 'No', example: 'కాదు, అది సరికాదు.' },
              ]}}],
              quizQuestions: [
                { text: 'తెలుగులో "Hello" ఏమిటి?', answers: [{ text: 'నమస్కారం', isCorrect: true }, { text: 'ధన్యవాదాలు', isCorrect: false }, { text: 'కాదు', isCorrect: false }, { text: 'అవును', isCorrect: false }] },
                { text: '"ధన్యవాదాలు" అంటే ఏమిటి?', answers: [{ text: 'Thank you', isCorrect: true }, { text: 'Hello', isCorrect: false }, { text: 'Sorry', isCorrect: false }, { text: 'Goodbye', isCorrect: false }] },
              ]
            },
            {
              title: 'నన్ను పరిచయం చేసుకోవడం', type: 'SPEAKING', xpReward: 15,
              content: 'తెలుగులో మిమ్మల్ని పరిచయం చేసుకోవడం నేర్చుకోండి.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'నా పేరు', transliteration: 'Nā pēru', meaning: 'My name', example: 'నా పేరు రాహుల్.' },
                  { word: 'నేను', transliteration: 'Nēnu', meaning: 'I / Me', example: 'నేను విద్యార్థిని.' },
                  { word: 'నేను వచ్చాను', transliteration: 'Nēnu vaccānu', meaning: 'I came from', example: 'నేను హైదరాబాద్ నుండి వచ్చాను.' },
                ]}},
                { type: 'EXAMPLES', content: { sentences: ['నమస్కారం! నా పేరు ప్రియ. నేను చెన్నై నుండి వచ్చాను.', 'నేను ఒక విద్యార్థిని మరియు తెలుగు నేర్చుకుంటున్నాను.'] }}
              ],
              quizQuestions: [
                { text: '"నా పేరు" అంటే?', answers: [{ text: 'My name', isCorrect: true }, { text: 'Your name', isCorrect: false }, { text: 'His name', isCorrect: false }, { text: 'Our name', isCorrect: false }] },
              ]
            },
            {
              title: 'ప్రశ్నలు అడగడం', type: 'GRAMMAR', xpReward: 15,
              content: 'తెలుగులో ప్రాథమిక ప్రశ్నలు నేర్చుకోండి.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'తెలుగులో ప్రశ్నలు "ఏమిటి? ఎక్కడ? ఎవరు? ఎప్పుడు?" తో తయారవుతాయి.', examples: ['మీరు ఎక్కడ వెళ్తున్నారు?', 'ఇది ఏమిటి?', 'మీ పేరు ఏమిటి?'] }},
              ],
              quizQuestions: [
                { text: '"Where" కి తెలుగు?', answers: [{ text: 'ఎక్కడ', isCorrect: true }, { text: 'ఏమిటి', isCorrect: false }, { text: 'ఎవరు', isCorrect: false }, { text: 'ఎప్పుడు', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'సంఖ్యలు మరియు రంగులు',
          lessons: [
            {
              title: 'తెలుగు సంఖ్యలు 1–10', type: 'VOCABULARY', xpReward: 15,
              content: 'తెలుగులో 1 నుండి 10 వరకు సంఖ్యలు నేర్చుకోండి.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ఒకటి', transliteration: 'Okati', meaning: 'One (1)', example: 'ఒకటి పుస్తకం.' },
                { word: 'రెండు', transliteration: 'Reṇḍu', meaning: 'Two (2)', example: 'రెండు పిల్లలు.' },
                { word: 'అయిదు', transliteration: 'Ayidu', meaning: 'Five (5)', example: 'అయిదు నిమిషాలు.' },
                { word: 'పది', transliteration: 'Padi', meaning: 'Ten (10)', example: 'పది రూపాయలు.' },
              ]}}],
              quizQuestions: [
                { text: '"రెండు" అంటే?', answers: [{ text: 'Two', isCorrect: true }, { text: 'One', isCorrect: false }, { text: 'Five', isCorrect: false }, { text: 'Ten', isCorrect: false }] },
              ]
            },
            {
              title: 'తెలుగు రంగులు', type: 'VOCABULARY', xpReward: 15,
              content: 'తెలుగులో రంగుల పేర్లు నేర్చుకోండి.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'ఎరుపు', transliteration: 'Erupu', meaning: 'Red', example: 'ఎరుపు గులాబీ.' },
                { word: 'నీలం', transliteration: 'Neelam', meaning: 'Blue', example: 'నీలం ఆకాశం.' },
                { word: 'పచ్చ', transliteration: 'Paccha', meaning: 'Green', example: 'పచ్చ ఆకు.' },
                { word: 'తెలుపు', transliteration: 'Telupu', meaning: 'White', example: 'తెలుపు చొక్కా.' },
              ]}}],
              quizQuestions: [
                { text: '"Red" కి తెలుగు?', answers: [{ text: 'ఎరుపు', isCorrect: true }, { text: 'నీలం', isCorrect: false }, { text: 'పచ్చ', isCorrect: false }, { text: 'తెలుపు', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  intermediate: [
    {
      moduleTitle: 'తెలుగు వ్యాకరణం (Grammar)',
      topics: [
        {
          topicTitle: 'క్రియలు (Verbs)',
          lessons: [
            {
              title: 'వర్తమాన కాలం', type: 'GRAMMAR', xpReward: 25,
              content: 'తెలుగులో వర్తమాన కాల క్రియలు నేర్చుకోండి.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'వర్తమాన కాలంలో క్రియలు "-తున్నాను/-తున్నాడు/-తున్నది" తో ముగుస్తాయి.', examples: ['నేను చదువుతున్నాను (I am studying)', 'అతను పరుగెత్తుతున్నాడు (He is running)', 'ఆమె పాడుతున్నది (She is singing)'] }},
              ],
              quizQuestions: [
                { text: '"నేను చదువుతున్నాను" అంటే?', answers: [{ text: 'I am studying', isCorrect: true }, { text: 'I studied', isCorrect: false }, { text: 'I will study', isCorrect: false }, { text: 'He is studying', isCorrect: false }] },
              ]
            },
            {
              title: 'భూత కాలం (Past Tense)', type: 'GRAMMAR', xpReward: 25,
              content: 'తెలుగులో భూత కాలం నేర్చుకోండి.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'భూత కాలంలో క్రియలు "-ను/-డు/-ది" తో ముగుస్తాయి.', examples: ['నేను తిన్నాను (I ate)', 'అతను వచ్చాడు (He came)', 'ఆమె పాడింది (She sang)'] }},
              ],
              quizQuestions: [
                { text: '"నేను తిన్నాను" అంటే?', answers: [{ text: 'I ate', isCorrect: true }, { text: 'I am eating', isCorrect: false }, { text: 'I will eat', isCorrect: false }, { text: 'She ate', isCorrect: false }] },
              ]
            },
            {
              title: 'భవిష్యత్ కాలం', type: 'GRAMMAR', xpReward: 25,
              content: 'తెలుగులో భవిష్యత్ కాలం నేర్చుకోండి.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'భవిష్యత్ కాలంలో క్రియలు "-తాను/-తాడు/-తుంది" తో ముగుస్తాయి.', examples: ['నేను వస్తాను (I will come)', 'అతను చదువుతాడు (He will study)', 'ఆమె పాడుతుంది (She will sing)'] }},
              ],
              quizQuestions: [
                { text: '"నేను వస్తాను" అంటే?', answers: [{ text: 'I will come', isCorrect: true }, { text: 'I came', isCorrect: false }, { text: 'I am coming', isCorrect: false }, { text: 'She will come', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  advanced: [
    {
      moduleTitle: 'తెలుగు సాహిత్యం (Literature)',
      topics: [
        {
          topicTitle: 'తెలుగు కవిత్వం',
          lessons: [
            {
              title: 'నన్నయ మహాభారతం', type: 'READING', xpReward: 35,
              content: 'ఆది కవి నన్నయ మరియు తెలుగు మహాభారతం గురించి తెలుసుకోండి.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['నన్నయ తెలుగు సాహిత్యానికి ఆది కవి.', 'అతను తెలుగు మహాభారతాన్ని రచించాడు.', 'అతని కవిత్వం తెలుగు భాషను సుసంపన్నం చేసింది.'] }},
              ],
              quizQuestions: [
                { text: 'తెలుగు ఆది కవి ఎవరు?', answers: [{ text: 'నన్నయ', isCorrect: true }, { text: 'తిక్కన', isCorrect: false }, { text: 'పోతన', isCorrect: false }, { text: 'శ్రీనాథుడు', isCorrect: false }] },
              ]
            },
            {
              title: 'పోతన భాగవతం', type: 'READING', xpReward: 40,
              content: 'పోతన రచించిన మహాభాగవతం గురించి తెలుసుకోండి.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'పోతన తెలుగు భాగవతాన్ని భగవంతునికి అంకితం చేశాడు.',
                  '"అమ్మా నా రాజ్యము" అనే పద్యం చాలా ప్రసిద్ధం.',
                  'పోతన ఉమ్మడి ప్రభువు సహాయాన్ని తిరస్కరించాడు.'
                ]}},
              ],
              quizQuestions: [
                { text: 'పోతన ఏ గ్రంథాన్ని రచించాడు?', answers: [{ text: 'భాగవతం', isCorrect: true }, { text: 'మహాభారతం', isCorrect: false }, { text: 'రామాయణం', isCorrect: false }, { text: 'పురాణం', isCorrect: false }] },
              ]
            },
            {
              title: 'ఆధునిక తెలుగు కవిత్వం', type: 'READING', xpReward: 40,
              content: 'ఆధునిక తెలుగు కవుల రచనలు నేర్చుకోండి.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'శ్రీ శ్రీ తెలుగు సాహిత్యంలో విప్లవాన్ని తెచ్చారు.',
                  '"మహాప్రస్థానం" అతని ప్రసిద్ధ కవితా సంకలనం.',
                  'దాశరథి తెలుగు నాటకానికి కొత్త జీవాన్ని ఇచ్చాడు.'
                ]}},
              ],
              quizQuestions: [
                { text: '"మహాప్రస్థానం" ఎవరు రాశారు?', answers: [{ text: 'శ్రీ శ్రీ', isCorrect: true }, { text: 'దాశరథి', isCorrect: false }, { text: 'పోతన', isCorrect: false }, { text: 'నన్నయ', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ]
};
