import { getProductsFromACategory, Product } from './get-products-from-a-category';
import { writeFileSync, readFileSync } from 'fs';
import puppeteer, { Browser } from 'puppeteer';
const BASE_URL = 'https://www.danarebeccadesigns.com/collections';

async function loadCategoryProducts(browser: Browser, category: string) {
    const [page] = await browser.pages()
    await page.goto(`${BASE_URL}/${category}`, {
        waitUntil: 'networkidle2',
        timeout: 0,
    });

    const countPages = await page.$$eval('[class="text-accent-3 p-2"]', el => el.length)
    let currentPage = 1
    let products: Product[] = []
    while (currentPage <= countPages) {
        console.time('page scrapped')
        products = [...await getProductsFromACategory(browser, `${category}?page=${currentPage}`), ...products]
        console.timeEnd('page scrapped')
        currentPage++
    }
    
    writeFileSync(`${category}.json`, JSON.stringify(products, null, 2));    
    console.log(`${category}.json created!`);
}

(async () => {
    const browser = await puppeteer.launch({
        devtools: false,
        defaultViewport: {
            width: 1024,
            height: 1080,
        },
        headless: true,
        timeout: 0,
    });
    // await loadCategoryProducts(browser, 'rings')
    // await loadCategoryProducts(browser, 'earrings')
    // await loadCategoryProducts(browser, 'necklaces')
    // await loadCategoryProducts(browser, 'bracelets')

    await browser.close();
})();
