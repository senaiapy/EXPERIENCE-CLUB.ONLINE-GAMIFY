'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface AdminSidebarProps {
  isOpen: boolean;
}

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(() => {
    const initialExpanded = [];
    if (pathname.startsWith('/admin/products') || pathname.startsWith('/admin/categories') || pathname.startsWith('/admin/inventory') || pathname.startsWith('/admin/brands')) {
      initialExpanded.push('products');
    }
    if (pathname.startsWith('/admin/orders')) {
      initialExpanded.push('orders');
    }
    if (pathname.startsWith('/admin/game')) {
      initialExpanded.push('game');
    }
    if (pathname.startsWith('/admin/reports')) {
      initialExpanded.push('reports');
    }
    if (pathname.startsWith('/admin/settings')) {
      initialExpanded.push('settings');
    }
    return initialExpanded.length > 0 ? initialExpanded : ['products'];
  });

  const toggleMenu = (menuKey: string) => {
    if (expandedMenus.includes(menuKey)) {
      setExpandedMenus(expandedMenus.filter(key => key !== menuKey));
    } else {
      setExpandedMenus([...expandedMenus, menuKey]);
    }
  };

  const isActive = (path: string) => {
    // Handle query parameters for orders
    if (path.includes('?')) {
      return pathname === path.split('?')[0] && window.location.search === path.split('?')[1];
    }
    return pathname === path;
  };

  const isParentActive = (paths: string[]) => {
    return paths.some(path => {
      // Handle exact match for submenu routes
      if (path.includes('/orders/') || path.includes('/reports/') || path.includes('/settings/')) {
        return pathname === path;
      }
      // Handle general startsWith for other paths
      return pathname.startsWith(path.split('?')[0]);
    });
  };

  const menuItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 002 2v0a2 2 0 00-2 2" />
        </svg>
      ),
      href: '/admin/dashboard'
    },
    {
      key: 'products',
      title: 'Produtos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      hasSubmenu: true,
      submenu: [
        { title: 'Lista de Produtos', href: '/admin/products' },
        { title: 'Adicionar Produto', href: '/admin/products/add' },
        { title: 'Categorias', href: '/admin/categories' },
        { title: 'Marcas', href: '/admin/brands' },
        { title: 'Inventário', href: '/admin/inventory' }
      ]
    },
    {
      key: 'orders',
      title: 'Pedidos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      hasSubmenu: true,
      submenu: [
        { title: 'Todos os Pedidos', href: '/admin/orders' },
        { title: 'Pedidos Pendentes', href: '/admin/orders/pending' },
        { title: 'Pedidos Completos', href: '/admin/orders/completed' },
        { title: 'Pedidos Cancelados', href: '/admin/orders/cancelled' }
      ]
    },
    {
      key: 'customers',
      title: 'Clientes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      href: '/admin/customers'
    },
    {
      key: 'game',
      title: 'Jogo',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a7 7 0 100-14 7 7 0 000 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
        </svg>
      ),
      hasSubmenu: true,
      submenu: [
        { title: 'Tarefas', href: '/admin/game/tasks' },
        { title: 'Progresso dos Usuários', href: '/admin/game/progress' },
        { title: 'Transações de Moedas', href: '/admin/game/transactions' }
      ]
    },
    {
      key: 'reports',
      title: 'Relatórios',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      hasSubmenu: true,
      submenu: [
        { title: 'Vendas', href: '/admin/reports/sales' },
        { title: 'Produtos', href: '/admin/reports/products' },
        { title: 'Clientes', href: '/admin/reports/customers' },
        { title: 'Inventário', href: '/admin/reports/inventory' }
      ]
    },
    {
      key: 'settings',
      title: 'Configurações',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      hasSubmenu: true,
      submenu: [
        { title: 'Geral', href: '/admin/settings' },
        { title: 'Pagamentos', href: '/admin/settings/payments' },
        { title: 'Envios', href: '/admin/settings/shipping' },
        { title: 'Usuários', href: '/admin/settings/users' }
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg h-full">
      {/* Logo */}
      <div className={`flex items-center ${isOpen ? 'px-6 py-4' : 'px-3 py-4 justify-center'}`}>
        <img 
          src="/logo-clubdeofertas.png" 
          alt="Experience Club" 
          className={`${isOpen ? 'h-10 w-10' : 'h-8 w-8'} object-contain`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {isOpen && (
          <div className="ml-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Painel Admin</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Experience Club</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <div key={item.key}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isParentActive(item.submenu?.map(sub => sub.href) || [])
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    {isOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.title}</span>
                        <svg
                          className={`ml-2 h-4 w-4 transform transition-transform ${
                            expandedMenus.includes(item.key) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                  {isOpen && expandedMenus.includes(item.key) && item.submenu && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive(subItem.href)
                              ? 'bg-emerald-500 text-white'
                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href!)
                      ? 'bg-emerald-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}