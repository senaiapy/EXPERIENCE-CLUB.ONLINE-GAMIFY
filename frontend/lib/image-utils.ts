/**
 * Image Utility Functions
 *
 * Provides centralized image URL construction and handling
 * for the Experience Club frontend application.
 */

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:3062/images';

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
