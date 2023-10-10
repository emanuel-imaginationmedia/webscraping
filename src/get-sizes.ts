import { writeFileSync, readFileSync } from 'fs';
import { ProductVariant } from './get-product-variants';

(async () => {
  const products = [
    //   ...JSON.parse(readFileSync('rings.json', { encoding:'utf8', flag:'r' })),
    //   ...JSON.parse(readFileSync('earrings.json', { encoding:'utf8', flag:'r' })),
    //   ...JSON.parse(readFileSync('necklaces.json', { encoding:'utf8', flag:'r' })),
      ...JSON.parse(readFileSync('bracelets.json', { encoding:'utf8', flag:'r' })),
  ]
  let sizes: string[] = []
  products.forEach(product => {
      product.variants.forEach((variant: ProductVariant) => {
        variant.sizes?.forEach(size => {
            if (!sizes.includes(size)) {
                sizes.push(size)
            }
        })
      })
  })
  writeFileSync('sizes.txt', sizes.join('\n'))
})()

