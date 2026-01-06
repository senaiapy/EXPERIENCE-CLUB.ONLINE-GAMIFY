export default function LaEmpresaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              La Empresa
            </h1>
            <p className="text-emerald-100 text-lg">
              Conoce más sobre Experience Club y nuestra historia
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Experience Club nació en 2020 con la visión de democratizar el acceso a perfumes y productos de belleza de alta calidad en Paraguay. 
                Comenzamos como un pequeño emprendimiento familiar y hoy somos una de las tiendas online más confiables del país.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nuestra pasión por la belleza y la excelencia nos ha llevado a construir relaciones sólidas con los mejores distribuidores 
                internacionales, garantizando que cada producto que llega a nuestros clientes sea 100% original y auténtico.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Hoy, después de más de 4 años en el mercado, hemos entregado miles de productos y construido una comunidad de clientes 
                satisfechos que confían en nosotros para sus compras de belleza y cuidado personal.
              </p>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">Datos de la Empresa</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fundación:</span>
                  <span className="font-medium">2020</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ubicación:</span>
                  <span className="font-medium">Asunción, Paraguay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Productos:</span>
                  <span className="font-medium">1000+ referencias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marcas:</span>
                  <span className="font-medium">50+ marcas premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clientes:</span>
                  <span className="font-medium">Miles satisfechos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Misión</h3>
              <p className="text-gray-600">
                Ofrecer productos de belleza auténticos y de calidad, brindando una experiencia de compra excepcional 
                con el mejor servicio al cliente en Paraguay.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Visión</h3>
              <p className="text-gray-600">
                Ser la tienda online de belleza más reconocida y confiable de Paraguay, 
                expandiendo nuestro alcance a toda la región sudamericana.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Valores</h3>
              <p className="text-gray-600">
                Autenticidad, calidad, confianza, innovación y compromiso absoluto 
                con la satisfacción de nuestros clientes.
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nuestro Equipo</h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Contamos con un equipo apasionado y comprometido de especialistas en belleza, 
              atención al cliente y logística, todos trabajando para brindarte la mejor experiencia de compra.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold text-xl">A</span>
                </div>
                <h4 className="font-semibold text-gray-800">Área Comercial</h4>
                <p className="text-sm text-gray-600">Especialistas en productos</p>
              </div>
              
              <div>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-xl">S</span>
                </div>
                <h4 className="font-semibold text-gray-800">Servicio al Cliente</h4>
                <p className="text-sm text-gray-600">Atención personalizada</p>
              </div>
              
              <div>
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-xl">L</span>
                </div>
                <h4 className="font-semibold text-gray-800">Logística</h4>
                <p className="text-sm text-gray-600">Entregas eficientes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}