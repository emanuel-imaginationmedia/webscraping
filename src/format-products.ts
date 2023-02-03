import productsFromCategory from '../rings.json';
import { getCommercetoolsProductDrafs } from './get-commercetools-product-drafs';

(async () => {
    const { responseStatus } = await getCommercetoolsProductDrafs(productsFromCategory, 'rings');
    console.log('Products with error:', responseStatus.productsWithError);
})();
