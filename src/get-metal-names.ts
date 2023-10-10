import { writeFileSync, readFileSync } from 'fs';
import { ProductVariant } from './get-product-variants';

(async () => {
  const products = [
      ...JSON.parse(readFileSync('rings.json', { encoding:'utf8', flag:'r' })),
      ...JSON.parse(readFileSync('earrings.json', { encoding:'utf8', flag:'r' })),
      ...JSON.parse(readFileSync('necklaces.json', { encoding:'utf8', flag:'r' })),
      ...JSON.parse(readFileSync('bracelets.json', { encoding:'utf8', flag:'r' })),
  ]
  let metalNames: string[] = []
  products.forEach(product => {
      product.variants.forEach((variant: ProductVariant) => {
          if (!metalNames.includes(variant.productColorTitle as string)) {
              metalNames.push(variant.productColorTitle as string)
          }
      })
  })
  writeFileSync('metalNames.txt', metalNames.join('\n'))
})()

