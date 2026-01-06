export type Language = 'ENGLISH' | 'SPANISH' | 'PORTUGUESE';

export interface Translations {
  // Navigation
  home: string;
  products: string;
  categories: string;
  brands: string;
  cart: string;
  wishlist: string;
  profile: string;
  login: string;
  logout: string;
  register: string;
  search: string;
  searchPlaceholder: string;
  myAccount: string;

  // Product
  addToCart: string;
  addToWishlist: string;
  removeFromWishlist: string;
  inStock: string;
  outOfStock: string;
  price: string;
  quantity: string;
  description: string;
  specifications: string;
  reviews: string;
  relatedProducts: string;
  features: string;
  originalProduct: string;
  qualityGuarantee: string;
  readyForShipping: string;
  priceIncludesTaxes: string;
  noBrand: string;

  // Product Messages
  mustLoginToAddToCart: string;
  mustLoginToBuy: string;
  productNotAvailable: string;
  addedToCart: string;
  errorAddingToCart: string;
  errorProcessingPurchase: string;

  // Cart
  shoppingCart: string;
  emptyCart: string;
  emptyCartMessage: string;
  continuesShopping: string;
  checkout: string;
  subtotal: string;
  shipping: string;
  freeShipping: string;
  total: string;
  removeItem: string;
  updateCart: string;
  clearCart: string;
  productRemovedFromCart: string;
  cartCleared: string;
  errorUpdatingQuantity: string;
  errorRemovingProduct: string;
  errorClearingCart: string;
  loadingCart: string;
  productsInCart: string;
  product: string;
  productsPlural: string;
  orderSummary: string;
  proceedToPayment: string;
  freeShippingOver: string;
  noImage: string;

  // Wishlist
  myWishlist: string;
  emptyWishlist: string;
  moveToCart: string;

  // Checkout
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  placeOrder: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Orders
  myOrders: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  orderTotal: string;
  viewDetails: string;
  trackOrder: string;
  orderHistory: string;

  // Status
  pending: string;
  processing: string;
  shipped: string;
  delivered: string;
  cancelled: string;

  // Auth
  signIn: string;
  signUp: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  rememberMe: string;
  forgotPassword: string;
  createNewAccount: string;
  orContinueWith: string;
  orSignUpWith: string;
  alreadyHaveAccount: string;
  loginWithExisting: string;
  invalidCredentials: string;
  errorLoggingIn: string;
  loggingIn: string;
  creatingAccount: string;
  accountCreated: string;
  passwordsDoNotMatch: string;
  mustAcceptTerms: string;
  errorCreatingAccount: string;
  registeredSuccessfully: string;
  redirectingToLogin: string;
  acceptTermsAndPolicy: string;
  notRegistered: string;

  // Game Dashboard
  gameDashboard: string;
  completeTasksEarnCoins: string;
  coinBalance: string;
  totalEarned: string;
  tasksCompleted: string;
  referrals: string;
  nextTaskAvailable: string;
  viewTasks: string;
  myTasks: string;
  viewCompleteTask: string;
  inviteFriendsEarn: string;
  viewCoinHistory: string;
  recentTransactions: string;
  viewAllTransactions: string;
  tryAgain: string;
  failedToLoad: string;
  transactions: string;
  backToDashboard: string;
  transactionHistory: string;
  viewAllCoinTransactions: string;
  currentBalance: string;
  coins: string;
  allTransactions: string;
  balanceAfter: string;
  noTransactionsYet: string;
  completeTasksToEarnCoins: string;
  bonusCoins: string;

  // Content Pages
  howToBuy: string;
  paymentMethods: string;
  branches: string;
  contact: string;
  theCompany: string;
  settings: string;

  // Common
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  confirm: string;
  back: string;
  next: string;
  loading: string;
  error: string;
  success: string;
  noResults: string;
  showMore: string;
  showLess: string;
  errorLoadingData: string;

  // Footer
  aboutUs: string;
  contactUs: string;
  termsAndConditions: string;
  privacyPolicy: string;
  faq: string;
  followUs: string;
}

