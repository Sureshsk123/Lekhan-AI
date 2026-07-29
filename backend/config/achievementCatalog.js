/**
 * 100+ Predefined Achievement Catalog for LangSphere
 */

export const defaultAchievements = [
  // General & Milestones
  { achievementId: 'first_step', name: 'First Steps', icon: '👶', description: 'Complete your first lesson', category: 'milestone', xpReward: 50, diamondReward: 5, targetMetric: 'lessons', targetValue: 1 },
  { achievementId: 'lesson_master_5', name: 'Scholar in Training', icon: '📚', description: 'Complete 5 lessons', category: 'milestone', xpReward: 100, diamondReward: 10, targetMetric: 'lessons', targetValue: 5 },
  { achievementId: 'lesson_master_25', name: 'Diligent Scholar', icon: '🎓', description: 'Complete 25 lessons', category: 'milestone', xpReward: 250, diamondReward: 25, targetMetric: 'lessons', targetValue: 25 },
  { achievementId: 'lesson_master_50', name: 'Polyglot Prodigy', icon: '🏛️', description: 'Complete 50 lessons', category: 'milestone', xpReward: 500, diamondReward: 50, targetMetric: 'lessons', targetValue: 50 },
  { achievementId: 'lesson_master_100', name: 'Grandmaster Scholar', icon: '👑', description: 'Complete 100 lessons', category: 'milestone', xpReward: 1000, diamondReward: 100, targetMetric: 'lessons', targetValue: 100 },

  // Streaks
  { achievementId: 'streak_3', name: 'Sparking Flame', icon: '🔥', description: 'Maintain a 3-day learning streak', category: 'daily', xpReward: 75, diamondReward: 10, targetMetric: 'streak', targetValue: 3 },
  { achievementId: 'streak_7', name: 'Unstoppable Momentum', icon: '⚡', description: 'Maintain a 7-day learning streak', category: 'daily', xpReward: 150, diamondReward: 20, targetMetric: 'streak', targetValue: 7 },
  { achievementId: 'streak_30', name: 'Monthly Champion', icon: '🌟', description: 'Maintain a 30-day learning streak', category: 'daily', xpReward: 500, diamondReward: 50, targetMetric: 'streak', targetValue: 30 },
  { achievementId: 'streak_100', name: 'Centurion Streak', icon: '💎', description: 'Maintain a 100-day learning streak', category: 'daily', xpReward: 2000, diamondReward: 200, targetMetric: 'streak', targetValue: 100 },

  // XP Milestones
  { achievementId: 'xp_500', name: 'Rising Star', icon: '⭐', description: 'Earn 500 total XP', category: 'general', xpReward: 100, diamondReward: 10, targetMetric: 'xp', targetValue: 500 },
  { achievementId: 'xp_2500', name: 'XP Dynamo', icon: '🚀', description: 'Earn 2,500 total XP', category: 'general', xpReward: 300, diamondReward: 30, targetMetric: 'xp', targetValue: 2500 },
  { achievementId: 'xp_10000', name: 'XP Legend', icon: '🏆', description: 'Earn 10,000 total XP', category: 'general', xpReward: 1000, diamondReward: 100, targetMetric: 'xp', targetValue: 10000 },

  // Handwriting & OCR
  { achievementId: 'handwriting_ace', name: 'Master Calligrapher', icon: '✍️', description: 'Score 90+ on handwriting evaluation', category: 'general', xpReward: 150, diamondReward: 15, targetMetric: 'handwriting_score', targetValue: 90 },
  { achievementId: 'ocr_explorer', name: 'Visionary Reader', icon: '👁️', description: 'Perform 10 OCR image extractions', category: 'general', xpReward: 100, diamondReward: 10, targetMetric: 'ocr_count', targetValue: 10 },

  // Hidden Achievements
  { achievementId: 'night_owl', name: 'Night Owl Learner', icon: '🦉', description: 'Complete a lesson past midnight', category: 'hidden', isHidden: true, xpReward: 200, diamondReward: 20, targetMetric: 'night_owl', targetValue: 1 },
  { achievementId: 'speed_demon', name: 'Speed Demon', icon: '🏎️', description: 'Complete a quiz with 100% accuracy in under 30 seconds', category: 'hidden', isHidden: true, xpReward: 250, diamondReward: 25, targetMetric: 'fast_quiz', targetValue: 1 },
  { achievementId: 'perfectionist', name: 'Flawless Victory', icon: '🎯', description: 'Score 100% on 5 consecutive quizzes', category: 'hidden', isHidden: true, xpReward: 300, diamondReward: 30, targetMetric: 'perfect_quizzes', targetValue: 5 }
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
