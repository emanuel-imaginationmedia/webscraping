import { writeFileSync } from 'fs';
import {
    Attribute,
    CategoryKeyReference,
    ProductDraftImport,
    ProductTypeKeyReference,
    ProductVariantDraftImport,
    Image,
    PriceDraftImport,
} from '@commercetools/importapi-sdk';
import { ProductVariant } from './get-product-variants';
import { Product } from './get-products-from-a-category';
import { formatKey, formatName, formatPrice, getMetalStoneAndColor } from './utils';

const PRODUCT_TYPE_KEY = 'generic-product-type';

type Category = 'earrings' | 'rings' | 'necklaces' | 'bracelets-anklets';

const getProductType = (): ProductTypeKeyReference => {
    return {
        typeId: 'product-type',
        key: PRODUCT_TYPE_KEY,
    };
};

const getCategories = (category: Category): CategoryKeyReference[] => {
    switch (category) {
        case 'earrings':
            return [
                {
                    typeId: 'category',
                    key: 'earrings',
                },
            ];
        case 'rings':
            return [
                {
                    typeId: 'category',
                    key: 'rings',
                },
            ];
        case 'necklaces':
            return [
                {
                    typeId: 'category',
                    key: 'necklaces',
                },
            ];
        case 'bracelets-anklets':
            return [
                {
                    typeId: 'category',
                    key: 'bracelets-anklets',
                },
            ];
        default:
            throw new Error('Unavailable category');
    }
};

const getAttributes = (variant: ProductVariant, category: Category): Attribute[] => {
    const attributes: Attribute[] = [
        {
            name: 'Weight',
            type: 'number',
            value: 1,
        },
        {
            name: 'Height',
            type: 'number',
            value: 1,
        },
        {
            name: 'Width',
            type: 'number',
            value: 1,
        },
        {
            name: 'Length',
            type: 'number',
            value: 1,
        },
    ];

    let productType;
    switch (category) {
        case 'earrings':
            productType = 'earrings';
            break;
        case 'rings':
            productType = 'rings';
            break;

        case 'necklaces':
            productType = 'necklaces';
            break;

        case 'bracelets-anklets':
            productType = 'bracelets-anklets';
            break;

        default:
            throw new Error('Unavailable category');
    }
    attributes.push({
        name: 'product-type',
        type: 'enum',
        value: productType,
    });

    if (variant.details) {
        attributes.push({
            name: 'details',
            type: 'text',
            value: variant.details.join(';'),
        });
    }

    if (variant.productColorTitle) {
        const { metal, stone, color } = getMetalStoneAndColor(variant.productColorTitle);

        if (metal.length) {
            attributes.push({
                name: 'metal',
                type: 'enum-set',
                value: metal,
            });
        }

        if (stone.length) {
            attributes.push({
                name: 'stone',
                type: 'enum-set',
                value: stone,
            });
        }

        if (color.length) {
            attributes.push({
                name: 'color',
                type: 'enum-set',
                value: color,
            });
        }
    }

    return attributes;
};

