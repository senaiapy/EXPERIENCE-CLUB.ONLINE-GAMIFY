import { Product, ProductsResponse, ProductsQueryParams } from './products-api';

// Mock data for testing without database
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Perfume Chanel No. 5',
    slug: 'chanel-no-5',
    description: 'Iconic feminine fragrance',
    specifications: '100ml EDT',
    details: 'Classic timeless fragrance',
    price: 120.00,
    price_sale: 99.99,
    stock: 10,
    stockStatus: 'En stock',
    stockQuantity: 10,
    referenceId: 'CHN001',
    tags: ['perfume', 'feminine', 'classic'],
    brandId: 'brand-1',
    categoryId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    brand: {
      id: 'brand-1',
      name: 'Chanel',
      slug: 'chanel'
    },
    category: {
      id: 'cat-1',
      name: 'Perfumes Femeninos',
      slug: 'perfumes-femeninos'
    },
    images: [
      {
        id: 'img-1',
        filename: 'chanel-no5.jpg',
        size: 'HOME',
        url: '/images/chanel-no5.jpg'
      }
    ]
  },
  {
    id: '2',
    name: 'Dior Sauvage',
    slug: 'dior-sauvage',
    description: 'Modern masculine fragrance',
    specifications: '100ml EDT',
    details: 'Fresh and powerful scent',
    price: 95.00,
    price_sale: 85.00,
    stock: 15,
    stockStatus: 'En stock',
    stockQuantity: 15,
    referenceId: 'DIO001',
    tags: ['perfume', 'masculine', 'modern'],
    brandId: 'brand-2',
    categoryId: 'cat-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    brand: {
      id: 'brand-2',
      name: 'Dior',
      slug: 'dior'
    },
    category: {
      id: 'cat-2',
      name: 'Perfumes Masculinos',
      slug: 'perfumes-masculinos'
    },
    images: [
      {
        id: 'img-2',
        filename: 'dior-sauvage.jpg',
        size: 'HOME',
        url: '/images/dior-sauvage.jpg'
      }
    ]
  },
  {
    id: '3',
    name: 'Calvin Klein Eternity',
    slug: 'ck-eternity',
    description: 'Timeless unisex fragrance',
    specifications: '100ml EDT',
    details: 'Classic fragrance for everyone',
    price: 75.00,
    price_sale: 65.00,
    stock: 0,
    stockStatus: 'Agotado',
    stockQuantity: 0,
    referenceId: 'CK001',
    tags: ['perfume', 'unisex', 'classic'],
    brandId: 'brand-3',
    categoryId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    brand: {
      id: 'brand-3',
      name: 'Calvin Klein',
      slug: 'calvin-klein'
    },
    category: {
      id: 'cat-1',
      name: 'Perfumes Femeninos',
      slug: 'perfumes-femeninos'
    },
    images: [
      {
        id: 'img-3',
        filename: 'ck-eternity.jpg',
        size: 'HOME',
        url: '/images/ck-eternity.jpg'
      }
    ]
  }
];

// Mock API service for testing
export const mockProductsApi = {
  async getProducts(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
    const { page = 1, limit = 20, search = '', brandId = '', categoryId = '' } = params;

    let filteredProducts = [...mockProducts];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply brand filter
    if (brandId) {
      filteredProducts = filteredProducts.filter(product => product.brand.name === brandId);
    }

    // Apply category filter
    if (categoryId) {
      filteredProducts = filteredProducts.filter(product => product.category.name === categoryId);
    }

    // Sort by stock status (available first)
    filteredProducts.sort((a, b) => {
      if (a.stockStatus === 'En stock' && b.stockStatus !== 'En stock') return -1;
      if (a.stockStatus !== 'En stock' && b.stockStatus === 'En stock') return 1;
      return 0;
    });

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        search,
        brandId,
        categoryId,
        sortBy: 'stockQuantity',
        sortOrder: 'desc'
      }
    };
  },

  async deleteProduct(id: string): Promise<void> {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index > -1) {
      mockProducts.splice(index, 1);
    }
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const newProduct: Product = {
      id: `mock-${Date.now()}`,
      name: productData.name || 'New Product',
      slug: productData.name?.toLowerCase().replace(/\s+/g, '-') || 'new-product',
      description: productData.description || '',
      specifications: productData.specifications || '',
      details: productData.details || '',
      price: productData.price || 0,
      price_sale: productData.price_sale,
      stock: typeof productData.stockQuantity === 'string' ? parseInt(productData.stockQuantity) : (productData.stockQuantity || 0),
      stockStatus: productData.stockStatus || 'En stock',
      stockQuantity: productData.stockQuantity || 0,
      referenceId: productData.referenceId,
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      brandId: productData.brandId || 'brand-1',
      categoryId: productData.categoryId || 'cat-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      brand: {
        id: 'brand-1',
        name: productData.brandId || 'Default Brand',
        slug: 'default-brand'
      },
      category: {
        id: 'cat-1',
        name: productData.categoryId || 'Default Category',
        slug: 'default-category'
      },
      images: []
    };

    mockProducts.push(newProduct);
    return newProduct;
  }
};

export default mockProductsApi;