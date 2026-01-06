'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMarcasOpen, setIsMarcasOpen] = useState(false);
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };

    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  const getCurrentLanguage = () => {
    switch (i18n.language) {
      case 'es': return { flag: '/flag-paraguay.png', name: 'Español' };
      case 'pt': return { flag: '/flag-brazil.png', name: 'Português' };
      case 'en': return { flag: '/flag-usa.png', name: 'English' };
      default: return { flag: '/flag-paraguay.png', name: 'Español' };
    }
  };

  const brands = [
    'Apple',
    'Abercrombie', 'Calvin Klein', 'Chanel', 'Dior',
    'Dolce & Gabbana', 'Emporio Armani', 'Lacoste', 'Versace',
    'Perfumes Arabes', 'Ralph', 'Tommy', 'Yves'
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
                <img 
                  src={getCurrentLanguage().flag} 
                  alt={getCurrentLanguage().name}
                  className="w-5 h-4 object-cover rounded-sm"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">{getCurrentLanguage().name}</span>
                <svg className="w-3 h-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-600 z-[9999]">
                  <div className="py-1">
                    <button
                      onClick={() => changeLanguage('es')}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <img src="/flag-paraguay.png" alt="Paraguay" className="w-5 h-4 object-cover rounded-sm" />
                      <span>Español</span>
                    </button>
                    <button
                      onClick={() => changeLanguage('pt')}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <img src="/flag-brazil.png" alt="Brazil" className="w-5 h-4 object-cover rounded-sm" />
                      <span>Português</span>
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <img src="/flag-usa.png" alt="USA" className="w-5 h-4 object-cover rounded-sm" />
                      <span>English</span>
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
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {theme === 'light' ? t('theme.dark') : t('theme.light')}
              </span>
            </button>
            
            <span className="text-gray-400">|</span>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-base bg-emerald-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-emerald-600 transition-colors">Minha Conta</Link>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => {
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('userEmail');
                    setIsAuthenticated(false);
                    router.push('/');
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
        <div className="container mx-auto px-4 py-0.5">
          {/* First Row - Logo and Brand Name */}
          <div className="flex justify-center items-center mb-0.5">
            <img
              src="/logo-clubdeofertas.png"
              alt="Experience Club Logo"
              className="w-60 h-60 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="text-3xl font-bold text-gray-800 dark:text-white ml-4">Experience Club</span>
          </div>

          {/* Second Row - Navigation and Actions */}
          <div className="flex items-center justify-between pb-0.5">
            {/* Navigation Links - Desktop */}
            <div className="flex items-center">
              <nav className="hidden lg:flex space-x-4">
                <Link
                  href="/"
                  className={`text-lg font-bold ${pathname === '/' ? 'text-emerald-500' : 'text-gray-600 hover:text-emerald-500'}`}
                >
                  Início
                </Link>

                {/* Categorias Dropdown */}
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
                        {categories.map((category) => (
                          <Link 
                            key={category}
                            href={`/?search=${encodeURIComponent(category)}`}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Marcas Dropdown */}
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
                        {brands.map((brand) => (
                          <Link 
                            key={brand}
                            href={`/marcas/${brand.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded"
                          >
                            {brand}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Link
                  href="/contacto"
                  className="text-lg font-bold text-gray-600 hover:text-emerald-500"
                >
                  Fale Conosco
                </Link>
              </nav>
            </div>
            
            {/* Search and Action Buttons */}
            <div className="flex items-center space-x-2">
              <div className="relative hidden sm:block">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-4 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-gray-700 placeholder-gray-400 w-56"
                  />
                  <button 
                    type="submit"
                    className="absolute left-3 top-2 text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>
              
              <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute top-0 right-0 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-emerald-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <Link href="/" className="block py-2 text-gray-700 hover:text-emerald-500">Início</Link>
              <div className="py-2">
                <p className="font-medium text-gray-900 mb-2">Categorias</p>
                <div className="grid grid-cols-2 gap-1 ml-4">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/?search=${encodeURIComponent(category)}`}
                      className="py-1 text-sm text-gray-600 hover:text-emerald-500"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="py-2">
                <p className="font-medium text-gray-900 mb-2">Marcas</p>
                <div className="grid grid-cols-2 gap-1 ml-4">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/marcas/${brand.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                      className="py-1 text-sm text-gray-600 hover:text-emerald-500"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/contacto" className="block py-2 text-gray-700 hover:text-emerald-500">Fale Conosco</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}