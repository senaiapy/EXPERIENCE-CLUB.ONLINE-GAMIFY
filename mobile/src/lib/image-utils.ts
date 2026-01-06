/**
 * Image Utility Functions for Mobile App
 *
 * Provides centralized image URL construction for React Native/Expo
 * Compatible with the Experience Club image server backend
 */

import { Env } from '@env';

const IMAGE_BASE_URL = Env.IMAGE_BASE_URL || 'https://api.experience-club.online/images';
const PLACEHOLDER_URL = 'https://via.placeholder.com/300x300/e5e5e5/999999?text=No+Image';

/**
 * Constructs full image URL from filename
 * @param filename - Image filename (e.g., "product-123.jpg") or URL
 * @returns Full image URL
 */
export function getImageUrl(filename: string | null | undefined): string {
  if (!filename) {
    return PLACEHOLDER_URL;
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
 * Handles multiple image formats from API
 * @param product - Product object with images array or string
 * @returns Image URL or placeholder
 */
export function getProductImageUrl(product: any): string {
  // Check for images array (new schema)
  if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];

    // Handle image object with url property
    if (firstImage.url) {
      return getImageUrl(firstImage.url);
    }

    // Handle image object with filename property
    if (firstImage.filename) {
      return getImageUrl(firstImage.filename);
    }

    // Handle string in array
    if (typeof firstImage === 'string') {
      return getImageUrl(firstImage);
    }
  }

  // Check for single images property (legacy string format)
  if (product?.images && typeof product.images === 'string') {
    return getImageUrl(product.images);
  }

  // Fallback to placeholder
  return PLACEHOLDER_URL;
}

/**
 * Gets all product images URLs
 * @param product - Product object
 * @returns Array of image URLs
 */
export function getProductImageUrls(product: any): string[] {
  if (!product?.images) {
    return [PLACEHOLDER_URL];
  }

  if (Array.isArray(product.images)) {
    return product.images
      .filter((img: any) => {
        if (typeof img === 'string') return true;
        return img?.url || img?.filename;
      })
      .map((img: any) => {
        if (typeof img === 'string') return getImageUrl(img);
        return getImageUrl(img.url || img.filename);
      });
  }

  if (typeof product.images === 'string') {
    return [getImageUrl(product.images)];
  }

  return [PLACEHOLDER_URL];
}

/**
 * Returns placeholder image URL
 */
export function getPlaceholderUrl(): string {
  return PLACEHOLDER_URL;
}

/**
 * Checks if image URL is valid
 * @param url - Image URL to check
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/images/')
  );
}

/**
 * Gets optimized image URL (placeholder for future optimization)
 * @param filename - Image filename
 * @param size - Desired size (small, medium, large)
 * @returns Image URL
 */
export function getOptimizedImageUrl(
  filename: string | null | undefined,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  // For now, return the regular URL
  // In the future, this could request different sizes from backend
  return getImageUrl(filename);
}

/**
 * Constructs brand image URL
 * @param brand - Brand object with logo property
 */
export function getBrandImageUrl(brand: any): string {
  if (brand?.logo) {
    return getImageUrl(brand.logo);
  }
  return PLACEHOLDER_URL;
}

/**
 * Constructs category image URL
 * @param category - Category object with image property
 */
export function getCategoryImageUrl(category: any): string {
  if (category?.image) {
    return getImageUrl(category.image);
  }
  return PLACEHOLDER_URL;
}

/**
 * Preloads an image for faster display
 * @param imageUrl - URL of image to preload
 */
export async function preloadImage(imageUrl: string): Promise<boolean> {
  try {
    // This is a placeholder - in React Native/Expo, you'd use Image.prefetch
    // For now, just return true
    return true;
  } catch (error) {
    console.error('Error preloading image:', error);
    return false;
  }
}

/**
 * Gets image cache key for local caching
 * @param imageUrl - URL of image
 * @returns Cache key string
 */
export function getImageCacheKey(imageUrl: string): string {
  // Simple cache key based on URL
  return imageUrl.replace(/[^a-z0-9]/gi, '_');
}
