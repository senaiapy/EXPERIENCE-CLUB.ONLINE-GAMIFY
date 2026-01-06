/**
 * Image Utility Functions for Admin Panel
 *
 * Provides centralized image URL construction and handling
 * for the Experience Club admin application.
 */

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:3062/images';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3062/api';

/**
 * Constructs full image URL from filename
 * @param filename - Image filename (e.g., "product-123.jpg")
 * @returns Full image URL
 */
export function getImageUrl(filename: string | null | undefined): string {
  if (!filename) {
    return getPlaceholderUrl();
  }

  // If filename already includes full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  // If filename starts with /images, construct full URL
  if (filename.startsWith('/images/')) {
    const imageFilename = filename.replace('/images/', '');
    return `${IMAGE_BASE_URL}/${imageFilename}`;
  }

  // Otherwise, just append filename to base URL
  return `${IMAGE_BASE_URL}/${filename}`;
}

/**
 * Gets product image URL from product data
 * @param product - Product object with images array
 * @returns Image URL or placeholder
 */
export function getProductImageUrl(product: any): string {
  // Check for images array (new schema)
  if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
    const primaryImage = product.images.find((img: any) => img.url) || product.images[0];
    return getImageUrl(primaryImage.url || primaryImage.filename);
  }

  // Check for single images property (legacy)
  if (product?.images && typeof product.images === 'string') {
    return getImageUrl(product.images);
  }

  // Fallback to placeholder
  return getPlaceholderUrl();
}

/**
 * Gets all product images URLs
 * @param product - Product object
 * @returns Array of image URLs
 */
export function getProductImageUrls(product: any): string[] {
  if (!product?.images) {
    return [getPlaceholderUrl()];
  }

  if (Array.isArray(product.images)) {
    return product.images
      .filter((img: any) => img.url || img.filename)
      .map((img: any) => getImageUrl(img.url || img.filename));
  }

  if (typeof product.images === 'string') {
    return [getImageUrl(product.images)];
  }

  return [getPlaceholderUrl()];
}

/**
 * Returns placeholder image URL
 */
export function getPlaceholderUrl(): string {
  return '/images/no-image.jpg';
}

/**
 * Checks if image URL is valid
 * @param url - Image URL to check
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://') ||
         url.startsWith('https://') ||
         url.startsWith('/images/');
}

/**
 * Uploads product image to backend
 * @param productId - Product ID
 * @param file - Image file to upload
 * @returns Promise with uploaded image data
 */
export async function uploadProductImage(
  productId: string,
  file: File
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/products/${productId}/public-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes product image from backend
 * @param imageId - Image ID to delete
 * @returns Promise with deletion result
 */
export async function deleteProductImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/products/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete image');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Gets optimized image URL with size parameter (if backend supports it)
 * @param filename - Image filename
 * @param size - Desired size (small, medium, large)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  filename: string | null | undefined,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const url = getImageUrl(filename);

  // If backend supports size parameter, append it
  // For now, just return the URL as is
  return url;
}

/**
 * Constructs brand image URL
 * @param brand - Brand object with logo property
 */
export function getBrandImageUrl(brand: any): string {
  if (brand?.logo) {
    return getImageUrl(brand.logo);
  }
  return getPlaceholderUrl();
}

/**
 * Constructs category image URL
 * @param category - Category object with image property
 */
export function getCategoryImageUrl(category: any): string {
  if (category?.image) {
    return getImageUrl(category.image);
  }
  return getPlaceholderUrl();
}

/**
 * Validates image file before upload
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.',
    };
  }

  return { valid: true };
}

/**
 * Downloads image from URL and saves to backend public/images folder
 * @param productId - Product ID
 * @param imageUrl - External image URL to download
 * @returns Promise with download result
 */
export async function downloadImageFromUrl(
  productId: string,
  imageUrl: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error('Invalid image URL. Must start with http or https');
    }

    const response = await fetch(`${API_URL}/products/${productId}/download-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to download image');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('Error downloading image from URL:', error);
    return { success: false, error: error.message };
  }
}
