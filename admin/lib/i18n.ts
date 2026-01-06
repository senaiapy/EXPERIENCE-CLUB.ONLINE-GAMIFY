import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  es: {
    translation: {
      // Navigation
      "nav.home": "Inicio",
      "nav.categories": "Categorías",
      "nav.brands": "Marcas",
      "nav.contact": "Contáctenos",
      "nav.login": "Iniciar sesión",
      "nav.register": "Registrarse",
      "nav.logout": "Cerrar sesión",
      "nav.myAccount": "Mi Cuenta",
      "nav.search": "Buscar productos...",
      
      // Product Card
      "product.viewDetails": "Ver Detalles",
      "product.addToCart": "Agregar al Carrito",
      "product.buyNow": "Comprar Ahora",
      "product.available": "Disponible",
      "product.outOfStock": "Agotado",
      "product.brand": "Sin marca",
      "product.processing": "Procesando...",
      "product.add": "Agregar",
      "product.buy": "Comprar",
      
      // Product Detail
      "productDetail.addedToCart": "agregado al carrito",
      "productDetail.units": "unidad",
      "productDetail.unitsPlural": "unidades",
      "productDetail.errorAddingToCart": "Error al agregar al carrito",
      "productDetail.productNotAvailable": "Este producto no está disponible",
      "productDetail.readyForShipping": "Listo para envío inmediato",
      "productDetail.quantity": "Cantidad",
      "productDetail.features": "Características",
      "productDetail.originalProduct": "Producto original",
      "productDetail.qualityGuarantee": "Garantía de calidad",
      "productDetail.freeShipping": "Envío gratis",
      "productDetail.freeReturn": "Devolución gratis",
      "productDetail.description": "Descripción",
      "productDetail.specifications": "Especificaciones:",
      "productDetail.relatedProducts": "Productos Relacionados",
      "productDetail.priceIncludesTaxes": "Precio incluye impuestos",
      
      // Home Page
      "home.showingProducts": "Mostrando",
      "home.ofProducts": "de",
      "home.products": "productos",
      "home.filtered": "filtrados",
      "home.noProductsFound": "No se encontraron productos",
      "home.changeSearchFilters": "Intenta cambiar los filtros de búsqueda",
      "home.previous": "Anterior",
      "home.next": "Siguiente",
      "home.shopByCategory": "Comprar por Categoría",
      
      // Categories
      "category.all": "Todas las categorías",
      "category.allBrands": "Todas las marcas",
      "category.sortBy": "Ordenar por",
      "category.nameAZ": "Nombre A-Z",
      "category.brandAZ": "Marca A-Z",
      "category.priceLowHigh": "Precio: Menor a Mayor",
      "category.priceHighLow": "Precio: Mayor a Menor",
      
      // Languages
      "language.spanish": "Español",
      "language.portuguese": "Português",
      "language.english": "English",
      
      // Theme
      "theme.light": "Tema Claro",
      "theme.dark": "Tema Oscuro",
      
      // Common
      "common.loading": "Cargando...",
      "common.error": "Error",
      "common.consultPrice": "Consultar precio",
      "common.imageNotAvailable": "Imagen no disponible"
    }
  },
  pt: {
    translation: {
      // Navigation
      "nav.home": "Início",
      "nav.categories": "Categorias",
      "nav.brands": "Marcas",
      "nav.contact": "Contate-nos",
      "nav.login": "Entrar",
      "nav.register": "Registrar",
      "nav.logout": "Sair",
      "nav.myAccount": "Minha Conta",
      "nav.search": "Buscar produtos...",
      
      // Product Card
      "product.viewDetails": "Ver Detalhes",
      "product.addToCart": "Adicionar ao Carrinho",
      "product.buyNow": "Comprar Agora",
      "product.available": "Disponível",
      "product.outOfStock": "Esgotado",
      "product.brand": "Sem marca",
      "product.processing": "Processando...",
      "product.add": "Adicionar",
      "product.buy": "Comprar",
      
      // Product Detail
      "productDetail.addedToCart": "adicionado ao carrinho",
      "productDetail.units": "unidade",
      "productDetail.unitsPlural": "unidades",
      "productDetail.errorAddingToCart": "Erro ao adicionar ao carrinho",
      "productDetail.productNotAvailable": "Este produto não está disponível",
      "productDetail.readyForShipping": "Pronto para envio imediato",
      "productDetail.quantity": "Quantidade",
      "productDetail.features": "Características",
      "productDetail.originalProduct": "Produto original",
      "productDetail.qualityGuarantee": "Garantia de qualidade",
      "productDetail.freeShipping": "Frete grátis",
      "productDetail.freeReturn": "Devolução grátis",
      "productDetail.description": "Descrição",
      "productDetail.specifications": "Especificações:",
      "productDetail.relatedProducts": "Produtos Relacionados",
      "productDetail.priceIncludesTaxes": "Preço inclui impostos",
      
      // Home Page
      "home.showingProducts": "Mostrando",
      "home.ofProducts": "de",
      "home.products": "produtos",
      "home.filtered": "filtrados",
      "home.noProductsFound": "Nenhum produto encontrado",
      "home.changeSearchFilters": "Tente alterar os filtros de pesquisa",
      "home.previous": "Anterior",
      "home.next": "Próximo",
      "home.shopByCategory": "Comprar por Categoria",
      
      // Categories
      "category.all": "Todas as categorias",
      "category.allBrands": "Todas as marcas",
      "category.sortBy": "Ordenar por",
      "category.nameAZ": "Nome A-Z",
      "category.brandAZ": "Marca A-Z",
      "category.priceLowHigh": "Preço: Menor para Maior",
      "category.priceHighLow": "Preço: Maior para Menor",
      
      // Languages
      "language.spanish": "Español",
      "language.portuguese": "Português",
      "language.english": "English",
      
      // Theme
      "theme.light": "Tema Claro",
      "theme.dark": "Tema Escuro",
      
      // Common
      "common.loading": "Carregando...",
      "common.error": "Erro",
      "common.consultPrice": "Consultar preço",
      "common.imageNotAvailable": "Imagem não disponível"
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.categories": "Categories",
      "nav.brands": "Brands",
      "nav.contact": "Contact Us",
      "nav.login": "Sign In",
      "nav.register": "Sign Up",
      "nav.logout": "Sign Out",
      "nav.myAccount": "My Account",
      "nav.search": "Search products...",
      
      // Product Card
      "product.viewDetails": "View Details",
      "product.addToCart": "Add to Cart",
      "product.buyNow": "Buy Now",
      "product.available": "Available",
      "product.outOfStock": "Out of Stock",
      "product.brand": "No brand",
      "product.processing": "Processing...",
      "product.add": "Add",
      "product.buy": "Buy",
      
      // Product Detail
      "productDetail.addedToCart": "added to cart",
      "productDetail.units": "unit",
      "productDetail.unitsPlural": "units",
      "productDetail.errorAddingToCart": "Error adding to cart",
      "productDetail.productNotAvailable": "This product is not available",
      "productDetail.readyForShipping": "Ready for immediate shipping",
      "productDetail.quantity": "Quantity",
      "productDetail.features": "Features",
      "productDetail.originalProduct": "Original product",
      "productDetail.qualityGuarantee": "Quality guarantee",
      "productDetail.freeShipping": "Free shipping",
      "productDetail.freeReturn": "Free return",
      "productDetail.description": "Description",
      "productDetail.specifications": "Specifications:",
      "productDetail.relatedProducts": "Related Products",
      "productDetail.priceIncludesTaxes": "Price includes taxes",
      
      // Home Page
      "home.showingProducts": "Showing",
      "home.ofProducts": "of",
      "home.products": "products",
      "home.filtered": "filtered",
      "home.noProductsFound": "No products found",
      "home.changeSearchFilters": "Try changing the search filters",
      "home.previous": "Previous",
      "home.next": "Next",
      "home.shopByCategory": "Shop by Category",
      
      // Categories
      "category.all": "All categories",
      "category.allBrands": "All brands",
      "category.sortBy": "Sort by",
      "category.nameAZ": "Name A-Z",
      "category.brandAZ": "Brand A-Z",
      "category.priceLowHigh": "Price: Low to High",
      "category.priceHighLow": "Price: High to Low",
      
      // Languages
      "language.spanish": "Español",
      "language.portuguese": "Português",
      "language.english": "English",
      
      // Theme
      "theme.light": "Light Theme",
      "theme.dark": "Dark Theme",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.consultPrice": "Consult price",
      "common.imageNotAvailable": "Image not available"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;