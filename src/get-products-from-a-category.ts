import { Browser } from 'puppeteer';
import { getProductVariants, ProductVariant } from './get-product-variants';

const BASE_URL = 'https://www.danarebeccadesigns.com/collections';

export type Product = {
    variants: ProductVariant[];
};

export const getProductsFromACategory = async (browser: Browser, category: string) => {
    try {
        const [page] = await browser.pages()
        await page.goto(`${BASE_URL}/${category}`, {
            waitUntil: 'networkidle2',
            timeout: 0,
        });

        const productLinks = await page.evaluate(() => {
            const productGroupElementList = [...document.querySelectorAll('.grid-flow-row a')];

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
                console.log('products added', products.length)
            }
        }

        return products
    } catch (error) {
        return []
    }
};
