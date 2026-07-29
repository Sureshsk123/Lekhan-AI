/**
 * MongoDB Data Store Helper Bridge
 * Replaces old in-memory datastore completely with MongoDB Mongoose queries
 */

import UserRepository from '../repositories/UserRepository.js';
import LessonRepository from '../repositories/LessonRepository.js';
import StoryRepository from '../repositories/StoryRepository.js';
import ProgressRepository from '../repositories/ProgressRepository.js';
import QuizRepository from '../repositories/QuizRepository.js';
import ShopRepository from '../repositories/ShopRepository.js';
import GamificationRepository from '../repositories/GamificationRepository.js';
import HandwritingRepository from '../repositories/HandwritingRepository.js';
import { achievementsCatalog, rewardsCatalog, alphabetData } from './seedData.js';

let _id = 1;
export const nextId = () => String(_id++);

export { achievementsCatalog, rewardsCatalog, alphabetData };

export const findUserById = async (id) => {
    return await UserRepository.findById(id);
};

export const findUser = async (query) => {
    if (query.email) return await UserRepository.findByEmail(query.email);
    if (query.username) return await UserRepository.findByUsername(query.username);
    if (query.id) return await UserRepository.findById(query.id);
    return null;
};

export const getOrCreateProgress = async (userId, language) => {
    return await ProgressRepository.findByUserAndLanguage(userId, language);
};

export const saveProgress = async (progress) => {
    return await ProgressRepository.save(progress);
};

export const addXPTransaction = async (userId, amount, source) => {
    return await GamificationRepository.addXPTransaction(userId, amount, source);
};

export const awardAchievement = async (userId, achievementId) => {
    return await GamificationRepository.awardAchievement(userId, achievementId);
};

export const recordQuizAttempt = async (attemptData) => {
    return await QuizRepository.createAttempt(attemptData);
};

export const findPurchasesByUser = async (userId) => {
    return await ShopRepository.getPurchasesByUser(userId);
};

export const findQuizAttemptsByUser = async (userId) => {
    const { data } = await QuizRepository.findByUserId(userId, { limit: 100 });
    return data;
};

export const findHandwritingScoresByUser = async (userId) => {
    const { data } = await HandwritingRepository.findByUserId(userId, { limit: 100 });
    return data;
};

export const findStories = async (query) => {
    return await StoryRepository.findStories(query);
};

export const findStoryById = async (id) => {
    return await StoryRepository.findById(id);
};

export const findLessonsByLanguage = async (language) => {
    return await LessonRepository.findByLanguage(language);
};

export const findLessonById = async (id) => {
    return await LessonRepository.findById(id);
};
