export const HI_CURRICULUM = {
  beginner: [
    {
      moduleTitle: 'अभिवादन (Greetings)',
      topics: [
        {
          topicTitle: 'बुनियादी अभिवादन (Basic Greetings)',
          lessons: [
            {
              title: 'नमस्ते और अलविदा', type: 'VOCABULARY', xpReward: 15,
              content: 'हिंदी में बुनियादी अभिवादन सीखें।',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'नमस्ते', transliteration: 'Namaste', meaning: 'Hello / Greetings', example: 'नमस्ते! आप कैसे हैं?' },
                { word: 'धन्यवाद', transliteration: 'Dhanyavaad', meaning: 'Thank you', example: 'आपकी मदद के लिए धन्यवाद।' },
                { word: 'माफ़ करना', transliteration: 'Maaf karna', meaning: 'Sorry / Excuse me', example: 'माफ़ करना, मैं देर से आया।' },
                { word: 'हाँ', transliteration: 'Haan', meaning: 'Yes', example: 'हाँ, मैं समझता हूँ।' },
                { word: 'नहीं', transliteration: 'Nahin', meaning: 'No', example: 'नहीं, यह सही नहीं है।' },
              ]}}],
              quizQuestions: [
                { text: 'हिंदी में "Hello" क्या है?', answers: [{ text: 'नमस्ते', isCorrect: true }, { text: 'धन्यवाद', isCorrect: false }, { text: 'माफ़ करना', isCorrect: false }, { text: 'अलविदा', isCorrect: false }] },
                { text: '"धन्यवाद" का अर्थ क्या है?', answers: [{ text: 'Thank you', isCorrect: true }, { text: 'Hello', isCorrect: false }, { text: 'Sorry', isCorrect: false }, { text: 'Goodbye', isCorrect: false }] },
              ]
            },
            {
              title: 'अपना परिचय देना', type: 'SPEAKING', xpReward: 15,
              content: 'हिंदी में अपना परिचय देना सीखें।',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'मेरा नाम', transliteration: 'Mera naam', meaning: 'My name', example: 'मेरा नाम राहुल है।' },
                  { word: 'मैं', transliteration: 'Main', meaning: 'I / Me', example: 'मैं एक छात्र हूँ।' },
                  { word: 'मुझे खुशी है', transliteration: 'Mujhe khushi hai', meaning: 'I am happy / Pleased to meet you', example: 'आपसे मिलकर मुझे खुशी है।' },
                ]}},
                { type: 'EXAMPLES', content: { sentences: ['नमस्ते! मेरा नाम प्रिया है। मैं दिल्ली से हूँ।', 'मैं एक छात्र हूँ और हिंदी सीख रही हूँ।'] }}
              ],
              quizQuestions: [
                { text: '"मेरा नाम" का अर्थ क्या है?', answers: [{ text: 'My name', isCorrect: true }, { text: 'Your name', isCorrect: false }, { text: 'His name', isCorrect: false }, { text: 'Our name', isCorrect: false }] },
              ]
            },
            {
              title: 'सवाल पूछना', type: 'GRAMMAR', xpReward: 15,
              content: 'हिंदी में बुनियादी सवाल पूछना सीखें।',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'हिंदी में सवाल पूछने के लिए "क्या, कहाँ, कब, कौन, कैसे" शब्दों का उपयोग होता है।', examples: ['आप कहाँ जा रहे हैं?', 'यह क्या है?', 'आपका नाम क्या है?'] }},
              ],
              quizQuestions: [
                { text: '"Where" के लिए हिंदी शब्द?', answers: [{ text: 'कहाँ', isCorrect: true }, { text: 'क्या', isCorrect: false }, { text: 'कब', isCorrect: false }, { text: 'कैसे', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'संख्याएँ और रंग',
          lessons: [
            {
              title: 'हिंदी गिनती 1–10', type: 'VOCABULARY', xpReward: 15,
              content: 'हिंदी में 1 से 10 तक गिनती सीखें।',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'एक', transliteration: 'Ek', meaning: 'One (1)', example: 'एक किताब।' },
                { word: 'दो', transliteration: 'Do', meaning: 'Two (2)', example: 'दो बच्चे।' },
                { word: 'पाँच', transliteration: 'Paanch', meaning: 'Five (5)', example: 'पाँच सेब।' },
                { word: 'दस', transliteration: 'Das', meaning: 'Ten (10)', example: 'दस मिनट।' },
              ]}}],
              quizQuestions: [
                { text: '"पाँच" का अर्थ?', answers: [{ text: 'Five', isCorrect: true }, { text: 'Three', isCorrect: false }, { text: 'Eight', isCorrect: false }, { text: 'Ten', isCorrect: false }] },
              ]
            },
            {
              title: 'हिंदी रंग', type: 'VOCABULARY', xpReward: 15,
              content: 'हिंदी में रंगों के नाम सीखें।',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'लाल', transliteration: 'Lal', meaning: 'Red', example: 'लाल गुलाब।' },
                { word: 'नीला', transliteration: 'Neela', meaning: 'Blue', example: 'नीला आकाश।' },
                { word: 'हरा', transliteration: 'Hara', meaning: 'Green', example: 'हरी घास।' },
                { word: 'सफ़ेद', transliteration: 'Safed', meaning: 'White', example: 'सफ़ेद कमीज़।' },
              ]}}],
              quizQuestions: [
                { text: '"Blue" के लिए हिंदी?', answers: [{ text: 'नीला', isCorrect: true }, { text: 'लाल', isCorrect: false }, { text: 'हरा', isCorrect: false }, { text: 'सफ़ेद', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'दैनिक जीवन (Daily Life)',
      topics: [
        {
          topicTitle: 'खाना-पीना (Food)',
          lessons: [
            {
              title: 'भारतीय खाना', type: 'VOCABULARY', xpReward: 15,
              content: 'आम भारतीय खाने के नाम हिंदी में सीखें।',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'रोटी', transliteration: 'Roti', meaning: 'Flatbread', example: 'रोटी खाओ।' },
                { word: 'चावल', transliteration: 'Chawal', meaning: 'Rice', example: 'मुझे चावल पसंद है।' },
                { word: 'दाल', transliteration: 'Dal', meaning: 'Lentils', example: 'दाल और चावल खाता हूँ।' },
                { word: 'पानी', transliteration: 'Paani', meaning: 'Water', example: 'पानी पियो।' },
              ]}}],
              quizQuestions: [
                { text: '"Water" के लिए हिंदी?', answers: [{ text: 'पानी', isCorrect: true }, { text: 'रोटी', isCorrect: false }, { text: 'दाल', isCorrect: false }, { text: 'चावल', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  intermediate: [
    {
      moduleTitle: 'हिंदी व्याकरण (Grammar)',
      topics: [
        {
          topicTitle: 'क्रियाएँ (Verbs)',
          lessons: [
            {
              title: 'वर्तमान काल', type: 'GRAMMAR', xpReward: 25,
              content: 'हिंदी में वर्तमान काल की क्रियाएँ सीखें।',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'वर्तमान काल में क्रियाओं के साथ "रहा हूँ / रही है / रहे हैं" जुड़ता है।', examples: ['मैं खाना खा रहा हूँ।', 'वह पढ़ रही है।', 'हम खेल रहे हैं।'] }},
              ],
              quizQuestions: [
                { text: '"मैं खाना खा रहा हूँ" का अर्थ?', answers: [{ text: 'I am eating food', isCorrect: true }, { text: 'I ate food', isCorrect: false }, { text: 'I will eat food', isCorrect: false }, { text: 'She is eating', isCorrect: false }] },
              ]
            },
            {
              title: 'भूतकाल (Past Tense)', type: 'GRAMMAR', xpReward: 25,
              content: 'हिंदी में भूतकाल की क्रियाएँ सीखें।',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'भूतकाल में क्रियाओं के अंत में "या / ई / ए" जुड़ता है।', examples: ['मैंने खाना खाया।', 'वह स्कूल गई।', 'हम बाजार गए।'] }},
              ],
              quizQuestions: [
                { text: '"मैंने खाना खाया" का अर्थ?', answers: [{ text: 'I ate food', isCorrect: true }, { text: 'I am eating', isCorrect: false }, { text: 'I will eat', isCorrect: false }, { text: 'She ate', isCorrect: false }] },
              ]
            },
            {
              title: 'भविष्य काल (Future Tense)', type: 'GRAMMAR', xpReward: 25,
              content: 'हिंदी में भविष्य काल सीखें।',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'भविष्य काल में "गा / गी / गे" लगता है।', examples: ['मैं कल आऊँगा।', 'वह पढ़ेगी।', 'हम खेलेंगे।'] }},
              ],
              quizQuestions: [
                { text: '"मैं कल आऊँगा" का अर्थ?', answers: [{ text: 'I will come tomorrow', isCorrect: true }, { text: 'I came yesterday', isCorrect: false }, { text: 'I am coming now', isCorrect: false }, { text: 'She will come', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'त्योहार (Festivals)',
          lessons: [
            {
              title: 'दीपावली', type: 'READING', xpReward: 25,
              content: 'दीपावली त्योहार के बारे में हिंदी में सीखें।',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['दीपावली रोशनी का त्योहार है।', 'इस दिन लोग दीए जलाते हैं और मिठाई खाते हैं।', 'लक्ष्मी पूजा दीपावली का मुख्य अनुष्ठान है।'] }},
              ],
              quizQuestions: [
                { text: 'दीपावली किसका त्योहार है?', answers: [{ text: 'रोशनी का', isCorrect: true }, { text: 'पानी का', isCorrect: false }, { text: 'रंगों का', isCorrect: false }, { text: 'फसल का', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  advanced: [
    {
      moduleTitle: 'हिंदी साहित्य (Literature)',
      topics: [
        {
          topicTitle: 'कबीर दोहे (Kabir Dohas)',
          lessons: [
            {
              title: 'कबीर के प्रसिद्ध दोहे', type: 'READING', xpReward: 35,
              content: 'कबीरदास के प्रसिद्ध दोहे और उनका अर्थ सीखें।',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'दुःख में सुमिरन सब करें, सुख में करें न कोय। — कबीर',
                  'बुरा जो देखन मैं चला, बुरा न मिलया कोय।',
                  'पोथी पढ़ पढ़ जग मुआ, पंडित भया न कोय।'
                ]}},
              ],
              quizQuestions: [
                { text: '"बुरा जो देखन मैं चला" किसका दोहा है?', answers: [{ text: 'कबीरदास', isCorrect: true }, { text: 'तुलसीदास', isCorrect: false }, { text: 'मीराबाई', isCorrect: false }, { text: 'सूरदास', isCorrect: false }] },
              ]
            },
            {
              title: 'तुलसीदास की रामचरितमानस', type: 'READING', xpReward: 40,
              content: 'रामचरितमानस की प्रसिद्ध चौपाइयाँ सीखें।',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  'मंगल भवन अमंगल हारी, द्रवहु सुदसरथ अजिर बिहारी।',
                  'सकल सुमंगल दायक रघुनायक।',
                  'जय राम रमापति रामचंद्र।'
                ]}},
              ],
              quizQuestions: [
                { text: 'रामचरितमानस किसने लिखी?', answers: [{ text: 'तुलसीदास', isCorrect: true }, { text: 'कबीरदास', isCorrect: false }, { text: 'वाल्मीकि', isCorrect: false }, { text: 'व्यास', isCorrect: false }] },
              ]
            },
            {
              title: 'प्रेमचंद की कहानियाँ', type: 'READING', xpReward: 40,
              content: 'मुंशी प्रेमचंद की लेखनी और शैली को समझें।',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: [
                  '"ईदगाह" में हामिद के बलिदान की कहानी है।',
                  '"गोदान" हिंदी का पहला किसान उपन्यास माना जाता है।',
                  'प्रेमचंद को "कलम का सिपाही" भी कहा जाता है।'
                ]}},
              ],
              quizQuestions: [
                { text: 'प्रेमचंद को क्या कहा जाता है?', answers: [{ text: 'कलम का सिपाही', isCorrect: true }, { text: 'महाकवि', isCorrect: false }, { text: 'भक्त कवि', isCorrect: false }, { text: 'नाटककार', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ]
};
