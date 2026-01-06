'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { brandsApi } from '../../../../lib/brands-api';
import { categoriesApi } from '../../../../lib/categories-api';
import { productsApi } from '../../../../lib/products-api';
import { downloadImageFromUrl } from '../../../../lib/image-utils';
import ImageUpload from '../../../../components/ImageUpload';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    marca: '',
    descricao: '',
    especificacao: '',
    descricao_completa: '',
    preco: '',
    preco_venta: '',
    disponibilidade: 'Disponible',
    ref: '',
    tags: '',
    imagem: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategoriesAndBrands();
  }, []);

  const loadCategoriesAndBrands = async () => {
    try {
      // Load categories and brands from API
      const [categoriesResponse, brandsResponse] = await Promise.all([
        categoriesApi.getCategories(),
        brandsApi.getBrands()
      ]);

      setCategories(categoriesResponse.data || []);
      setBrands(brandsResponse.data || []);
    } catch (error) {
      console.error('Error loading categories and brands from API:', error);
      setCategories([]);
      setBrands([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setDownloadMessage({ type: 'error', text: 'Tipo de archivo no válido. Solo se permiten JPG, PNG, GIF, WebP' });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setDownloadMessage({ type: 'error', text: 'Archivo demasiado grande. Máximo 10MB' });
        return;
      }

      setSelectedFile(file);
      setDownloadMessage(null);
    }
  };

  const handleUploadLocalFile = async () => {
    if (!selectedFile) {
      setDownloadMessage({ type: 'error', text: 'Por favor selecciona un archivo primero' });
      return;
    }

    setIsUploadingFile(true);
    setDownloadMessage(null);

    try {
      let productId = createdProductId;

      // If product doesn't exist yet, create it first
      if (!productId) {
        // Validate form before creating product
        if (!validateForm()) {
          setDownloadMessage({ type: 'error', text: 'Por favor completa todos los campos requeridos' });
          setIsUploadingFile(false);
          return;
        }

        console.log('Creating product first...');

        // Create the product
        const productData: any = {
          name: formData.nome,
          description: formData.descricao,
          price: parseFloat(formData.preco),
          stock: 0,
          brandId: formData.marca,
          categoryId: formData.categoria,
          imageUrl: '',
          stockStatus: formData.disponibilidade,
          specifications: formData.especificacao,
          details: formData.descricao_completa,
          referenceId: formData.ref,
          tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : [],
        };

        // Only add price_sale if it's a valid positive number
        const priceSale = parseFloat(formData.preco_venta);
        if (!isNaN(priceSale) && priceSale > 0) {
          productData.price_sale = priceSale;
        }

        console.log('Product data:', productData);

        const response = await productsApi.createProduct(productData);
        console.log('Create product response:', response);

        if (!response?.id) {
          console.error('Invalid response - missing product ID:', response);
          throw new Error('Error al crear el producto - respuesta inválida del servidor');
        }

        productId = response.id;
        console.log('Product created with ID:', productId);
        setCreatedProductId(productId);
        setDownloadMessage({ type: 'success', text: 'Producto creado. Subiendo imagen...' });

        // Add a small delay to ensure product is fully saved
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('Using product ID:', productId);

      // Upload the file
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/public-image`;
      console.log('Uploading to:', uploadUrl);
      console.log('File to upload:', selectedFile.name, selectedFile.type, selectedFile.size, 'bytes');

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      console.log('Upload response status:', uploadResponse.status, uploadResponse.statusText);

      if (!uploadResponse.ok) {
        let errorMessage = 'Error al subir la imagen';
        try {
          const errorData = await uploadResponse.json();
          console.error('Server error response:', errorData);
          errorMessage = errorData.message || `Error ${uploadResponse.status}: ${uploadResponse.statusText}`;
        } catch (e) {
          console.error('Could not parse error response:', e);
          errorMessage = `Error ${uploadResponse.status}: ${uploadResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload successful:', uploadResult);

      setDownloadMessage({ type: 'success', text: 'Imagen subida exitosamente!' });
      setSelectedFile(null);

      // Redirect after success
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (error: any) {
      console.error('Upload error:', error);
      setDownloadMessage({ type: 'error', text: error.message || 'Error al subir la imagen' });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!formData.imagem || !formData.imagem.startsWith('http')) {
      setDownloadMessage({ type: 'error', text: 'Por favor ingresa una URL válida de imagen' });
      return;
    }

    setIsDownloadingImage(true);
    setDownloadMessage(null);

    try {
      let productId = createdProductId;

      // If product doesn't exist yet, create it first
      if (!productId) {
        // Validate form before creating product
        if (!validateForm()) {
          setDownloadMessage({ type: 'error', text: 'Por favor completa todos los campos requeridos' });
          setIsDownloadingImage(false);
          return;
        }

        console.log('Creating product first (for URL download)...');

        // Create the product
        const productData: any = {
          name: formData.nome,
          description: formData.descricao,
          price: parseFloat(formData.preco),
          stock: 0,
          brandId: formData.marca,
          categoryId: formData.categoria,
          imageUrl: '', // Don't use imageUrl for auto-download during creation
          stockStatus: formData.disponibilidade,
          specifications: formData.especificacao,
          details: formData.descricao_completa,
          referenceId: formData.ref,
          tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : [],
        };

        // Only add price_sale if it's a valid positive number
        const priceSale = parseFloat(formData.preco_venta);
        if (!isNaN(priceSale) && priceSale > 0) {
          productData.price_sale = priceSale;
        }

        console.log('Product data (URL download):', productData);

        const response = await productsApi.createProduct(productData);
        console.log('Create product response (URL download):', response);

        if (!response?.id) {
          console.error('Invalid response - missing product ID:', response);
          throw new Error('Error al crear el producto - respuesta inválida del servidor');
        }

        productId = response.id;
        console.log('Product created with ID (URL download):', productId);
        setCreatedProductId(productId);
        setDownloadMessage({ type: 'success', text: 'Producto creado. Descargando imagen...' });

        // Add a small delay to ensure product is fully saved
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('Downloading image from URL:', formData.imagem, 'for product:', productId);

      // Download the image
      const result = await downloadImageFromUrl(productId, formData.imagem);
      console.log('Download image result:', result);

      if (result.success) {
        setDownloadMessage({ type: 'success', text: 'Imagen descargada y guardada exitosamente!' });
        // Redirect after success
        setTimeout(() => {
          router.push('/admin/products');
        }, 2000);
      } else {
        setDownloadMessage({ type: 'error', text: result.error || 'Error al descargar la imagen' });
      }
    } catch (error: any) {
      setDownloadMessage({ type: 'error', text: error.message || 'Error al descargar la imagen' });
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'El nombre es requerido';
    if (!formData.categoria.trim()) newErrors.categoria = 'La categoría es requerida';
    if (!formData.marca.trim()) newErrors.marca = 'La marca es requerida';
    if (!formData.descricao.trim()) newErrors.descricao = 'La descripción es requerida';
    if (!formData.preco.trim()) newErrors.preco = 'El precio es requerido';
    if (!formData.preco_venta.trim()) newErrors.preco_venta = 'El precio de venta es requerido';

    // Validate prices are numbers
    if (formData.preco && isNaN(parseFloat(formData.preco))) {
      newErrors.preco = 'El precio debe ser un número válido';
    }
    if (formData.preco_venta && isNaN(parseFloat(formData.preco_venta))) {
      newErrors.preco_venta = 'El precio de venta debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create product data for API
      const newProduct = {
        name: formData.nome,
        description: formData.descricao,
        specifications: formData.especificacao,
        details: formData.descricao_completa,
        price: parseFloat(formData.preco),
        price_sale: parseFloat(formData.preco_venta),
        stock: 100, // Default stock
        stockStatus: formData.disponibilidade,
        referenceId: formData.ref,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        brandId: formData.marca, // Now contains the brand ID
        categoryId: formData.categoria, // Now contains the category ID
        imageUrl: formData.imagem, // Image URL to download
      };

      // Call API to create product
      const createdProduct = await productsApi.createProduct(newProduct);

      // Store the created product ID for image upload
      setCreatedProductId(createdProduct.id);

      alert('Producto creado exitosamente! Ahora puedes subir una imagen.');
    } catch (error: any) {
      console.error('Error adding product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al agregar el producto';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agregar Producto</h1>
          <p className="text-gray-600 dark:text-gray-400">Completa la información del nuevo producto</p>
        </div>
        <Link
          href="/admin/products"
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ← Volver a Productos
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ej: Perfume Chanel No. 5"
                />
                {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
              </div>

              <div>
                <label htmlFor="ref" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Referencia
                </label>
                <input
                  type="text"
                  id="ref"
                  name="ref"
                  value={formData.ref}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: CH001"
                />
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoría *
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.categoria ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
              </div>

              <div>
                <label htmlFor="marca" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marca *
                </label>
                <select
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.marca ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Seleccionar marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.marca && <p className="mt-1 text-sm text-red-600">{errors.marca}</p>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Precios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="preco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio Original (Gs) *
                </label>
                <input
                  type="number"
                  step="1"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.preco ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ej: 250000"
                />
                {errors.preco && <p className="mt-1 text-sm text-red-600">{errors.preco}</p>}
              </div>

              <div>
                <label htmlFor="preco_venta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio de Venta (Gs) *
                </label>
                <input
                  type="number"
                  step="1"
                  id="preco_venta"
                  name="preco_venta"
                  value={formData.preco_venta}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.preco_venta ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ej: 230000"
                />
                {errors.preco_venta && <p className="mt-1 text-sm text-red-600">{errors.preco_venta}</p>}
              </div>

              <div>
                <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Disponibilidad
                </label>
                <select
                  id="disponibilidade"
                  name="disponibilidade"
                  value={formData.disponibilidade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Poco Stock">Poco Stock</option>
                  <option value="Agotado">Agotado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Descripciones</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción Corta *
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  rows={3}
                  value={formData.descricao}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.descricao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Descripción breve del producto..."
                />
                {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
              </div>

              <div>
                <label htmlFor="especificacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Especificaciones
                </label>
                <textarea
                  id="especificacao"
                  name="especificacao"
                  rows={3}
                  value={formData.especificacao}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Especificaciones técnicas del producto..."
                />
              </div>

              <div>
                <label htmlFor="descricao_completa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción Completa
                </label>
                <textarea
                  id="descricao_completa"
                  name="descricao_completa"
                  rows={4}
                  value={formData.descricao_completa}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Descripción detallada del producto..."
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Adicional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (separadas por comas)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="perfume, fragancia, elegante"
                />
              </div>

              <div className="space-y-4">
                {/* URL Download Option */}
                <div>
                  <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opción 1: Descargar desde URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      id="imagem"
                      name="imagem"
                      value={formData.imagem}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      disabled={isDownloadingImage || !formData.imagem}
                      className={`px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap ${
                        isDownloadingImage || !formData.imagem
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isDownloadingImage ? 'Descargando...' : 'Descargar URL'}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Pega una URL de imagen y haz clic en "Descargar URL"
                    {!createdProductId && ' (el producto se creará automáticamente)'}
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">O</span>
                  </div>
                </div>

                {/* Local File Upload Option */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opción 2: Seleccionar archivo local
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="file"
                        id="localImage"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="localImage"
                        className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedFile ? selectedFile.name : 'Seleccionar imagen...'}
                        </span>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleUploadLocalFile}
                      disabled={isUploadingFile || !selectedFile}
                      className={`px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap ${
                        isUploadingFile || !selectedFile
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {isUploadingFile ? 'Subiendo...' : 'Subir Archivo'}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Formatos: JPG, PNG, GIF, WebP - Máximo 10MB
                    {!createdProductId && ' (el producto se creará automáticamente)'}
                  </p>
                </div>

                {/* Message Display */}
                {downloadMessage && (
                  <div className={`p-3 rounded-lg ${downloadMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm ${downloadMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      {downloadMessage.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          {createdProductId && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subir Imagen</h2>
              <ImageUpload
                productId={createdProductId}
                currentImage={formData.imagem}
                onUploadSuccess={(data) => {
                  console.log('Image uploaded:', data);
                  alert('Imagen subida exitosamente! Redirigiendo...');
                  router.push('/admin/products');
                }}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                }}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </div>
              ) : (
                'Agregar Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}