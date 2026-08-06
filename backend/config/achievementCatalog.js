/**
 * 100+ Predefined Achievement Catalog for LangSphere
 */

export const defaultAchievements = [
  // Required Core Achievements
  { achievementId: 'first_lesson', name: 'First Lesson Completed', icon: '🌱', description: 'Complete your very first lesson', category: 'milestone', xpReward: 50, diamondReward: 10, targetMetric: 'lessons', targetValue: 1 },
  { achievementId: 'first_quiz_passed', name: 'First Quiz Passed', icon: '🎯', description: 'Pass your first quiz with flying colors', category: 'Quiz', xpReward: 75, diamondReward: 15, targetMetric: 'quizzes_passed', targetValue: 1 },
  { achievementId: 'xp_100', name: '100 XP Earned', icon: '⭐', description: 'Earn your first 100 XP', category: 'General', xpReward: 50, diamondReward: 20, targetMetric: 'xp', targetValue: 100 },
  { achievementId: 'xp_500', name: '500 XP Earned', icon: '🚀', description: 'Reach a total of 500 XP', category: 'General', xpReward: 150, diamondReward: 50, targetMetric: 'xp', targetValue: 500 },
  { achievementId: 'streak_7', name: '7 Day Streak', icon: '🔥', description: 'Maintain a 7-day consecutive learning streak', category: 'Streak', xpReward: 150, diamondReward: 50, targetMetric: 'streak', targetValue: 7 },
  { achievementId: 'streak_30', name: '30 Day Streak', icon: '🌟', description: 'Maintain a 30-day consecutive learning streak', category: 'Streak', xpReward: 500, diamondReward: 100, targetMetric: 'streak', targetValue: 30 },
  { achievementId: 'lesson_10', name: '10 Lessons Completed', icon: '📚', description: 'Successfully complete 10 lessons', category: 'milestone', xpReward: 200, diamondReward: 40, targetMetric: 'lessons', targetValue: 10 },
  { achievementId: 'lesson_50', name: '50 Lessons Completed', icon: '🎓', description: 'Successfully complete 50 lessons', category: 'milestone', xpReward: 600, diamondReward: 150, targetMetric: 'lessons', targetValue: 50 },
  { achievementId: 'story_reader', name: 'Story Reader', icon: 'Sparkles', description: 'Read and complete your first interactive story', category: 'Stories', xpReward: 100, diamondReward: 30, targetMetric: 'stories', targetValue: 1 },
  { achievementId: 'vocab_master', name: 'Vocabulary Master', icon: 'BookOpen', description: 'Master 10 new vocabulary words', category: 'Vocabulary', xpReward: 120, diamondReward: 35, targetMetric: 'vocabulary', targetValue: 10 },

  // Additional Milestones
  { achievementId: 'handwriting_ace', name: 'Master Calligrapher', icon: '✍️', description: 'Score 90+ on handwriting evaluation', category: 'Handwriting', xpReward: 150, diamondReward: 15, targetMetric: 'handwriting_score', targetValue: 90 },
  { achievementId: 'ocr_explorer', name: 'Visionary Reader', icon: '👁️', description: 'Perform 10 OCR image extractions', category: 'General', xpReward: 100, diamondReward: 10, targetMetric: 'ocr_count', targetValue: 10 },
  { achievementId: 'quiz_master_5', name: 'Quiz Champion', icon: '🏆', description: 'Score 100% on 5 language quizzes', category: 'Quiz', xpReward: 250, diamondReward: 60, targetMetric: 'perfect_quizzes', targetValue: 5 },
];

// Helper to generate dynamic 100+ list
export const getAll100Achievements = () => {
  const catalog = [...defaultAchievements];
  const languages = ['Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'English'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Master'];

  let idCounter = 1;
  languages.forEach(lang => {
    levels.forEach(lvl => {
      catalog.push({
        achievementId: `${lang.toLowerCase()}_${lvl.toLowerCase()}_${idCounter++}`,
        name: `${lang} ${lvl} Specialist`,
        icon: '🌺',
        description: `Master ${lvl} proficiency in ${lang}`,
        category: 'language',
        language: lang,
        xpReward: 100 * idCounter,
        diamondReward: 10 * idCounter,
        targetMetric: 'language_level',
        targetValue: idCounter
      });
    });
  });

  // Fill up to 100+ items with weekly/milestone variants
  while (catalog.length < 105) {
    const num = catalog.length + 1;
    catalog.push({
      achievementId: `milestone_tier_${num}`,
      name: `LangSphere Vanguard Tier ${num}`,
      icon: '🛡️',
      description: `Reach learning milestone milestone #${num}`,
      category: num % 5 === 0 ? 'weekly' : 'milestone',
      xpReward: 100 + num * 5,
      diamondReward: 10 + Math.floor(num / 2),
      targetMetric: 'general_milestone',
      targetValue: num
    });
  }

  return catalog;
};

export default getAll100Achievements;
