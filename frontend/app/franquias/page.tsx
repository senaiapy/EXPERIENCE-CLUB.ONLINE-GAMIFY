'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function FranquiasPage() {
  const vantagens = [
    {
      id: 1,
      title: 'Marca Reconhecida',
      description: 'Aproveite a força de uma marca já estabelecida no mercado paraguaio com anos de experiência.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Treinamento Completo',
      description: 'Capacitação completa para você e sua equipe em gestão, vendas e atendimento ao cliente.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Suporte Constante',
      description: 'Acompanhamento e suporte contínuo em todas as etapas do seu negócio.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Marketing e Publicidade',
      description: 'Estratégias de marketing e campanhas publicitárias desenvolvidas por especialistas.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Tecnologia Própria',
      description: 'Sistema de gestão integrado com plataforma de e-commerce e programa de fidelidade.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 6,
      title: 'Fornecedores Confiáveis',
      description: 'Acesso à nossa rede de fornecedores internacionais com produtos de qualidade.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const investimento = [
    { label: 'Taxa de Franquia', valor: 'A partir de ₲50.000.000' },
    { label: 'Investimento Total', valor: '₲150.000.000 - ₲300.000.000' },
    { label: 'Capital de Giro', valor: '₲30.000.000 - ₲50.000.000' },
    { label: 'Royalties', valor: '5% sobre faturamento' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-center">Seja um Franqueado</h1>
          <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Faça parte do nosso sucesso! Abra sua própria franquia Experience Club e tenha um negócio lucrativo com suporte completo.
          </p>
          <div className="flex justify-center">
            <Link
              href="/contacto"
              className="bg-white text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors"
            >
              Quero Ser Franqueado
            </Link>
          </div>
        </div>
      </div>

      {/* Vantagens Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3 sm:mb-4">Vantagens de Ser um Franqueado</h2>
        <p className="text-sm sm:text-base text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          Ao escolher nossa franquia, você terá acesso a um modelo de negócio comprovado e suporte completo para seu sucesso.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {vantagens.map((vantagem) => (
            <div key={vantagem.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-purple-600">
                {vantagem.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{vantagem.title}</h3>
              <p className="text-gray-600">{vantagem.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Investimento Section */}
      <div className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Investimento Necessário</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {investimento.map((item, idx) => (
                <div key={idx} className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                  <div className="text-sm text-purple-600 font-semibold mb-2">{item.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{item.valor}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-purple-600 text-white rounded-xl p-6 text-center">
              <p className="text-lg">
                <strong>Retorno do Investimento:</strong> Estimado entre 18 a 24 meses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Processo Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Como Funciona o Processo</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {[
              { step: '01', title: 'Cadastro Inicial', desc: 'Preencha o formulário de interesse e nossa equipe entrará em contato.' },
              { step: '02', title: 'Apresentação do Modelo', desc: 'Reunião para apresentação detalhada do modelo de negócio e oportunidades.' },
              { step: '03', title: 'Análise de Viabilidade', desc: 'Análise do perfil do candidato e viabilidade da região escolhida.' },
              { step: '04', title: 'Assinatura do Contrato', desc: 'Formalização da parceria com assinatura do contrato de franquia.' },
              { step: '05', title: 'Treinamento', desc: 'Capacitação completa de toda a equipe para operação da franquia.' },
              { step: '06', title: 'Inauguração', desc: 'Suporte completo na inauguração e primeiros meses de operação.' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="bg-purple-600 text-white text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 mr-6">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-2">Pronto para Começar sua Jornada?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Entre em contato conosco hoje mesmo e dê o primeiro passo para ter seu próprio negócio de sucesso!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/contacto"
              className="bg-white text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar Informações
            </Link>
            <a
              href="tel:+595123456789"
              className="bg-purple-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-purple-800 transition-colors"
            >
              Ligar Agora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
