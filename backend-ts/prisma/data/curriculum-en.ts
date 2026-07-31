export const EN_CURRICULUM = {
  beginner: [
    {
      moduleTitle: 'Greetings & Introductions',
      topics: [
        {
          topicTitle: 'Basic Greetings',
          lessons: [
            {
              title: 'Hello & Goodbye', type: 'VOCABULARY', xpReward: 15,
              content: 'Learn the most essential greetings in English.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'Hello', meaning: 'A common greeting', example: 'Hello, how are you?' },
                { word: 'Goodbye', meaning: 'A farewell expression', example: 'Goodbye! See you tomorrow.' },
                { word: 'Hi', meaning: 'Informal greeting', example: 'Hi there!' },
                { word: 'Good morning', meaning: 'Morning greeting', example: 'Good morning, sir!' },
                { word: 'Good night', meaning: 'Evening farewell', example: 'Good night, sleep well.' },
              ]}}],
              quizQuestions: [
                { text: 'Which is an informal greeting?', answers: [{ text: 'Hi', isCorrect: true }, { text: 'Good morning', isCorrect: false }, { text: 'Goodbye', isCorrect: false }, { text: 'Sir', isCorrect: false }] },
                { text: 'What does "Goodbye" mean?', answers: [{ text: 'A farewell expression', isCorrect: true }, { text: 'A greeting', isCorrect: false }, { text: 'A question', isCorrect: false }, { text: 'A thank you', isCorrect: false }] },
              ]
            },
            {
              title: 'Introducing Yourself', type: 'SPEAKING', xpReward: 15,
              content: 'Learn how to introduce yourself confidently in English.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'Name', meaning: 'What someone is called', example: 'My name is Priya.' },
                  { word: 'Age', meaning: 'How old someone is', example: 'I am 20 years old.' },
                  { word: 'Student', meaning: 'Someone who studies', example: 'I am a student.' },
                  { word: 'From', meaning: 'Country of origin', example: 'I am from India.' },
                ]}},
                { type: 'EXAMPLES', content: { sentences: ['Hello! My name is Priya. I am 21 and from Chennai.', 'Hi, I am Ravi. I am a student.'] }}
              ],
              quizQuestions: [
                { text: 'Complete: "My ___ is Priya."', answers: [{ text: 'name', isCorrect: true }, { text: 'age', isCorrect: false }, { text: 'from', isCorrect: false }, { text: 'place', isCorrect: false }] },
                { text: 'How do you say you are a learner?', answers: [{ text: 'I am a student', isCorrect: true }, { text: 'I am a teacher', isCorrect: false }, { text: 'I am a doctor', isCorrect: false }, { text: 'I am old', isCorrect: false }] },
              ]
            },
            {
              title: 'Meeting People', type: 'GRAMMAR', xpReward: 15,
              content: 'Practice polite phrases when meeting someone new.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'Use "Nice to meet you" when you meet someone for the first time.', examples: ['Nice to meet you, Priya!', 'How do you do?', 'Pleased to meet you.'] }},
                { type: 'CONVERSATION', content: { lines: [{ speaker: 'A', text: 'Hi, I am Ravi.' }, { speaker: 'B', text: 'Nice to meet you, Ravi. I am Meena.' }] }}
              ],
              quizQuestions: [
                { text: 'What do you say when you first meet someone?', answers: [{ text: 'Nice to meet you', isCorrect: true }, { text: 'See you later', isCorrect: false }, { text: 'Good night', isCorrect: false }, { text: 'Where are you?', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'Numbers & Time',
          lessons: [
            {
              title: 'Numbers 1–20', type: 'VOCABULARY', xpReward: 15,
              content: 'Count and use numbers in English.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'One', meaning: '1', example: 'One apple.' },
                { word: 'Five', meaning: '5', example: 'Five books.' },
                { word: 'Ten', meaning: '10', example: 'Ten students.' },
                { word: 'Twenty', meaning: '20', example: 'Twenty people.' },
              ]}}],
              quizQuestions: [
                { text: 'What number comes after nine?', answers: [{ text: 'Ten', isCorrect: true }, { text: 'Eight', isCorrect: false }, { text: 'Eleven', isCorrect: false }, { text: 'Six', isCorrect: false }] },
              ]
            },
            {
              title: 'Days of the Week', type: 'VOCABULARY', xpReward: 15,
              content: 'Learn the seven days of the week.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'Monday', meaning: 'First day of the work week', example: 'I go to school on Monday.' },
                { word: 'Friday', meaning: 'Last work day', example: 'Friday is fun day.' },
                { word: 'Sunday', meaning: 'Day of rest', example: 'We rest on Sunday.' },
              ]}}],
              quizQuestions: [
                { text: 'Which day comes after Friday?', answers: [{ text: 'Saturday', isCorrect: true }, { text: 'Monday', isCorrect: false }, { text: 'Thursday', isCorrect: false }, { text: 'Sunday', isCorrect: false }] },
              ]
            },
            {
              title: 'Telling the Time', type: 'GRAMMAR', xpReward: 20,
              content: 'Learn to read and say the time in English.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'Use "It is [hour] o\'clock" for exact hours. Use "half past" for 30 minutes.', examples: ['It is three o\'clock.', 'It is half past five.', 'It is quarter to six.'] }},
              ],
              quizQuestions: [
                { text: 'How do you say 3:00?', answers: [{ text: 'It is three o\'clock', isCorrect: true }, { text: 'It is half past three', isCorrect: false }, { text: 'It is three thirty', isCorrect: false }, { text: 'Three is late', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    },
    {
      moduleTitle: 'Daily Life',
      topics: [
        {
          topicTitle: 'Food & Eating',
          lessons: [
            {
              title: 'Common Foods', type: 'VOCABULARY', xpReward: 15,
              content: 'Learn names of everyday foods.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'Rice', meaning: 'A grain food', example: 'I eat rice every day.' },
                { word: 'Bread', meaning: 'Baked food from flour', example: 'I have bread for breakfast.' },
                { word: 'Water', meaning: 'Essential liquid', example: 'Drink water daily.' },
                { word: 'Milk', meaning: 'White liquid from cows', example: 'Children drink milk.' },
                { word: 'Fruit', meaning: 'Sweet natural food', example: 'I eat fruit every morning.' },
              ]}}],
              quizQuestions: [
                { text: 'Which is a grain food?', answers: [{ text: 'Rice', isCorrect: true }, { text: 'Milk', isCorrect: false }, { text: 'Water', isCorrect: false }, { text: 'Fruit', isCorrect: false }] },
                { text: 'What do children drink for nutrition?', answers: [{ text: 'Milk', isCorrect: true }, { text: 'Water', isCorrect: false }, { text: 'Rice', isCorrect: false }, { text: 'Bread', isCorrect: false }] },
              ]
            },
            {
              title: 'Ordering Food', type: 'SPEAKING', xpReward: 20,
              content: 'Learn how to order food at a restaurant.',
              exercises: [
                { type: 'CONVERSATION', content: { lines: [
                  { speaker: 'Customer', text: 'I would like a plate of rice, please.' },
                  { speaker: 'Waiter', text: 'Of course. Anything to drink?' },
                  { speaker: 'Customer', text: 'Just water, thank you.' },
                ]}},
              ],
              quizQuestions: [
                { text: 'What is a polite way to order food?', answers: [{ text: 'I would like rice, please.', isCorrect: true }, { text: 'Give me rice.', isCorrect: false }, { text: 'I want food now.', isCorrect: false }, { text: 'Food!', isCorrect: false }] },
              ]
            },
            {
              title: 'Describing Food', type: 'VOCABULARY', xpReward: 15,
              content: 'Learn adjectives to describe food taste and texture.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'Sweet', meaning: 'Sugary taste', example: 'This mango is sweet.' },
                { word: 'Spicy', meaning: 'Hot and pungent', example: 'The curry is spicy.' },
                { word: 'Sour', meaning: 'Sharp acidic taste', example: 'Lemon is sour.' },
                { word: 'Fresh', meaning: 'Newly made or picked', example: 'This bread is fresh.' },
              ]}}],
              quizQuestions: [
                { text: 'Which word describes a lemon?', answers: [{ text: 'Sour', isCorrect: true }, { text: 'Sweet', isCorrect: false }, { text: 'Spicy', isCorrect: false }, { text: 'Fresh', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'At Home',
          lessons: [
            {
              title: 'Rooms of the House', type: 'VOCABULARY', xpReward: 15,
              content: 'Learn the names of rooms in a house.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'Kitchen', meaning: 'Room for cooking', example: 'My mother cooks in the kitchen.' },
                { word: 'Bedroom', meaning: 'Room for sleeping', example: 'I sleep in my bedroom.' },
                { word: 'Bathroom', meaning: 'Room with bath/toilet', example: 'I wash in the bathroom.' },
                { word: 'Living room', meaning: 'Room for relaxing', example: 'We watch TV in the living room.' },
              ]}}],
              quizQuestions: [
                { text: 'Where do you cook food?', answers: [{ text: 'Kitchen', isCorrect: true }, { text: 'Bedroom', isCorrect: false }, { text: 'Bathroom', isCorrect: false }, { text: 'Living room', isCorrect: false }] },
              ]
            },
            {
              title: 'Daily Routine', type: 'GRAMMAR', xpReward: 20,
              content: 'Use simple present tense to describe daily routines.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'Use simple present tense (I wake up, I eat, I sleep) for regular activities.', examples: ['I wake up at 6 AM.', 'I eat breakfast at 7 AM.', 'I go to bed at 10 PM.'] }},
              ],
              quizQuestions: [
                { text: 'Which sentence uses simple present correctly?', answers: [{ text: 'I wake up at 6 AM.', isCorrect: true }, { text: 'I waked up at 6 AM.', isCorrect: false }, { text: 'I am waking up yesterday.', isCorrect: false }, { text: 'I will woke up early.', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  intermediate: [
    {
      moduleTitle: 'Communication Skills',
      topics: [
        {
          topicTitle: 'Expressing Opinions',
          lessons: [
            {
              title: 'Agreeing & Disagreeing', type: 'SPEAKING', xpReward: 25,
              content: 'Learn phrases for agreeing and politely disagreeing.',
              exercises: [
                { type: 'VOCABULARY', content: { words: [
                  { word: 'I agree', meaning: 'I think the same', example: 'I agree with you.' },
                  { word: 'I disagree', meaning: 'I think differently', example: 'I disagree with that point.' },
                  { word: 'In my opinion', meaning: 'What I think', example: 'In my opinion, this is correct.' },
                  { word: 'However', meaning: 'But / on the other hand', example: 'However, there is another view.' },
                ]}},
              ],
              quizQuestions: [
                { text: 'Which phrase shows agreement?', answers: [{ text: 'I agree with you', isCorrect: true }, { text: 'I disagree', isCorrect: false }, { text: 'However', isCorrect: false }, { text: 'In my opinion', isCorrect: false }] },
              ]
            },
            {
              title: 'Giving Advice', type: 'GRAMMAR', xpReward: 25,
              content: 'Use "should" and "ought to" to give advice.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'Use "should" + base verb for advice. E.g., "You should study every day."', examples: ['You should drink water.', 'You ought to exercise.', 'You shouldn\'t skip meals.'] }},
              ],
              quizQuestions: [
                { text: 'Which sentence gives advice correctly?', answers: [{ text: 'You should study every day.', isCorrect: true }, { text: 'You studyed every day.', isCorrect: false }, { text: 'You will should study.', isCorrect: false }, { text: 'Study you should.', isCorrect: false }] },
              ]
            },
            {
              title: 'Asking for Help', type: 'SPEAKING', xpReward: 20,
              content: 'Learn polite ways to ask for help or clarification.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['Could you help me, please?', 'Would you mind explaining that?', 'Can you repeat that, please?'] }},
              ],
              quizQuestions: [
                { text: 'Which is a polite way to ask for help?', answers: [{ text: 'Could you help me, please?', isCorrect: true }, { text: 'Help me now!', isCorrect: false }, { text: 'I need help.', isCorrect: false }, { text: 'Why don\'t you help?', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'Past & Future',
          lessons: [
            {
              title: 'Simple Past Tense', type: 'GRAMMAR', xpReward: 25,
              content: 'Learn to talk about completed past actions.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'Add -ed to regular verbs. Irregular verbs change form (go → went, eat → ate).', examples: ['I walked to school yesterday.', 'She ate rice for lunch.', 'We watched a movie last night.'] }},
              ],
              quizQuestions: [
                { text: 'What is the past tense of "go"?', answers: [{ text: 'went', isCorrect: true }, { text: 'goed', isCorrect: false }, { text: 'goes', isCorrect: false }, { text: 'going', isCorrect: false }] },
                { text: 'Which sentence is in past tense?', answers: [{ text: 'She ate rice.', isCorrect: true }, { text: 'She eats rice.', isCorrect: false }, { text: 'She eat rice.', isCorrect: false }, { text: 'She eating rice.', isCorrect: false }] },
              ]
            },
            {
              title: 'Simple Future Tense', type: 'GRAMMAR', xpReward: 25,
              content: 'Express future plans using "will" and "going to".',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'Use "will + base verb" for decisions. Use "going to + base verb" for plans.', examples: ['I will call you tomorrow.', 'She is going to study tonight.', 'We will have dinner at 7.'] }},
              ],
              quizQuestions: [
                { text: 'Which sentence is in future tense?', answers: [{ text: 'I will call you tomorrow.', isCorrect: true }, { text: 'I called yesterday.', isCorrect: false }, { text: 'I call every day.', isCorrect: false }, { text: 'I calling now.', isCorrect: false }] },
              ]
            },
            {
              title: 'Talking About Plans', type: 'SPEAKING', xpReward: 25,
              content: 'Practice discussing your future plans in conversation.',
              exercises: [
                { type: 'CONVERSATION', content: { lines: [
                  { speaker: 'A', text: 'What are you going to do this weekend?' },
                  { speaker: 'B', text: 'I am going to visit my family.' },
                  { speaker: 'A', text: 'That sounds wonderful!' },
                ]}},
              ],
              quizQuestions: [
                { text: 'Which phrase describes a plan?', answers: [{ text: 'I am going to visit my family.', isCorrect: true }, { text: 'I visited my family.', isCorrect: false }, { text: 'I visit my family every year.', isCorrect: false }, { text: 'Visit family I will.', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'Workplace English',
          lessons: [
            {
              title: 'Job Vocabulary', type: 'VOCABULARY', xpReward: 25,
              content: 'Learn common job titles and workplace words.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'Manager', meaning: 'Person who leads a team', example: 'She is the manager of the team.' },
                { word: 'Colleague', meaning: 'A coworker', example: 'My colleague helped me with the project.' },
                { word: 'Meeting', meaning: 'A gathering to discuss work', example: 'We have a meeting at 10 AM.' },
                { word: 'Deadline', meaning: 'Final date for a task', example: 'The deadline is Friday.' },
              ]}}],
              quizQuestions: [
                { text: 'What is a "deadline"?', answers: [{ text: 'Final date for a task', isCorrect: true }, { text: 'A person who leads', isCorrect: false }, { text: 'A coworker', isCorrect: false }, { text: 'A work meeting', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ],
  advanced: [
    {
      moduleTitle: 'Academic English',
      topics: [
        {
          topicTitle: 'Essay Writing',
          lessons: [
            {
              title: 'Introduction Paragraphs', type: 'READING', xpReward: 35,
              content: 'Learn how to write a strong introduction for an essay.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'A good introduction has: a hook, background information, and a thesis statement.', examples: ['Hook: "Every year, millions of students struggle with English."', 'Thesis: "This essay explores three methods to improve language learning."'] }},
              ],
              quizQuestions: [
                { text: 'What does a thesis statement do?', answers: [{ text: 'States the main argument of the essay', isCorrect: true }, { text: 'Summarizes the conclusion', isCorrect: false }, { text: 'Lists references', isCorrect: false }, { text: 'Introduces the writer', isCorrect: false }] },
              ]
            },
            {
              title: 'Critical Thinking in Writing', type: 'READING', xpReward: 40,
              content: 'Develop analytical skills for academic writing.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['However, critics argue that this approach lacks evidence.', 'On the other hand, research supports the alternative view.', 'Therefore, one can conclude that...'] }},
              ],
              quizQuestions: [
                { text: 'Which word introduces a contrasting idea?', answers: [{ text: 'However', isCorrect: true }, { text: 'Therefore', isCorrect: false }, { text: 'Furthermore', isCorrect: false }, { text: 'Because', isCorrect: false }] },
              ]
            },
            {
              title: 'Advanced Vocabulary in Context', type: 'VOCABULARY', xpReward: 40,
              content: 'Master sophisticated vocabulary for academic and professional settings.',
              exercises: [{ type: 'VOCABULARY', content: { words: [
                { word: 'Elaborate', meaning: 'To explain in detail', example: 'Please elaborate on your point.' },
                { word: 'Facilitate', meaning: 'To make something easier', example: 'This tool facilitates learning.' },
                { word: 'Subsequent', meaning: 'Coming after', example: 'The subsequent events changed everything.' },
                { word: 'Comprehensive', meaning: 'Complete and thorough', example: 'She gave a comprehensive report.' },
              ]}}],
              quizQuestions: [
                { text: 'What does "facilitate" mean?', answers: [{ text: 'To make something easier', isCorrect: true }, { text: 'To stop something', isCorrect: false }, { text: 'To explain in detail', isCorrect: false }, { text: 'Coming after', isCorrect: false }] },
              ]
            }
          ]
        },
        {
          topicTitle: 'Public Speaking',
          lessons: [
            {
              title: 'Structuring a Speech', type: 'SPEAKING', xpReward: 35,
              content: 'Learn how to structure a clear and effective speech.',
              exercises: [
                { type: 'GRAMMAR', content: { rule: 'A speech has 3 parts: Opening (hook), Body (3 main points), Closing (call to action).', examples: ['Opening: "Good morning. Today I will speak about the power of education."', 'Closing: "Let us take action today!"'] }},
              ],
              quizQuestions: [
                { text: 'What is the purpose of the closing in a speech?', answers: [{ text: 'Call to action or summary', isCorrect: true }, { text: 'To introduce yourself', isCorrect: false }, { text: 'To list facts', isCorrect: false }, { text: 'To begin the topic', isCorrect: false }] },
              ]
            },
            {
              title: 'Persuasive Language', type: 'READING', xpReward: 40,
              content: 'Use rhetorical devices to make your arguments more powerful.',
              exercises: [
                { type: 'EXAMPLES', content: { sentences: ['Repetition: "We can do this. We will do this. We must do this."', 'Rhetorical question: "Is this the future we want for our children?"', 'Tricolon: "Life, liberty, and the pursuit of happiness."'] }},
              ],
              quizQuestions: [
                { text: 'What is a rhetorical question?', answers: [{ text: 'A question asked for effect, not for an answer', isCorrect: true }, { text: 'A factual question', isCorrect: false }, { text: 'A grammar exercise', isCorrect: false }, { text: 'A type of vocabulary', isCorrect: false }] },
              ]
            },
            {
              title: 'Debate & Discussion', type: 'SPEAKING', xpReward: 40,
              content: 'Practice debating skills with structured arguments.',
              exercises: [
                { type: 'CONVERSATION', content: { lines: [
                  { speaker: 'Speaker A', text: 'I believe technology improves education significantly.' },
                  { speaker: 'Speaker B', text: 'However, excessive screen time can harm students.' },
                  { speaker: 'Speaker A', text: 'That is a valid point, but moderation is the key.' },
                ]}},
              ],
              quizQuestions: [
                { text: 'Which response acknowledges the opponent\'s point?', answers: [{ text: 'That is a valid point, but moderation is the key.', isCorrect: true }, { text: 'You are completely wrong.', isCorrect: false }, { text: 'I agree with everything.', isCorrect: false }, { text: 'This does not matter.', isCorrect: false }] },
              ]
            }
          ]
        }
      ]
    }
  ]
};
