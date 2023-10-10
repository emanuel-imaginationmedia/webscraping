import { getCommercetoolsProductDrafs } from './get-commercetools-product-drafs';

(async () => {
    const fileNames = ['rings', 'necklaces', 'bracelets', 'earrings']
    for (const fileName of fileNames) {
        const { default: fileContent } = await import(`../${fileName}.json`)
        const { responseStatus } = await getCommercetoolsProductDrafs(fileContent, fileName);
        console.log('Products with error:', responseStatus.productsWithError);
    }
})();
