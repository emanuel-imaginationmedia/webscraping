import productsFromRingsCategory from '../rings.json';
import { getCommercetoolsProductDrafs } from './get-commercetools-product-drafs';

(async () => {
    const { responseStatus } = await getCommercetoolsProductDrafs(productsFromRingsCategory, 'rings');
    console.log('Products with error:', responseStatus.productsWithError);
})();
