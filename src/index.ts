import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        devtools: true,
        defaultViewport: {
            width: 1024,
            height: 1080,
        },
        headless: false,
    });
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation({
        waitUntil: 'networkidle2',
    });
    await page.goto('https://mejuri.com/world/en/shop/products/tube-huggie-hoops');
    await navigationPromise;

    const variants: any[] = [];
    const elements = await page.$$('div[data-testid="color-checkbox"]');

    for (let index = 0; index < elements.length; index++) {
        await elements[index].click();
        await navigationPromise;

        const product = await page.evaluate(() => {
            const nameElement = document.querySelector('h1[data-testid="product-title-text"]');
            const descriptionElement = document.querySelector('div[data-testid="product-collapsable-desc-content"] p');
            const detailElementList = [...document.querySelectorAll('div[data-testid="product-collapsable-details-content"] li')];
            const imageElementList = [...document.querySelectorAll('div[data-testid="product-image"] img')];
            const productColorTitleElement = document.querySelector('div[data-testid="product-color-title"]');
            const productSizeElementList = [...document.querySelectorAll('div[data-testid="size-checkbox"]')];
            const singlePairElementList = [...document.querySelectorAll('div[data-testid="single-pair-button"]')];

            return {
                name: nameElement ? nameElement.textContent : null,
                description: descriptionElement ? descriptionElement.textContent : null,
                details: detailElementList ? detailElementList.map((detail) => detail.textContent) : null,
                images: imageElementList ? imageElementList.map((image: any) => image.src) : null,
                productColorTitle: productColorTitleElement ? productColorTitleElement.textContent : null,
                sizes: productSizeElementList ? productSizeElementList.map((size) => size.textContent) : null,
                singlePair: singlePairElementList ? singlePairElementList.map((singlePair) => singlePair.textContent) : null,
            };
        });

        variants.push(product);
    }

    console.log(variants);

    await browser.close();
})();
