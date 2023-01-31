import { Page } from 'puppeteer';

export type ProductVariant = {
    name: string | null;
    description: string | null;
    details: (string | null)[] | null;
    images: (string | null)[] | null;
    productColorTitle: string | null;
    sizes: (string | null)[] | null;
    singlePair: (string | null)[] | null;
};

export const getProductVariants = async (page: Page, url: string): Promise<ProductVariant[]> => {
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 0,
    });

    const variants: ProductVariant[] = [];
    const checkboxElementList = await page.$$('div[data-testid="color-checkbox"]');

    for (let index = 0; index < checkboxElementList.length; index++) {
        const elements = await page.$$('div[data-testid="color-checkbox"]');
        await elements[index].click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

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

    return variants;
};
