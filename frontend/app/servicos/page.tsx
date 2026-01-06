'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ServicosPage() {
  const servicos = [
    {
      id: 1,
      name: 'Consultoria de Compras',
      description: 'Ajudamos você a encontrar os melhores produtos com curadoria especializada e recomendações personalizadas.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      benefits: ['Atendimento personalizado', 'Sugestões de produtos', 'Melhor custo-benefício']
    },
    {
      id: 2,
      name: 'Programa de Fidelidade',
      description: 'Ganhe pontos a cada compra e troque por descontos exclusivos. Quanto mais você compra, mais você economiza!',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      benefits: ['Acumule pontos', 'Descontos exclusivos', 'Ofertas VIP']
    },
    {
      id: 3,
      name: 'Entrega Express',
      description: 'Receba seus produtos em tempo recorde com nosso serviço de entrega expressa em todo o Paraguai.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      benefits: ['Entrega rápida', 'Rastreamento em tempo real', 'Seguro incluído']
    },
    {
      id: 4,
      name: 'Suporte ao Cliente',
      description: 'Equipe dedicada para atender você 24/7 com suporte em português, espanhol e inglês.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      benefits: ['Suporte 24/7', 'Múltiplos idiomas', 'Chat ao vivo']
    },
    {
      id: 5,
      name: 'Garantia Estendida',
      description: 'Proteção adicional para seus produtos com garantia estendida de até 2 anos.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      benefits: ['Até 2 anos de garantia', 'Troca facilitada', 'Assistência técnica']
    },
    {
      id: 6,
      name: 'Personal Shopper',
      description: 'Serviço exclusivo de compras personalizadas para clientes VIP. Deixe que fazemos as compras por você!',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      benefits: ['Atendimento VIP', 'Compras personalizadas', 'Consultoria exclusiva']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-center">Nossos Serviços</h1>
          <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto px-2">
            Oferecemos uma experiência completa de compras com serviços exclusivos para garantir sua total satisfação.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {servicos.map((servico) => (
            <div key={servico.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-blue-600">
                {servico.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{servico.name}</h3>
              <p className="text-gray-600 mb-6">{servico.description}</p>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Benefícios:</h4>
                <ul className="space-y-2">
                  {servico.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-2">Pronto para experimentar nossos serviços?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-2">Entre em contato conosco e descubra como podemos ajudá-lo!</p>
          <Link
            href="/contacto"
            className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors"
          >
            Fale Conosco
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">10k+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">Suporte Disponível</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">98%</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">Taxa de Satisfação</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">5★</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">Avaliação Média</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
