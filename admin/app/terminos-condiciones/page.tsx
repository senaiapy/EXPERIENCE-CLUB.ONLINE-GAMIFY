export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-gray-200 text-lg">
              Condiciones de uso de nuestro sitio web y servicios
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Última actualización:</strong> Enero 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Aceptación de Términos</h2>
              <p className="text-gray-600 leading-relaxed">
                Al acceder y utilizar el sitio web de Experience Club, usted acepta estar sujeto a estos términos y condiciones de uso. 
                Si no está de acuerdo con algún aspecto de estos términos, no debe utilizar nuestro sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Descripción del Servicio</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Experience Club es una plataforma de comercio electrónico que ofrece:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Venta de perfumes originales de marcas reconocidas</li>
                <li>Productos de belleza y cuidado personal</li>
                <li>Accesorios y productos relacionados</li>
                <li>Servicios de entrega y atención al cliente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Registro y Cuenta de Usuario</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Para realizar compras, debe crear una cuenta proporcionando información veraz y actualizada. 
                Es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Precios y Pagos</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>• Los precios están expresados en dólares estadounidenses (USD)</p>
                <p>• Los precios pueden cambiar sin previo aviso</p>
                <p>• Aceptamos múltiples formas de pago (tarjetas, transferencias, efectivo)</p>
                <p>• Los pagos deben ser confirmados antes del envío</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Envíos y Entregas</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>• Realizamos envíos dentro del territorio paraguayo</p>
                <p>• Los tiempos de entrega varían según la ubicación (1-5 días hábiles)</p>
                <p>• El costo de envío se calcula al momento de la compra</p>
                <p>• También ofrecemos retiro en sucursal sin costo adicional</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Política de Devoluciones</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>• Aceptamos devoluciones dentro de los 15 días posteriores a la compra</p>
                <p>• Los productos deben estar en su empaque original y sin usar</p>
                <p>• Los gastos de envío de devolución corren por cuenta del cliente</p>
                <p>• No se aceptan devoluciones de productos personalizados</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Garantía de Originalidad</h2>
              <p className="text-gray-600 leading-relaxed">
                Garantizamos que todos nuestros productos son 100% originales y auténticos. 
                Trabajamos directamente con distribuidores autorizados y ofrecemos certificados de autenticidad cuando sea necesario.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Privacidad y Datos Personales</h2>
              <p className="text-gray-600 leading-relaxed">
                Protegemos su información personal de acuerdo con nuestra Política de Privacidad. 
                No compartimos sus datos con terceros sin su consentimiento, excepto cuando sea necesario para procesar su pedido.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Limitación de Responsabilidad</h2>
              <p className="text-gray-600 leading-relaxed">
                Experience Club no será responsable por daños indirectos, incidentales o consecuentes que puedan surgir del uso de nuestros productos o servicios, 
                más allá del valor del producto adquirido.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Modificaciones</h2>
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contacto</h2>
              <div className="text-gray-600 leading-relaxed space-y-2">
                <p>Si tiene preguntas sobre estos términos y condiciones, puede contactarnos:</p>
                <p>• Email: info@experienceclub.com</p>
                <p>• WhatsApp: +595 981 234 567</p>
                <p>• Dirección: Asunción, Paraguay</p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                © 2025 Experience Club. Todos los derechos reservados. | Paraguay
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}