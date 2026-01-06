'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CursosPage() {
  const cursos = [
    {
      id: 1,
      title: 'Marketing Digital para E-commerce',
      description: 'Aprenda estratégias completas de marketing digital focadas em e-commerce. Desde SEO até campanhas pagas.',
      duracao: '8 semanas',
      nivel: 'Intermediário',
      modulos: 12,
      image: '/cursos/marketing.jpg',
      topicos: ['SEO e SEM', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Analytics'],
      preco: 'G$ 1.500'
    },
    {
      id: 2,
      title: 'Gestão de Negócios Online',
      description: 'Domine as técnicas de gestão empresarial aplicadas ao mundo digital e aprenda a escalar seu negócio.',
      duracao: '10 semanas',
      nivel: 'Avançado',
      modulos: 15,
      image: '/cursos/gestao.jpg',
      topicos: ['Planejamento Estratégico', 'Gestão Financeira', 'Vendas Online', 'Logística', 'Atendimento'],
      preco: 'G$ 2.000'
    },
    {
      id: 3,
      title: 'Fotografia de Produtos',
      description: 'Aprenda técnicas profissionais de fotografia de produtos para melhorar suas vendas online.',
      duracao: '4 semanas',
      nivel: 'Iniciante',
      modulos: 8,
      image: '/cursos/fotografia.jpg',
      topicos: ['Iluminação', 'Composição', 'Edição', 'Background', 'Equipamentos'],
      preco: 'G$ 800'
    },
    {
      id: 4,
      title: 'Redes Sociais para Negócios',
      description: 'Estratégias completas para criar presença digital e engajamento nas principais redes sociais.',
      duracao: '6 semanas',
      nivel: 'Iniciante',
      modulos: 10,
      image: '/cursos/social.jpg',
      topicos: ['Instagram', 'Facebook', 'TikTok', 'Conteúdo', 'Engajamento'],
      preco: 'G$ 1.200'
    },
    {
      id: 5,
      title: 'Atendimento ao Cliente Excelente',
      description: 'Técnicas e estratégias para oferecer um atendimento ao cliente de excelência que fideliza.',
      duracao: '5 semanas',
      nivel: 'Iniciante',
      modulos: 9,
      image: '/cursos/atendimento.jpg',
      topicos: ['Comunicação', 'Resolução de Conflitos', 'WhatsApp Business', 'Fidelização', 'Pós-venda'],
      preco: 'G$ 900'
    },
    {
      id: 6,
      title: 'Desenvolvimento de E-commerce',
      description: 'Aprenda a criar e gerenciar sua própria loja virtual do zero, sem conhecimento técnico prévio.',
      duracao: '12 semanas',
      nivel: 'Intermediário',
      modulos: 18,
      image: '/cursos/ecommerce.jpg',
      topicos: ['Plataformas', 'Design UX', 'Pagamentos', 'Logística', 'Segurança'],
      preco: 'G$ 2.500'
    }
  ];

  const beneficios = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Aulas ao Vivo',
      desc: 'Interaja com instrutores em tempo real'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Material Exclusivo',
      desc: 'PDFs, templates e ferramentas'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Certificado',
      desc: 'Certificado digital ao concluir'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Acesso Vitalício',
      desc: 'Revise o conteúdo quando quiser'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-center">Cursos Online</h1>
          <p className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Aprenda com especialistas e impulsione sua carreira no mundo digital. Cursos práticos e aplicáveis ao mercado.
          </p>
          <div className="flex justify-center">
            <Link
              href="/contacto"
              className="bg-white text-indigo-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors"
            >
              Matricule-se Agora
            </Link>
          </div>
        </div>
      </div>

      {/* Cursos Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3 sm:mb-4">Nossos Cursos</h2>
        <p className="text-sm sm:text-base text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          Escolha o curso ideal para você e comece a transformar sua carreira hoje mesmo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {cursos.map((curso) => (
            <div key={curso.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              {/* Image placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-indigo-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-24 h-24 text-indigo-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {curso.nivel}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{curso.title}</h3>
                <p className="text-gray-600 mb-4">{curso.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {curso.duracao}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {curso.modulos} módulos
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Você vai aprender:</h4>
                  <div className="flex flex-wrap gap-1">
                    {curso.topicos.slice(0, 3).map((topico, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">
                        {topico}
                      </span>
                    ))}
                    {curso.topicos.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{curso.topicos.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-indigo-600">{curso.preco}</span>
                  </div>
                  <Link
                    href="/contacto"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Inscrever-se
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefícios Section */}
      <div className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Por Que Escolher Nossos Cursos?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {beneficios.map((beneficio, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  {beneficio.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{beneficio.title}</h3>
                <p className="text-gray-600 text-sm">{beneficio.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Depoimentos Section */}
      <div className="bg-gray-100 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">O Que Dizem Nossos Alunos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: 'Maria Silva',
                curso: 'Marketing Digital',
                depoimento: 'O curso mudou minha forma de trabalhar! Agora consigo gerar muito mais vendas através do Instagram e Facebook.',
                rating: 5
              },
              {
                name: 'João Santos',
                curso: 'Gestão de Negócios',
                depoimento: 'Aprendi a organizar meu negócio de forma profissional. O faturamento aumentou 300% em 3 meses!',
                rating: 5
              },
              {
                name: 'Ana Costa',
                curso: 'Fotografia de Produtos',
                depoimento: 'As técnicas de fotografia que aprendi fizeram toda diferença nas minhas vendas. Super recomendo!',
                rating: 5
              }
            ].map((depoimento, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex mb-3">
                  {[...Array(depoimento.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{depoimento.depoimento}"</p>
                <div>
                  <p className="font-bold text-gray-900">{depoimento.name}</p>
                  <p className="text-sm text-gray-500">{depoimento.curso}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Pronto para Começar?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Matricule-se agora e comece sua jornada de aprendizado com os melhores cursos do mercado!
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors"
          >
            Fale Conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