const getProductVariants = (product: Product, category: Category): ProductVariantDraftImport[] => {
    const productVariants: ProductVariantDraftImport[] = [];

    product.variants.forEach((variant) => {
        if (variant.name && variant.productColorTitle) {
            const images: Image[] = variant.images?.length
                ? variant.images?.map((image) => {
                      return {
                          url: image || 'https://via.placeholder.com/1470x1400',
                          dimensions: { w: 1470, h: 1400 },
                      };
                  })
                : [];
            const prices: PriceDraftImport[] = [
                {
                    value: {
                        type: 'centPrecision',
                        currencyCode: 'USD',
                        centAmount: formatPrice(variant.name),
                    },
                },
            ];
            const attributes = getAttributes(variant, category);

            if (category === 'earrings' && variant.singlePair?.length) {
                productVariants.push({
                    key: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + 'single',
                    sku: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + 'single',
                    images,
                    prices,
                    attributes: attributes.concat([{ name: 'pair-single', type: 'enum', value: 'single' }]),
                });

                productVariants.push({
                    key: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + 'pair',
                    sku: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + 'pair',
                    images,
                    prices: [
                        {
                            value: {
                                type: 'centPrecision',
                                currencyCode: 'USD',
                                centAmount: formatPrice(variant.name) * 2,
                            },
                        },
                    ],
                    attributes: attributes.concat([{ name: 'pair-single', type: 'enum', value: 'pair' }]),
                });
            } else if (category === 'rings' && variant.sizes?.length) {
                variant.sizes.forEach((size) => {
                    if (size && variant.name && variant.productColorTitle) {
                        productVariants.push({
                            key: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + size,
                            sku: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + size,
                            images,
                            prices,
                            attributes: attributes.concat([{ name: 'ring-size', type: 'enum', value: `ring-size-${size}` }]),
                        });
                    }
                });
            } else if (category === 'necklaces' && variant.sizes?.length) {
                variant.sizes.forEach((size) => {
                    if (size && variant.name && variant.productColorTitle) {
                        productVariants.push({
                            key: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + formatKey(size),
                            sku: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + formatKey(size),
                            images,
                            prices,
                            attributes: attributes.concat([{ name: 'necklace-size', type: 'enum', value: formatKey(size) }]),
                        });
                    }
                });
            } else if (category === 'bracelets-anklets' && variant.sizes?.length) {
                variant.sizes.forEach((size) => {
                    if (size && variant.name && variant.productColorTitle) {
                        productVariants.push({
                            key: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + formatKey(size),
                            sku: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle) + '-' + formatKey(size),
                            images,
                            prices,
                            attributes: attributes.concat([{ name: 'bracelet-size', type: 'enum', value: formatKey(size) }]),
                        });
                    }
                });
            } else {
                productVariants.push({
                    key: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle),
                    sku: formatKey(formatName(variant.name)) + '-' + formatKey(variant.productColorTitle),
                    images,
                    prices,
                    attributes: attributes,
                });
            }
        }
    });

    return productVariants;
};

const convertProductToProductDraftImport = (product: Product, category: Category): ProductDraftImport => {
    if (!product.variants || product.variants.length === 0) {
        throw new Error('A product must have at least one variant.');
    }

    if (!product.variants[0].name) {
        throw new Error('A product must have a name.');
    }

    const productVariants = getProductVariants(product, category);

    return {
        key: formatKey(formatName(product.variants[0].name)),
        name: {
            'en-US': formatName(product.variants[0].name),
        },
        description: product.variants[0].description
            ? {
                  'en-US': product.variants[0].description,
              }
            : undefined,
        slug: {
            'en-US': formatKey(formatName(product.variants[0].name)),
        },
        productType: getProductType(),
        categories: getCategories(category),
        masterVariant: productVariants[0],
        variants: productVariants.slice(1),
        publish: true,
        taxCategory: { typeId: 'tax-category', key: 'default' },
    };
};

export const getCommercetoolsProductDrafs = async (
    products: Product[],
    category: Category
): Promise<{
    productDrafts: ProductDraftImport[];
    responseStatus: {
        productsWithoutError: string[];
        productsWithError: string[];
    };
}> => {
    const responseStatus: {
        productsWithoutError: string[];
        productsWithError: string[];
    } = {
        productsWithoutError: [],
        productsWithError: [],
    };

    const productDrafts: ProductDraftImport[] = [];

    for (const product of products) {
        try {
            productDrafts.push(convertProductToProductDraftImport(product, category));

            responseStatus['productsWithoutError'].push(product.variants[0].name || 'unnamed');
        } catch (error) {
            console.error(error);
            responseStatus['productsWithError'].push(product.variants[0].name || 'unnamed');
        }
    }

    try {
        writeFileSync(`${category}-commercetools.json`, JSON.stringify(productDrafts, null, 2));

        console.log(`${category}-commercetools.json created!`);
    } catch (error) {
        console.error(error);
    }

    return {
        productDrafts,
        responseStatus,
    };
};
