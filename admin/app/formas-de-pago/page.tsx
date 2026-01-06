export default function FormasDePagoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Formas de Pago
            </h1>
            <p className="text-blue-100 text-lg">
              Múltiples opciones de pago para tu comodidad
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Payment Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Credit Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tarjetas de Crédito</h3>
              <p className="text-gray-600 mb-4">Visa, MasterCard, American Express</p>
              <div className="text-sm text-green-600 font-medium">Hasta 12 cuotas sin interés</div>
            </div>

            {/* Debit Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tarjetas de Débito</h3>
              <p className="text-gray-600 mb-4">Visa Débito, MasterCard Débito</p>
              <div className="text-sm text-green-600 font-medium">Pago inmediato</div>
            </div>

            {/* Bank Transfer */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Transferencia Bancaria</h3>
              <p className="text-gray-600 mb-4">Todos los bancos de Paraguay</p>
              <div className="text-sm text-green-600 font-medium">Descuento del 5%</div>
            </div>

            {/* Cash */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Efectivo</h3>
              <p className="text-gray-600 mb-4">Pago al retirar en sucursal</p>
              <div className="text-sm text-green-600 font-medium">Descuento del 10%</div>
            </div>

            {/* PayPal */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.4-.033c-.524-.027-1.095-.041-1.608-.041h-4.303c-.524 0-.968.382-1.05.9L12.747 10.9c-.082.518.281.94.805.94h2.138c3.671 0 6.447-1.33 7.342-5.923z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">PayPal</h3>
              <p className="text-gray-600 mb-4">Pago seguro internacional</p>
              <div className="text-sm text-green-600 font-medium">Protección al comprador</div>
            </div>

            {/* Crypto */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 14.875c-.387 1.546-1.962 2.188-3.825 1.688l-.781 3.125-1.906-.475.781-3.125c-.5-.125-.988-.25-1.469-.375l-.781 3.156-1.906-.469.781-3.125c-.419-.094-.831-.194-1.231-.288l-.019.006-2.625-.656.506-1.969s1.406.25 1.375.25c.769.188 1.056-.313 1.125-.5l1.313-5.25c.031.006.063.019.094.031-.031-.006-.063-.019-.094-.031L8.5 3.594c-.094-.5-.5-.875-1.219-.688 0-.031-1.375-.344-1.375-.344L5.5 1.125l2.781.688c.5.125 1 .25 1.469.375l.781-3.125L12.438.531l-.781 3.125c.5.125 1 .281 1.5.406l.781-3.125L15.844 1.5l-.781 3.125c1.606.5 2.75 1.5 2.969 3.125.188 1.313-.25 2.063-1.125 2.5.813.438 1.313 1.125 1.125 2.25z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Criptomonedas</h3>
              <p className="text-gray-600 mb-4">Bitcoin, Ethereum, USDT</p>
              <div className="text-sm text-green-600 font-medium">Sin comisiones</div>
            </div>
          </div>

          {/* Payment Process */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Proceso de Pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-semibold text-gray-800 mb-2">Selecciona tu método</h3>
                <p className="text-gray-600 text-sm">Elige la forma de pago que prefieras</p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-semibold text-gray-800 mb-2">Completa el pago</h3>
                <p className="text-gray-600 text-sm">Ingresa los datos necesarios de forma segura</p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-semibold text-gray-800 mb-2">Recibe tu pedido</h3>
                <p className="text-gray-600 text-sm">Te enviamos tu compra o la retiras en sucursal</p>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8">
            <div className="text-center">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Seguridad Garantizada</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Todos los pagos son procesados de forma segura con encriptación SSL de 256 bits. 
                No almacenamos información sensible de tarjetas de crédito.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-700">SSL Certificado</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-700">PCI Compliant</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-700">Protección Antfraude</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}