import StoryRepository from '../repositories/StoryRepository.js';

class StoryService {
    async getStories({ language, category }) {
        return await StoryRepository.findStories({ language, category });
    }

    async getStoryById(id) {
        let story = await StoryRepository.findById(id);
        if (story) {
            story = await StoryRepository.incrementReadCount(id);
        }
        return story;
    }

    async createStory(storyData) {
        return await StoryRepository.create(storyData);
    }

    async updateStory(id, updateData) {
        return await StoryRepository.update(id, updateData);
    }

    async deleteStory(id) {
        return await StoryRepository.softDelete(id);
    }

    async toggleBookmark(id, userId) {
        return await StoryRepository.toggleBookmark(id, userId);
    }

    async getAllStories({ filter, skip, limit, sort, search }) {
        return await StoryRepository.findAll({ filter, skip, limit, sort, search });
    }
}

export default new StoryService();
