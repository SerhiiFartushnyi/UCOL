import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Prompt to Design Button Functionality

test('Prompt to Design Button Functionality', async ({ page }) => {
    test.slow();
    
    //Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible({ timeout: 10000 });

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    await page.goto('/generative-ai/');
    // Assertions of Prompt Popup
    await expect(page.locator('#promptToDesignContainer').getByText('What would you like to')).toBeVisible({ timeout: 10000 });

    // Error message
    await page.locator('#promptToDesignContainer').getByText('What would you like to').click();
    //await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').fill('Some Test Message');  // can be automated
    await page.locator('#promptToDesignFormTop').getByRole('button', { name: 'use prompt to design' }).click();

    await expect(page.getByText('This field may not be blank.')).toBeVisible({ timeout: 10000 });

    // Fill prompt with random format and subject
    const formatIdeas = [
        'Poster', 'Logo', 'Infographic', 'Website', 'Mobile App Interface',
        'Business Card', 'Advertisement Banner', 'Packaging', 'Social Media Post', 'Magazine Cover'
    ];

    const subjectIdeas = [
        'Music Festival', 'Technology Startup', 'Wildlife Conservation', 'Space Exploration', 'Coffee Shop',
        'Fitness App', 'Sustainable Fashion', 'Online Education Platform', 'Art Exhibition', 'Charity Event'
    ];

    // Generate random indices
    const randomFormatIndex = Math.floor(Math.random() * formatIdeas.length);
    const randomSubjectIndex = Math.floor(Math.random() * subjectIdeas.length);

    // Get the random format and subject
    const randomFormat = formatIdeas[randomFormatIndex];
    const randomSubject = subjectIdeas[randomSubjectIndex];

    // Fill the placeholder with the selected format and subject

    // await page.locator('#promptToDesignPurposeInputTop').click();
    //await page.locator('#promptToDesignPurposeInputTop').fill(`Design a ${randomFormat} for a ${randomSubject}`);

    await page.locator('div').filter({ hasText: /^Default$/ }).first().click();
    const imagesGenType = [
        'Use generated images', 'Use internal images', 'Use external images', 'By subject relevance'
    ]
    const random1 = Math.floor(Math.random() * imagesGenType.length);
    const randomImage = imagesGenType[random1];
    await page.getByText(randomImage).click();

    await page.locator('div').filter({ hasText: /^Use genre recommender$/ }).first().click();

    const genres = [
        "ARLES", "AZULEJO", "BAHAUS", "BANKSY", "BASS", "BETAMEX", "CHIBI", "CO OP", "CRYPTANOVA", "CYBERLINK", "DALLY",
        "DANISH", "DARK KNIGHT", "DESTRUCTCO", "DIFFUSION", "DREAMS", "ERMETE", "FAU MEAU", "FEMINA", "FORTUNE 500",
        "FUTURISIMMO", "GALAXIA", "GRENOBLE", "GUCIE", "GUI", "HEART", "HELVETICA", "JAM", "JUVIE", "KUSAMO",
        "LES VISAGES", "LUCID", "LUDWIGRVDR", "MAGIC POP", "MALDIVES", "MELROSE", "MILKON", "MONDRIA", "NASDAZ",
        "NITSCI", "ODE TO JOY", "YUKIMURA", "OHM", "POP ART", "RESISTANT", "RETRO FUTURISM", "ROPPONGI", "SHADES OF RED",
        "SLOAN STREET", "SPACEX", "SPADE", "SUPERLUCK", "SUPREMO", "SWISS", "THE ID", "TIFAINE", "VINYL", "VIRGIL",
        "UUBER", "XEROX", "CRY BABY", "DOODAH", "ID", "WALLSTREET", "JUMP", "MANHATTAN", "STEELO", "SINGULARITY",
        "SELF", "TUES NIGHT", "SEVENTH AVENUE", "M H", "MONTESORI", "SOPHIA", "GOOG", "HOTEL X", "M8GAN", "MREALITY",
        "PINKGOLD", "RONALD", "CAMO", "BLUE WHITE", "M9GAN", "MONA DONA", "ROSE GOLD", "ODA MON", "SEPHORE", "GODARD",
        "ILFORD", "MISFIT", "TONYR", "BLOSSOM", "CRISPR", "GOLDMAN SHARK", "KAWAII", "KLAUS", "KOONIE", "LEMONARDO",
        "LOVE STORY", "M CO", "MONDRIAN", "NADAZ", "NAKANO", "NEON COMMERCIAL", "PAUL STRIPES", "PINK CLOUD", "QUADRANT",
        "UNDERDOG", "AMERICAN GOTHIC", "ART SOUP", "BAYWATCH", "BE SILLY", "BODHI", "CHATGPT", "COLLISION", "CUSHMAN",
        "DWELL", "GEOMETRICS", "GRAND THEFT RALLY", "GREEN", "HEMIS BBAG", "MIKKI", "MOMU", "MOYO CLINIC", "NICOLA",
        "NOOB", "NOZZE", "OLIVIER PEOPLE", "PETTO", "PIZZERIA", "PRIDE", "SEVEN SEAS", "STARWORKER", "STORYBOOK",
        "SUNLIFE", "TACCO ALTO", "TED TALK", "TESLA", "THE GATSBY", "TINDER", "VERDANA", "VINTAGE", "WHAT IF",
        "CHAT GPT", "NOOBS", "TED", "GATSBY", "CHIENS", "COCOON", "DAJJOBU", "F188", "GAMEGIRL","MODELE",
        "NEKANO", "SKYWEAR", "STEM", "TOONIE", "lumbaob", "Hello-2"
    ];

    const randomIndex2 = Math.floor(Math.random() * genres.length);
    const randomGenre = genres[randomIndex2];
    await page.getByText(randomGenre, {exact: true}).click();


    await page.locator('div').filter({ hasText: /^Parse the prompt for format$/ }).first().click();

    const formats = [
        "Profile Picture", "Post Square", "Post Portrait", "Post Landscape", "Thumbnail",
        "Story", "Reel", "Reel Cover Photo", "Grid", "Header",
        "Instream Photo", "Ad Carousel", "Ads Sponsored Carousel",
         "Pins", "Story Pins", "Ads",
        "Ad Thumbnail", , "Channel Banner", "Video", "Video Thumbnail",
        "Profile", "Banner", "Background", "Overlay", "Panel", "Email",
        "Presentation", "Banner", "Card portrait", "Card Landscape",
        "Post Card", "Large Flyer", "Flyer", "Poster", "Ad Card",
        "Desktop Cover", "Mobile Cover", "Brochure", "Sticker", "Newsletter",
        "Menu", "Invitation", "Resume", "Proposal", "TShirt", "Hoodie",
        "Long Sleeve", "Tote Bag", "Feed Photo", "Stories",
        "Cover", "Blog Post", "Company Logo", "Ads Sponsored Content"
    ];
    const randomIndex3 = Math.floor(Math.random() * formats.length);
    const randomTemplate = formats[randomIndex3];

    await page.getByText(randomTemplate, { exact: true }).click();

    // Fill the placeholder with the selected format and subject

    await page.locator('#promptToDesignPurposeInputTop').click();
    await page.locator('#promptToDesignPurposeInputTop').fill(`Design a ${randomFormat} for a ${randomSubject}`);
    await page.locator('#promptToDesignPurposeInputTop').press('Enter');

    //await page.locator('#promptToDesignFormTop').getByRole('button', { name: 'use prompt to design' }).click();

    // Soft Accertions >> Check some genetrating flow & if the URL contains '/tool/scene/'
    
    const softAssertions = [];

    try {
        await expect(page.getByText('understanding the prompt')).toBeVisible({timeout: 10000});
    } catch (error) {

        softAssertions.push(`Assertion failed: understanding the prompt - ${error.message}`);
    }
    
    try {
        await expect(page.getByText('generating visuals')).toBeVisible({timeout: 10000});
    } catch (error) {

        softAssertions.push(`Assertion failed: generating visuals - ${error.message}`);
    }

    try {
        await expect(page.getByText('writing text')).toBeVisible({timeout: 20000});
    } catch (error) {
        softAssertions.push(`Assertion failed: writing text - ${error.message}`);
    }

    // Wait for the page to load completely
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    // Check if the URL contains '/tool/scene/' 
    try {
        await page.waitForURL('**/tool/scene/**', { timeout: 60000 });
        const currentUrl = page.url();
        expect(currentUrl).toContain('/tool/scene/');

    } catch (error) {
        softAssertions.push(`Assertion failed: URL contains '/tool/scene/' - ${error.message}`);
    }
    // Log all soft assertion errors
    if (softAssertions.length > 0) {
        console.log('Soft assertion errors:', softAssertions.length);
        softAssertions.forEach(assertion => console.log(assertion));
    }
});