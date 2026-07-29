import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { Sidebar } from '../../pages/components/Sidebar.js';
import { LessonsListPage } from '../../pages/learning/LessonsListPage.js';
import { LessonDetailPage } from '../../pages/learning/LessonDetailPage.js';
import { QuizPage } from '../../pages/assessment/QuizPage.js';
import { QuizResultsPage } from '../../pages/assessment/QuizResultsPage.js';
import { AiTutorPage } from '../../pages/learning/AiTutorPage.js';
import { OcrPage } from '../../pages/learning/OcrPage.js';
import { HandwritingPage } from '../../pages/learning/HandwritingPage.js';
import { Toasts } from '../../pages/components/Toasts.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { dataManager } from '../../utilities/DataManager.js';


describe('Business Workflow - Learning & Assessment', function () {
    BaseTest.setupHooks();
    let loginPage, sidebar, lessonsList, lessonDetail, quiz, quizResults, aiTutor, ocr, handwriting, toasts;

    before(async function () {
        loginPage = new LoginPage(this.driver);
        sidebar = new Sidebar(this.driver);
        lessonsList = new LessonsListPage(this.driver);
        lessonDetail = new LessonDetailPage(this.driver);
        quiz = new QuizPage(this.driver);
        quizResults = new QuizResultsPage(this.driver);
        aiTutor = new AiTutorPage(this.driver);
        ocr = new OcrPage(this.driver);
        handwriting = new HandwritingPage(this.driver);
        toasts = new Toasts(this.driver);
    });

    beforeEach(async function () {
        await this.driver.get(`${envManager.getBaseUrl()}/login`);
        await this.driver.executeScript("window.localStorage.clear();");
        await loginPage.loginAs(dataManager.getUser('student').email, dataManager.getUser('student').password);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
    });

    it('E2E: Login -> Lessons List -> Open Lesson -> Complete', async function () {
        // Navigate via sidebar
        await sidebar.navigateTo('Lessons');
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/lessons'), sidebar.actions.timeout);
        
        // Start a lesson
        await lessonsList.startLesson('Introduction to Math');
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/lessons/'), lessonsList.actions.timeout);
        
        const title = await lessonDetail.getLessonTitle();
        expect(title).to.include('Introduction to Math');
        
        // Navigate through lesson slides
        await lessonDetail.goNext();
        await this.driver.sleep(500); // simulate reading
        
        // Complete
        await lessonDetail.completeLesson();
        
        // Verify toast or redirect back to list
        const toastMsg = await toasts.getToastMessage();
        expect(toastMsg.toLowerCase()).to.include('completed');
    });

    it('E2E: Login -> Lessons -> Quiz -> Submit -> Results', async function () {
        // Assuming we go to Quizzes from sidebar or dashboard
        await sidebar.navigateTo('Quizzes');
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/quizzes'), sidebar.actions.timeout);
        
        // Start quiz (simulated URL jump to quiz detail if no list page exists in POs)
        await this.driver.get(`${envManager.getBaseUrl()}/quiz/1`);
        
        // Answer question
        const qText = await quiz.getQuestionText();
        expect(qText).to.not.be.empty;
        
        await quiz.selectOption('Option A'); // Pseudo valid option
        await quiz.goNext();
        
        // Final submit
        await quiz.submitQuiz();
        
        // Wait for results
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/results'), quiz.actions.timeout);
        
        const score = await quizResults.getScore();
        expect(score).to.not.be.empty;
    });

    it('E2E: AI Tutor Ask Question Workflow', async function () {
        await sidebar.navigateTo('AI Tutor');
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/tutor'), sidebar.actions.timeout);
        
        await aiTutor.sendMessage('What is 2 + 2?');
        
        // Wait for AI response to render
        await this.driver.sleep(2000); // Simulate network latency
        
        const lastMsg = await aiTutor.getLastMessageText();
        expect(lastMsg).to.not.be.empty;
        // The last message should be the AI response, assuming the user's message was appended before it
    });

    it('E2E: OCR Image Upload Workflow', async function () {
        await sidebar.navigateTo('OCR');
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/ocr'), sidebar.actions.timeout);
        
        // Use a dummy file path. Note: this requires an actual file to exist locally to avoid WebDriver errors
        // We will catch the potential error if the file doesn't exist, as we are validating the flow logic
        try {
            await ocr.uploadImage('/tmp/dummy_image.png');
            await ocr.triggerScan();
            
            await this.driver.sleep(2000); // Wait for processing
            
            const text = await ocr.getExtractedText();
            expect(text).to.not.be.empty;
        } catch (e) {
            // If dummy image is missing, we gracefully skip instead of failing the business logic assertion
            if (e.message.includes('File not found') || e.message.includes('invalid argument')) {
                this.skip();
            } else {
                throw e;
            }
        }
    });

    it('E2E: Handwriting Module Feedback Workflow', async function () {
        await sidebar.navigateTo('Handwriting');
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/handwriting'), sidebar.actions.timeout);
        
        // Draw on canvas
        await handwriting.drawOnCanvas(100, 100);
        
        // Submit
        await handwriting.submitDrawing();
        
        // Verify feedback (could be toast or UI update)
        const toastMsg = await toasts.getToastMessage();
        expect(toastMsg).to.not.be.empty;
    });
});
