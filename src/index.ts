import puppeteer from 'puppeteer';
import { getProductVariants } from './get-product-variants';

(async () => {
    const browser = await puppeteer.launch({
        devtools: true,
        defaultViewport: {
            width: 1024,
            height: 1080,
        },
        headless: true,
    });
    const page = await browser.newPage();

    const productVariants = await getProductVariants(page, 'https://mejuri.com/world/en/shop/products/heart-enamel-ring-cream');
    console.log(productVariants);

    await browser.close();
})();
