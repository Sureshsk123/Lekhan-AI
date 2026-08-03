import { By } from 'selenium-webdriver';

export class MainPage {
    constructor(driver) {
        this.driver = driver;
        this.heroHeading = By.css('h1');
        this.getStartedBtn = By.xpath("//a[contains(text(),'Get Started') or contains(text(),'Explore')]");
        this.navLessons = By.xpath("//a[contains(@href,'/lessons') or contains(text(),'Lessons')]");
        this.navStories = By.xpath("//a[contains(@href,'/stories') or contains(text(),'Stories')]");
        this.navLogin = By.xpath("//a[contains(@href,'/login') or contains(text(),'Sign In')]");
        this.languageSelector = By.css('[data-testid="language-selector"], select');
    }

    async navigateTo(baseUrl) {
        await this.driver.get(baseUrl);
    }

    async getTitle() {
        return await this.driver.getTitle();
    }

    async isHeroDisplayed() {
        try {
            const elem = await this.driver.findElement(this.heroHeading);
            return await elem.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async clickGetStarted() {
        const btn = await this.driver.findElement(this.getStartedBtn);
        await btn.click();
    }
}
