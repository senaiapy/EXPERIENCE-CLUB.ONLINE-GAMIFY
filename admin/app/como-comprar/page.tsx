export default function ComoComprarPage() {
  // WhatsApp number from environment variable
  const whatsappNumber = process.env.NEXT_PUBLIC_ZAP_PHONE || '595991474601';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Cómo Comprar?
            </h1>
            <p className="text-emerald-100 text-lg">
              Guía paso a paso para realizar tu compra de forma fácil y segura
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Steps */}
          <div className="space-y-8 mb-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-8">
              <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8 text-2xl font-bold">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Explora Nuestros Productos</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Navega por nuestro catálogo y encuentra el perfume o producto que más te guste. 
                  Puedes usar el buscador o filtrar por marcas y categorías.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">Perfumes Masculinos</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">Perfumes Femeninos</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">Marcas Premium</span>
                </div>
              </div>
              <div className="w-32 h-32 bg-emerald-100 rounded-lg flex items-center justify-center mt-4 md:mt-0 md:ml-8">
                <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-8">
              <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8 text-2xl font-bold">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Agrega al Carrito</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Haz clic en "Agregar al Carrito" en el producto que te guste, o "Comprar Ahora" si quieres proceder directamente al pago. 
                  Puedes agregar varios productos y revisar tu carrito antes de finalizar.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium">
                    Agregar al Carrito
                  </button>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium">
                    Comprar Ahora
                  </button>
                </div>
              </div>
              <div className="w-32 h-32 bg-blue-100 rounded-lg flex items-center justify-center mt-4 md:mt-0 md:ml-8">
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-8">
              <div className="bg-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8 text-2xl font-bold">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Completa tus Datos</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Ingresa tu información de contacto y dirección de entrega. Si ya tienes una cuenta, simplemente inicia sesión. 
                  Si eres nuevo, puedes crear una cuenta o comprar como invitado.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Datos requeridos:</strong><br/>
                    • Nombre completo<br/>
                    • Teléfono<br/>
                    • Email<br/>
                    • Dirección
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Opciones:</strong><br/>
                    • Crear cuenta<br/>
                    • Compra como invitado<br/>
                    • Usar cuenta existente
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 bg-purple-100 rounded-lg flex items-center justify-center mt-4 md:mt-0 md:ml-8">
                <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-8">
              <div className="bg-yellow-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8 text-2xl font-bold">
                4
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Elige tu Método de Pago</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Selecciona la forma de pago que prefieras. Ofrecemos múltiples opciones seguras para tu comodidad, 
                  incluyendo descuentos especiales para algunos métodos.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded text-center">
                    💳<br/><strong>Tarjetas</strong><br/>Hasta 12 cuotas
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    🏛️<br/><strong>Transferencia</strong><br/>5% descuento
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    💵<br/><strong>Efectivo</strong><br/>10% descuento
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 bg-yellow-100 rounded-lg flex items-center justify-center mt-4 md:mt-0 md:ml-8">
                <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-8">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8 text-2xl font-bold">
                5
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirma tu Pedido</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Revisa todos los detalles de tu pedido antes de confirmar. Una vez confirmado, recibirás un email con los detalles de tu compra 
                  y el código de seguimiento.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-medium">
                    ✅ Recibirás confirmación por email<br/>
                    ✅ Código de seguimiento incluido<br/>
                    ✅ Notificaciones de WhatsApp disponibles
                  </p>
                </div>
              </div>
              <div className="w-32 h-32 bg-green-100 rounded-lg flex items-center justify-center mt-4 md:mt-0 md:ml-8">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">¿Necesitas Ayuda?</h2>
            <p className="mb-6">Nuestro equipo está disponible para ayudarte en todo momento</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={whatsappUrl}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.492"/>
                </svg>
                WhatsApp
              </a>
              <a 
                href="mailto:info@experienceclub.com" 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}