import Lesson from '../models/Lesson.js';
import Story from '../models/Story.js';
import User from '../models/User.js';
import ShopItem from '../models/ShopItem.js';
import Achievement from '../models/Achievement.js';

export const performGlobalSearch = async ({ query = '', category = 'all', page = 1, limit = 10 }) => {
  if (!query.trim()) {
    return {
      lessons: [],
      stories: [],
      vocabulary: [],
      users: [],
      shop: [],
      achievements: []
    };
  }

  const regex = new RegExp(query, 'i');
  const results = {};

  if (category === 'all' || category === 'lessons') {
    results.lessons = await Lesson.find({
      isDeleted: false,
      $or: [{ title: regex }, { description: regex }, { language: regex }]
    }).limit(limit).lean();
  }

  if (category === 'all' || category === 'stories') {
    results.stories = await Story.find({
      isDeleted: false,
      $or: [{ title: regex }, { content: regex }, { language: regex }]
    }).limit(limit).lean();
  }

  if (category === 'all' || category === 'vocabulary') {
    const lessonsWithVocab = await Lesson.find({
      isDeleted: false,
      'vocabulary.word': regex
    }).limit(limit).lean();

    const vocabularyMatches = [];
    lessonsWithVocab.forEach(l => {
      l.vocabulary.forEach(v => {
        if (regex.test(v.word) || regex.test(v.meaning || v.translation)) {
          vocabularyMatches.push({ ...v, lessonId: l._id, language: l.language });
        }
      });
    });
    results.vocabulary = vocabularyMatches;
  }

  if (category === 'all' || category === 'users') {
    results.users = await User.find({
      isDeleted: false,
      $or: [{ username: regex }, { email: regex }]
    }).select('-password').limit(limit).lean();
  }

  if (category === 'all' || category === 'shop') {
    results.shop = await ShopItem.find({
      isDeleted: false,
      $or: [{ name: regex }, { description: regex }, { category: regex }]
    }).limit(limit).lean();
  }

  if (category === 'all' || category === 'achievements') {
    results.achievements = await Achievement.find({
      isDeleted: false,
      $or: [{ name: regex }, { description: regex }]
    }).limit(limit).lean();
  }

  return results;
};

export default {
  performGlobalSearch
};
