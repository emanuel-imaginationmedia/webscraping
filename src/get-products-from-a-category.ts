import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { getProductVariants, ProductVariant } from './get-product-variants';

const BASE_URL = 'https://mejuri.com/world/en/category';

export type Product = {
    variants: ProductVariant[];
};

export const getProductsFromACategory = async (category: string): Promise<void> => {
    try {
        const browser = await puppeteer.launch({
            devtools: true,
            defaultViewport: {
                width: 1024,
                height: 1080,
            },
            headless: true,
            timeout: 0,
        });
        const page = await browser.newPage();
        await page.goto(`${BASE_URL}/${category}`, {
            waitUntil: 'networkidle2',
            timeout: 0,
        });

        const productLinks = await page.evaluate(() => {
            const productGroupElementList = [...document.querySelectorAll('a[data-testid="product-group-name"]')];

            return productGroupElementList ? productGroupElementList.map((productGroup: any) => productGroup.href) : null;
        });
        const productLinksWithoutDuplication = [...new Set(productLinks)];

        const products: Product[] = [];
        if (productLinksWithoutDuplication && productLinksWithoutDuplication.length) {
            for (const productLink of productLinksWithoutDuplication) {
                const productVariants = await getProductVariants(page, productLink);
                products.push({
                    variants: productVariants,
                });
            }
        }

        writeFileSync(`${category}.json`, JSON.stringify(products, null, 2));

        console.log(`${category}.json created!`);

        await browser.close();
    } catch (error) {
        console.error(error);
    }
};
