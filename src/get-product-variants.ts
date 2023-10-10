import { Page } from 'puppeteer';

export type ProductVariant = {
    name: string | null |undefined;
    price: string | null |undefined;
    description: string | null | undefined;
    details: (string | null | undefined)[] | null;
    images: (string | null | undefined)[] | null;
    productColorTitle: string | null | undefined;
    sizes: string[];
    isSingle: boolean
};

async function groupDataFromProduct(page: Page) {
    const nameElement = await page.$('h1[class="max-w-prose whitespace-normal font-sans text-2xl font-semibold"]');
    const priceElement = await page.$('#price-without-tax');
    if (!await page.$('.prose')) {
        await page.click('button.text-left', { delay: 500 })
    }
    const descriptionElement = await page.$('.prose');
    const descriptionText = await descriptionElement?.evaluate(el => el.textContent)
    const detailElementList = await page.$$('.prose li')
    const imageElementList = await page.$$eval('.productView-img-container img', el => el.map((image: any) => image.src))
    const productColorTitleElement = await page.$('legend .font-semibold');
    const sizeButton = await page.$('[class="flex items-center justify-between w-full py-3 px-4 border border-accent-4"]')
    if (sizeButton) await sizeButton.click({ delay: 2000 })

    const productSizeElementList = await page.$$eval('[class="text-accent-2 w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer null"]', el => el?.map((item: any) => item.textContent.replace(/\(.+|\s/g, '')))
    const isSingle = await page.$('[class="flex mb-2 gap-1 items-center"] input[type="checkbox"]')
    return {
        name: await nameElement?.evaluate(el => el.textContent),
        price: await priceElement?.evaluate(el => el.textContent?.replace('$', '')),
        description: descriptionText,
        details: await Promise.all(detailElementList?.map(item => item?.evaluate(el => el?.textContent))),
        images: imageElementList,
        productColorTitle: await productColorTitleElement?.evaluate(el => el.textContent),
        sizes: productSizeElementList,
        isSingle: Boolean(isSingle)
    }
}

export const getProductVariants = async (page: Page, url: string): Promise<ProductVariant[]> => {
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 0,
    });    

    const variants: ProductVariant[] = [];
    const variantElementList = await page.$$('[class="flex flex-wrap items-baseline gap-4"] button');

    if (variantElementList && variantElementList.length) {
        for (let index = 0; index < variantElementList.length; index++) {
            const elements = await page.$$('[class="flex flex-wrap items-baseline gap-4"] button');
            await elements[index].click();
            await elements[index].click();
            
            variants.push(await groupDataFromProduct(page))
        }
    } else {        
        variants.push(await groupDataFromProduct(page))
    }

    return variants;
};