export const translations: Record<Language, Translations> = {
  ENGLISH: {
    // Navigation
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    brands: 'Brands',
    cart: 'Cart',
    wishlist: 'Wishlist',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    search: 'Search',
    searchPlaceholder: 'Search products...',
    myAccount: 'My Account',

    // Product
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    price: 'Price',
    quantity: 'Quantity',
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Reviews',
    relatedProducts: 'Related Products',
    features: 'Features',
    originalProduct: 'Original product',
    qualityGuarantee: 'Quality guarantee',
    readyForShipping: 'Ready for immediate shipping',
    priceIncludesTaxes: 'Price includes taxes',
    noBrand: 'No brand',

    // Product Messages
    mustLoginToAddToCart: 'You must log in to add to cart',
    mustLoginToBuy: 'You must log in to buy',
    productNotAvailable: 'This product is not available',
    addedToCart: 'added to cart',
    errorAddingToCart: 'Error adding to cart',
    errorProcessingPurchase: 'Error processing purchase',

    // Cart
    shoppingCart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    emptyCartMessage: 'Add products to your cart to continue shopping',
    continuesShopping: 'Continue Shopping',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    freeShipping: 'Free Shipping',
    total: 'Total',
    removeItem: 'Remove',
    updateCart: 'Update Cart',
    clearCart: 'Empty cart',
    productRemovedFromCart: 'Product removed from cart',
    cartCleared: 'Cart cleared',
    errorUpdatingQuantity: 'Error updating quantity',
    errorRemovingProduct: 'Error removing product',
    errorClearingCart: 'Error clearing cart',
    loadingCart: 'Loading your cart...',
    productsInCart: 'Products in your cart',
    product: 'product',
    productsPlural: 'products',
    orderSummary: 'Order Summary',
    proceedToPayment: 'Proceed to payment',
    freeShippingOver: 'Free shipping on orders over $50',
    noImage: 'No image',

    // Wishlist
    myWishlist: 'My Wishlist',
    emptyWishlist: 'Your wishlist is empty',
    moveToCart: 'Move to Cart',

    // Checkout
    shippingAddress: 'Shipping Address',
    billingAddress: 'Billing Address',
    paymentMethod: 'Payment Method',
    placeOrder: 'Place Order',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    zipCode: 'ZIP Code',
    country: 'Country',

    // Orders
    myOrders: 'My Orders',
    orderNumber: 'Order #',
    orderDate: 'Order Date',
    orderStatus: 'Status',
    orderTotal: 'Total',
    viewDetails: 'View Details',
    trackOrder: 'Track Order',
    orderHistory: 'Order history',

    // Status
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',

    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    password: 'Password',
    confirmPassword: 'Confirm password',
    fullName: 'Full name',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot your password?',
    createNewAccount: 'Create new account',
    orContinueWith: 'Or continue with',
    orSignUpWith: 'Or sign up with',
    alreadyHaveAccount: 'Or',
    loginWithExisting: 'sign in with your existing account',
    invalidCredentials: 'Invalid credentials. Please try again.',
    errorLoggingIn: 'Error logging in. Try again.',
    loggingIn: 'Signing in...',
    creatingAccount: 'Creating account...',
    accountCreated: 'Account created!',
    passwordsDoNotMatch: 'Passwords do not match',
    mustAcceptTerms: 'You must accept the terms and conditions',
    errorCreatingAccount: 'Error creating account. Try again.',
    registeredSuccessfully: 'Registered Successfully!',
    redirectingToLogin: 'Redirecting to sign in...',
    acceptTermsAndPolicy: 'I accept the terms and conditions and privacy policy',
    notRegistered: 'Not Registered:',

    // Game Dashboard
    gameDashboard: 'Game Dashboard',
    completeTasksEarnCoins: 'Complete tasks and earn coins!',
    coinBalance: 'Coin Balance',
    totalEarned: 'Total Earned',
    tasksCompleted: 'Tasks Completed',
    referrals: 'Referrals',
    nextTaskAvailable: 'Next Task Available',
    viewTasks: 'View Tasks',
    myTasks: 'My Tasks',
    viewCompleteTask: 'View and complete tasks',
    inviteFriendsEarn: 'Invite friends & earn',
    viewCoinHistory: 'View coin history',
    recentTransactions: 'Recent Transactions',
    viewAllTransactions: 'View All Transactions',
    tryAgain: 'Try Again',
    failedToLoad: 'Failed to load',
    transactions: 'Transactions',
    backToDashboard: '← Back to Dashboard',
    transactionHistory: 'Transaction History',
    viewAllCoinTransactions: 'View all coin transactions',
    currentBalance: 'Current Balance',
    coins: 'coins',
    allTransactions: 'All Transactions',
    balanceAfter: 'Balance after',
    noTransactionsYet: 'No transactions yet',
    completeTasksToEarnCoins: 'Complete tasks to earn coins',
    bonusCoins: 'bonus coins',

    // Content Pages
    howToBuy: 'How to Buy',
    paymentMethods: 'Payment Methods',
    branches: 'Branches',
    contact: 'Contact',
    theCompany: 'The Company',
    settings: 'Settings',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noResults: 'No results found',
    showMore: 'Show More',
    showLess: 'Show Less',
    errorLoadingData: 'Error loading data',

    // Footer
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    termsAndConditions: 'Terms and Conditions',
    privacyPolicy: 'Privacy Policy',
    faq: 'FAQ',
    followUs: 'Follow Us',
  },

  SPANISH: {
    // Navigation
    home: 'Inicio',
    products: 'Productos',
    categories: 'Categorías',
    brands: 'Marcas',
    cart: 'Carrito',
    wishlist: 'Lista de Deseos',
    profile: 'Perfil',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    register: 'Registrarse',
    search: 'Buscar',
    searchPlaceholder: 'Buscar productos...',
    myAccount: 'Mi Cuenta',

    // Product
    addToCart: 'Agregar al Carrito',
    addToWishlist: 'Agregar a Lista de Deseos',
    removeFromWishlist: 'Quitar de Lista de Deseos',
    inStock: 'En Stock',
    outOfStock: 'Agotado',
    price: 'Precio',
    quantity: 'Cantidad',
    description: 'Descripción',
    specifications: 'Especificaciones',
    reviews: 'Reseñas',
    relatedProducts: 'Productos Relacionados',
    features: 'Características',
    originalProduct: 'Producto original',
    qualityGuarantee: 'Garantía de calidad',
    readyForShipping: 'Listo para envío inmediato',
    priceIncludesTaxes: 'Precio incluye impuestos',
    noBrand: 'Sin marca',

    // Product Messages
    mustLoginToAddToCart: 'Debes iniciar sesión para agregar al carrito',
    mustLoginToBuy: 'Debes iniciar sesión para comprar',
    productNotAvailable: 'Este producto no está disponible',
    addedToCart: 'agregado al carrito',
    errorAddingToCart: 'Error al agregar al carrito',
    errorProcessingPurchase: 'Error al procesar la compra',

    // Cart
    shoppingCart: 'Carrito de Compras',
    emptyCart: 'Tu carrito está vacío',
    emptyCartMessage: 'Añade productos a tu carrito para continuar con la compra',
    continuesShopping: 'Continuar Comprando',
    checkout: 'Finalizar Compra',
    subtotal: 'Subtotal',
    shipping: 'Envío',
    freeShipping: 'Envío Gratis',
    total: 'Total',
    removeItem: 'Eliminar',
    updateCart: 'Actualizar Carrito',
    clearCart: 'Vaciar carrito',
    productRemovedFromCart: 'Producto eliminado del carrito',
    cartCleared: 'Carrito vaciado',
    errorUpdatingQuantity: 'Error al actualizar cantidad',
    errorRemovingProduct: 'Error al eliminar producto',
    errorClearingCart: 'Error al vaciar carrito',
    loadingCart: 'Cargando tu carrito...',
    productsInCart: 'Productos en tu carrito',
    product: 'producto',
    productsPlural: 'productos',
    orderSummary: 'Resumen del Pedido',
    proceedToPayment: 'Proceder al pago',
    freeShippingOver: 'Envío gratis en compras superiores a $50',
    noImage: 'Sin imagen',

    // Wishlist
    myWishlist: 'Mi Lista de Deseos',
    emptyWishlist: 'Tu lista de deseos está vacía',
    moveToCart: 'Mover al Carrito',

    // Checkout
    shippingAddress: 'Dirección de Envío',
    billingAddress: 'Dirección de Facturación',
    paymentMethod: 'Método de Pago',
    placeOrder: 'Realizar Pedido',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    address: 'Dirección',
    city: 'Ciudad',
    state: 'Estado/Provincia',
    zipCode: 'Código Postal',
    country: 'País',

    // Orders
    myOrders: 'Mis Pedidos',
    orderNumber: 'Pedido #',
    orderDate: 'Fecha del Pedido',
    orderStatus: 'Estado',
    orderTotal: 'Total',
    viewDetails: 'Ver Detalles',
    trackOrder: 'Rastrear Pedido',
    orderHistory: 'Historial de pedidos',

    // Status
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',

    // Auth
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    fullName: 'Nombre completo',
    rememberMe: 'Recordarme',
    forgotPassword: '¿Olvidaste tu contraseña?',
    createNewAccount: 'Crear cuenta nueva',
    orContinueWith: 'O continúa con',
    orSignUpWith: 'O regístrate con',
    alreadyHaveAccount: 'O',
    loginWithExisting: 'iniciar sesión con tu cuenta existente',
    invalidCredentials: 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
    errorLoggingIn: 'Error al iniciar sesión. Inténtalo de nuevo.',
    loggingIn: 'Iniciando sesión...',
    creatingAccount: 'Creando cuenta...',
    accountCreated: '¡Cuenta creada!',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',
    mustAcceptTerms: 'Debes aceptar los términos y condiciones',
    errorCreatingAccount: 'Error al crear la cuenta. Inténtalo de nuevo.',
    registeredSuccessfully: '¡Registrado con Éxito!',
    redirectingToLogin: 'Redirigiendo al inicio de sesión...',
    acceptTermsAndPolicy: 'Acepto los términos y condiciones y la política de privacidad',
    notRegistered: 'No Registrado:',

    // Game Dashboard
    gameDashboard: 'Panel del Juego',
    completeTasksEarnCoins: '¡Completa tareas y gana monedas!',
    coinBalance: 'Saldo de Monedas',
    totalEarned: 'Total Ganado',
    tasksCompleted: 'Tareas Completadas',
    referrals: 'Referidos',
    nextTaskAvailable: 'Próxima Tarea Disponible',
    viewTasks: 'Ver Tareas',
    myTasks: 'Mis Tareas',
    viewCompleteTask: 'Ver y completar tareas',
    inviteFriendsEarn: 'Invita amigos y gana',
    viewCoinHistory: 'Ver historial de monedas',
    recentTransactions: 'Transacciones Recientes',
    viewAllTransactions: 'Ver Todas las Transacciones',
    tryAgain: 'Intentar de Nuevo',
    failedToLoad: 'Error al cargar',
    transactions: 'Transacciones',
    backToDashboard: '← Volver al Panel',
    transactionHistory: 'Historial de Transacciones',
    viewAllCoinTransactions: 'Ver todas las transacciones de monedas',
    currentBalance: 'Saldo Actual',
    coins: 'monedas',
    allTransactions: 'Todas las Transacciones',
    balanceAfter: 'Saldo después',
    noTransactionsYet: 'Sin transacciones aún',
    completeTasksToEarnCoins: 'Completa tareas para ganar monedas',
    bonusCoins: 'monedas de bonificación',

    // Content Pages
    howToBuy: 'Cómo Comprar',
    paymentMethods: 'Formas de Pago',
    branches: 'Sucursales',
    contact: 'Contacto',
    theCompany: 'La Empresa',
    settings: 'Configuración',

    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    back: 'Volver',
    next: 'Siguiente',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    noResults: 'No se encontraron resultados',
    showMore: 'Mostrar Más',
    showLess: 'Mostrar Menos',
    errorLoadingData: 'Error al cargar los datos',

    // Footer
    aboutUs: 'Sobre Nosotros',
    contactUs: 'Contáctanos',
    termsAndConditions: 'Términos y Condiciones',
    privacyPolicy: 'Política de Privacidad',
    faq: 'Preguntas Frecuentes',
    followUs: 'Síguenos',
  },

  PORTUGUESE: {
    // Navigation
    home: 'Início',
    products: 'Produtos',
    categories: 'Categorias',
    brands: 'Marcas',
    cart: 'Carrinho',
    wishlist: 'Lista de Desejos',
    profile: 'Perfil',
    login: 'Entrar',
    logout: 'Sair',
    register: 'Registrar',
    search: 'Buscar',
    searchPlaceholder: 'Buscar produtos...',
    myAccount: 'Minha Conta',

    // Product
    addToCart: 'Adicionar ao Carrinho',
    addToWishlist: 'Adicionar à Lista de Desejos',
    removeFromWishlist: 'Remover da Lista de Desejos',
    inStock: 'Em Estoque',
    outOfStock: 'Esgotado',
    price: 'Preço',
    quantity: 'Quantidade',
    description: 'Descrição',
    specifications: 'Especificações',
    reviews: 'Avaliações',
    relatedProducts: 'Produtos Relacionados',
    features: 'Características',
    originalProduct: 'Produto original',
    qualityGuarantee: 'Garantia de qualidade',
    readyForShipping: 'Pronto para envio imediato',
    priceIncludesTaxes: 'Preço inclui impostos',
    noBrand: 'Sem marca',

    // Product Messages
    mustLoginToAddToCart: 'Você deve fazer login para adicionar ao carrinho',
    mustLoginToBuy: 'Você deve fazer login para comprar',
    productNotAvailable: 'Este produto não está disponível',
    addedToCart: 'adicionado ao carrinho',
    errorAddingToCart: 'Erro ao adicionar ao carrinho',
    errorProcessingPurchase: 'Erro ao processar a compra',

    // Cart
    shoppingCart: 'Carrinho de Compras',
    emptyCart: 'Seu carrinho está vazio',
    emptyCartMessage: 'Adicione produtos ao seu carrinho para continuar comprando',
    continuesShopping: 'Continuar Comprando',
    checkout: 'Finalizar Compra',
    subtotal: 'Subtotal',
    shipping: 'Envio',
    freeShipping: 'Frete Grátis',
    total: 'Total',
    removeItem: 'Remover',
    updateCart: 'Atualizar Carrinho',
    clearCart: 'Esvaziar carrinho',
    productRemovedFromCart: 'Produto removido do carrinho',
    cartCleared: 'Carrinho esvaziado',
    errorUpdatingQuantity: 'Erro ao atualizar quantidade',
    errorRemovingProduct: 'Erro ao remover produto',
    errorClearingCart: 'Erro ao esvaziar carrinho',
    loadingCart: 'Carregando seu carrinho...',
    productsInCart: 'Produtos no seu carrinho',
    product: 'produto',
    productsPlural: 'produtos',
    orderSummary: 'Resumo do Pedido',
    proceedToPayment: 'Prosseguir para pagamento',
    freeShippingOver: 'Frete grátis em compras acima de $50',
    noImage: 'Sem imagem',

    // Wishlist
    myWishlist: 'Minha Lista de Desejos',
    emptyWishlist: 'Sua lista de desejos está vazia',
    moveToCart: 'Mover para o Carrinho',

    // Checkout
    shippingAddress: 'Endereço de Entrega',
    billingAddress: 'Endereço de Cobrança',
    paymentMethod: 'Método de Pagamento',
    placeOrder: 'Fazer Pedido',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    email: 'E-mail',
    phone: 'Telefone',
    address: 'Endereço',
    city: 'Cidade',
    state: 'Estado',
    zipCode: 'CEP',
    country: 'País',

    // Orders
    myOrders: 'Meus Pedidos',
    orderNumber: 'Pedido #',
    orderDate: 'Data do Pedido',
    orderStatus: 'Status',
    orderTotal: 'Total',
    viewDetails: 'Ver Detalhes',
    trackOrder: 'Rastrear Pedido',
    orderHistory: 'Histórico de pedidos',

    // Status
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',

    // Auth
    signIn: 'Entrar',
    signUp: 'Registrar',
    password: 'Senha',
    confirmPassword: 'Confirmar senha',
    fullName: 'Nome completo',
    rememberMe: 'Lembrar de mim',
    forgotPassword: 'Esqueceu sua senha?',
    createNewAccount: 'Criar nova conta',
    orContinueWith: 'Ou continue com',
    orSignUpWith: 'Ou registre-se com',
    alreadyHaveAccount: 'Ou',
    loginWithExisting: 'entre com sua conta existente',
    invalidCredentials: 'Credenciais inválidas. Por favor, tente novamente.',
    errorLoggingIn: 'Erro ao fazer login. Tente novamente.',
    loggingIn: 'Entrando...',
    creatingAccount: 'Criando conta...',
    accountCreated: 'Conta criada!',
    passwordsDoNotMatch: 'As senhas não coincidem',
    mustAcceptTerms: 'Você deve aceitar os termos e condições',
    errorCreatingAccount: 'Erro ao criar a conta. Tente novamente.',
    registeredSuccessfully: 'Registrado com Sucesso!',
    redirectingToLogin: 'Redirecionando para o login...',
    acceptTermsAndPolicy: 'Aceito os termos e condições e a política de privacidade',
    notRegistered: 'Não Registrado:',

    // Game Dashboard
    gameDashboard: 'Painel do Jogo',
    completeTasksEarnCoins: 'Complete tarefas e ganhe moedas!',
    coinBalance: 'Saldo de Moedas',
    totalEarned: 'Total Ganho',
    tasksCompleted: 'Tarefas Concluídas',
    referrals: 'Indicações',
    nextTaskAvailable: 'Próxima Tarefa Disponível',
    viewTasks: 'Ver Tarefas',
    myTasks: 'Minhas Tarefas',
    viewCompleteTask: 'Ver e completar tarefas',
    inviteFriendsEarn: 'Convide amigos e ganhe',
    viewCoinHistory: 'Ver histórico de moedas',
    recentTransactions: 'Transações Recentes',
    viewAllTransactions: 'Ver Todas as Transações',
    tryAgain: 'Tentar Novamente',
    failedToLoad: 'Falha ao carregar',
    transactions: 'Transações',
    backToDashboard: '← Voltar ao Painel',
    transactionHistory: 'Histórico de Transações',
    viewAllCoinTransactions: 'Ver todas as transações de moedas',
    currentBalance: 'Saldo Atual',
    coins: 'moedas',
    allTransactions: 'Todas as Transações',
    balanceAfter: 'Saldo após',
    noTransactionsYet: 'Nenhuma transação ainda',
    completeTasksToEarnCoins: 'Complete tarefas para ganhar moedas',
    bonusCoins: 'moedas bônus',

    // Content Pages
    howToBuy: 'Como Comprar',
    paymentMethods: 'Formas de Pagamento',
    branches: 'Filiais',
    contact: 'Contato',
    theCompany: 'A Empresa',
    settings: 'Configurações',

    // Common
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    confirm: 'Confirmar',
    back: 'Voltar',
    next: 'Próximo',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    noResults: 'Nenhum resultado encontrado',
    showMore: 'Mostrar Mais',
    showLess: 'Mostrar Menos',
    errorLoadingData: 'Erro ao carregar os dados',

    // Footer
    aboutUs: 'Sobre Nós',
    contactUs: 'Fale Conosco',
    termsAndConditions: 'Termos e Condições',
    privacyPolicy: 'Política de Privacidade',
    faq: 'Perguntas Frequentes',
    followUs: 'Siga-nos',
  },
};

export const getLanguageName = (lang: Language): string => {
  const names: Record<Language, string> = {
    ENGLISH: 'English',
    SPANISH: 'Español',
    PORTUGUESE: 'Português',
  };
  return names[lang];
};

export const getLanguageFlag = (lang: Language): string => {
  const flags: Record<Language, string> = {
    ENGLISH: '🇺🇸',
    SPANISH: '🇵🇾',
    PORTUGUESE: '🇧🇷',
  };
  return flags[lang];
};
