'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { cartApi } from '../lib/cart-api';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, getLanguageName, getLanguageFlag } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMarcasOpen, setIsMarcasOpen] = useState(false);
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load cart count from API
  useEffect(() => {
    const loadCartCount = async () => {
      if (isAuthenticated) {
        try {
          const cart = await cartApi.getCart();
          setCartCount(cart.itemCount || 0);
        } catch (error) {
          console.error('Error loading cart:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    loadCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Stay on /shop if currently on /shop page, otherwise go to home
      const basePath = pathname === '/shop' ? '/shop' : '/';
      router.push(`${basePath}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };

  const changeLanguage = (lng: 'ENGLISH' | 'SPANISH' | 'PORTUGUESE') => {
    setLanguage(lng);
    setIsLanguageOpen(false);
  };

  const brands = [
    'Apple',
    'Calvin Klein', 'Chanel', 'Dior',
    'Dolce Gabbana', 'Emporio Armani', 'Lacoste', 'Versace',
    'Ralph', 'Tommy', 'Yves'
  ];

  const categories = [
    'Apple',
    'Bebidas',
    'Beleza e Perfumaria',
    'Brinquedos',
    'Casa',
    'Cozinha',
    'Eletrônicos',
    'Informática',
    'Perfumes Femeninos',
    'Perfumes Masculinos',
    'Shop'
  ];
  
  return (
    <>
      {/* Top header with language selector and theme toggle */}
      <div className="bg-gray-100 dark:bg-gray-800 py-2">
        <div className="container mx-auto px-4 flex justify-end items-center">
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div
              className="relative"
              onMouseEnter={() => setIsLanguageOpen(true)}
              onMouseLeave={() => setIsLanguageOpen(false)}
            >
              <button className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="text-lg">{getLanguageFlag(language)}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300" suppressHydrationWarning>
                  {getLanguageName(language)}
                </span>
                <svg className="w-3 h-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-600 z-[9999]">
                  <div className="py-1">
                    <button
                      onClick={() => changeLanguage('PORTUGUESE')}
                      className={`flex items-center space-x-2 w-full px-3 py-2 text-sm ${
                        language === 'PORTUGUESE'
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                          : 'text-gray-700 dark:text-gray-300'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <span className="text-lg">{getLanguageFlag('PORTUGUESE')}</span>
                      <span>{getLanguageName('PORTUGUESE')}</span>
                    </button>
                    <button
                      onClick={() => changeLanguage('SPANISH')}
                      className={`flex items-center space-x-2 w-full px-3 py-2 text-sm ${
                        language === 'SPANISH'
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                          : 'text-gray-700 dark:text-gray-300'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <span className="text-lg">{getLanguageFlag('SPANISH')}</span>
                      <span>{getLanguageName('SPANISH')}</span>
                    </button>
                    <button
                      onClick={() => changeLanguage('ENGLISH')}
                      className={`flex items-center space-x-2 w-full px-3 py-2 text-sm ${
                        language === 'ENGLISH'
                          ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                          : 'text-gray-700 dark:text-gray-300'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <span className="text-lg">{getLanguageFlag('ENGLISH')}</span>
                      <span>{getLanguageName('ENGLISH')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <span className="text-gray-400">|</span>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <span className="text-sm text-gray-600 dark:text-gray-300" suppressHydrationWarning>
                {theme === 'light' ? t('theme.dark') : t('theme.light')}
              </span>
            </button>
            
            <span className="text-gray-400">|</span>
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">Olá, {user?.name || user?.email}</span>
                <span className="text-gray-400">|</span>
                <Link href="/dashboard" className="text-base bg-emerald-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-emerald-600 transition-colors">Minha Conta</Link>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="text-base bg-red-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-base bg-emerald-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-emerald-600 transition-colors">Entrar</Link>
                <span className="text-gray-400">|</span>
                <Link href="/auth/register" className="text-base bg-emerald-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-emerald-600 transition-colors">Cadastrar-se</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-1">
          {/* Single Row - Logo, Navigation, and Actions */}
          <div className="flex items-center justify-between pb-1">
            {/* Logo - Desktop (Left aligned) */}
            <Link href="/" className="hidden lg:flex items-center mr-6 cursor-pointer hover:opacity-80 transition-opacity">
              <img
                src="/logo-clubdeofertas.png"
                alt="Experience Club Logo"
                className="w-40 h-40 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="flex items-center justify-between w-full">
              <nav className="hidden lg:flex space-x-4">
                <Link
                  href="/"
                  className={`text-lg font-bold ${pathname === '/' ? 'text-emerald-500' : 'text-gray-600 hover:text-emerald-500'}`}
                >
                  Início
                </Link>

                {/* Categorias Dropdown - Hidden on specific pages */}
                {!pathname?.match(/^\/(game|cursos|servicos|franquias|contacto)/) && (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsCategoriasOpen(true)}
                    onMouseLeave={() => setIsCategoriasOpen(false)}
                  >
                    <button className="text-lg font-bold text-gray-600 hover:text-emerald-500 flex items-center">
                      Categorias
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isCategoriasOpen && (
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border z-[9998]">
                        <div className="p-4 grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                          {categories.map((category) => {
                            const basePath = pathname === '/shop' ? '/shop' : '/';
                            return (
                              <Link
                                key={category}
                                href={`${basePath}?search=${encodeURIComponent(category)}`}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded"
                              >
                                {category}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Marcas Dropdown - Hidden on specific pages */}
                {!pathname?.match(/^\/(game|cursos|servicos|franquias|contacto)/) && (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsMarcasOpen(true)}
                    onMouseLeave={() => setIsMarcasOpen(false)}
                  >
                    <button className="text-lg font-bold text-gray-600 hover:text-emerald-500 flex items-center">
                      Marcas
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isMarcasOpen && (
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border z-[9997]">
                        <div className="p-4 grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                          {brands.map((brand) => {
                            const basePath = pathname === '/shop' ? '/shop' : '/';
                            return (
                              <Link
                                key={brand}
                                href={`${basePath}?search=${encodeURIComponent(brand)}`}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded"
                              >
                                {brand}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cursos, Servicos, Franquias - Hidden on shop page */}
                {pathname !== '/shop' && (
                  <>
                    <Link
                      href="/cursos"
                      className={`text-lg font-bold ${pathname === '/cursos' ? 'text-emerald-500' : 'text-gray-600 hover:text-emerald-500'}`}
                    >
                      Cursos
                    </Link>

                    <Link
                      href="/servicos"
                      className={`text-lg font-bold ${pathname === '/servicos' ? 'text-emerald-500' : 'text-gray-600 hover:text-emerald-500'}`}
                    >
                      Serviços
                    </Link>

                    <Link
                      href="/franquias"
                      className={`text-lg font-bold ${pathname === '/franquias' ? 'text-emerald-500' : 'text-gray-600 hover:text-emerald-500'}`}
                    >
                      Franquias
                    </Link>
                  </>
                )}

                <Link
                  href="/contacto"
                  className="text-lg font-bold text-gray-600 hover:text-emerald-500"
                >
                  Fale Conosco
                </Link>
              </nav>

              {/* Game and Loja - Aligned to the right */}
              {isAuthenticated && (
                <div className="hidden lg:flex space-x-4 ml-auto">
                  <Link
                    href="/game"
                    className={`text-lg font-bold flex items-center ${pathname?.startsWith('/game') ? 'text-emerald-500' : 'text-gray-600 hover:text-emerald-500'}`}
                  >
                    <svg className="w-10 h-10 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                    </svg>
                    Game
                  </Link>
                  <Link
                    href="/shop"
                    className={`text-lg font-bold flex items-center ${pathname?.startsWith('/shop') ? 'text-emerald-500' : 'text-gray-600 hover:text-emerald-500'}`}
                  >
                    <svg className="w-10 h-10 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Loja
                  </Link>
                </div>
              )}
            </div>

            {/* Logo - Mobile */}
            <Link href="/" className="lg:hidden flex items-center mx-2 cursor-pointer hover:opacity-80 transition-opacity">
              <img
                src="/logo-clubdeofertas.png"
                alt="Experience Club Logo"
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Link>
            
            {/* Search and Action Buttons - Compact layout */}
            <div className="flex items-center space-x-1">
              {/* Search Bar - Hidden on specific pages */}
              {!pathname?.match(/^\/(game|cursos|servicos|franquias|contacto)/) && (
                <div className="relative">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="pl-3 pr-9 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-gray-700 placeholder-gray-400 w-32 sm:w-52"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2.5 text-black hover:text-emerald-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </form>
                </div>
              )}

              {/* Heart icon for wishlist beside search - Hidden on small screens and specific pages */}
              {!pathname?.match(/^\/(game|cursos|servicos|franquias|contacto)/) && (
                <Link href="/wishlist" className="hidden sm:block relative p-1.5 text-red-500 hover:text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </Link>
              )}

              {/* Cart icon - Hidden on small screens and specific pages */}
              {!pathname?.match(/^\/(game|cursos|servicos|franquias|contacto)/) && (
                <Link href="/cart" className="hidden sm:block relative p-1.5 text-gray-300 hover:text-gray-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-emerald-500 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-1.5 text-gray-700 hover:text-emerald-500"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="/" className="block py-2 text-gray-700 hover:text-emerald-500">Inicio</Link>

              {/* Mobile Cart and Wishlist Links - Hidden on specific pages */}
              {!pathname?.match(/^\/(game|cursos|servicos|franquias|contacto)/) && (
                <div className="sm:hidden flex gap-4 py-2 border-b">
                  <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-emerald-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Carrito {cartCount > 0 && `(${cartCount})`}</span>
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-2 text-red-500 hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>Favoritos</span>
                  </Link>
                </div>
              )}

              {/* Categorias - Hidden on specific pages */}
              {!pathname?.match(/^\/(game|cursos|servicos|franquias|contacto)/) && (
                <div className="py-2">
                  <p className="font-medium text-gray-900 mb-2">Categorías</p>
                  <div className="grid grid-cols-2 gap-1 ml-4">
                    {categories.map((category) => {
                      const basePath = pathname === '/shop' ? '/shop' : '/';
                      return (
                        <Link
                          key={category}
                          href={`${basePath}?search=${encodeURIComponent(category)}`}
                          className="py-1 text-sm text-gray-600 hover:text-emerald-500"
                        >
                          {category}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Marcas - Hidden on specific pages */}
              {!pathname?.match(/^\/(game|cursos|servicos|franquias|contacto)/) && (
                <div className="py-2">
                  <p className="font-medium text-gray-900 mb-2">Marcas</p>
                  <div className="grid grid-cols-2 gap-1 ml-4">
                    {brands.map((brand) => {
                      const basePath = pathname === '/shop' ? '/shop' : '/';
                      return (
                        <Link
                          key={brand}
                          href={`${basePath}?search=${encodeURIComponent(brand)}`}
                          className="py-1 text-sm text-gray-600 hover:text-emerald-500"
                        >
                          {brand}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cursos, Servicos, Franquias - Hidden on shop page */}
              {pathname !== '/shop' && (
                <>
                  <Link href="/cursos" className="block py-2 text-gray-700 hover:text-emerald-500">Cursos</Link>
                  <Link href="/servicos" className="block py-2 text-gray-700 hover:text-emerald-500">Serviços</Link>
                  <Link href="/franquias" className="block py-2 text-gray-700 hover:text-emerald-500">Franquias</Link>
                </>
              )}
              <Link href="/contacto" className="block py-2 text-gray-700 hover:text-emerald-500">Contáctenos</Link>

              {isAuthenticated && (
                <Link href="/game" className="flex items-center gap-2 py-2 text-gray-700 hover:text-emerald-500 border-t pt-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a7 7 0 100-14 7 7 0 000 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                  </svg>
                  <span>Jogo - Ganhe Moedas</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}