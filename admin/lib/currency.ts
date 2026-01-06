// Currency utilities for Experience Club Admin
// Backend stores USD prices, frontend converts to Guaraní for display

export const USD_TO_GUARANI_RATE = 7300;

/**
 * Convert USD price to Guaraní
 */
export function usdToGuarani(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_GUARANI_RATE);
}

/**
 * Convert Guaraní to USD
 */
export function guaraniToUsd(guaraniPrice: number): number {
  return Math.round((guaraniPrice / USD_TO_GUARANI_RATE) * 100) / 100;
}

/**
 * Format USD price for display
 */
export function formatUsdPrice(usdPrice: number): string {
  return `$${usdPrice.toFixed(2)}`;
}

/**
 * Format Guaraní price for display
 */
export function formatGuaraniPrice(guaraniPrice: number): string {
  return `₲${guaraniPrice.toLocaleString('es-PY')}`;
}

/**
 * Format price as ₲ without decimal places (no USD conversion)
 * Use this for admin panel where prices are already in Guaraníes in DB
 */
export function formatGuaraniPriceNoDecimals(price: number): string {
  return `₲${Math.round(price).toLocaleString('es-PY')}`;
}

/**
 * Convert USD to Guaraní and format for display
 */
export function convertAndFormatPrice(usdPrice: number): string {
  const guaraniPrice = usdToGuarani(usdPrice);
  return formatGuaraniPrice(guaraniPrice);
}

/**
 * Format price based on currency preference
 */
export function formatPrice(price: number, currency: 'USD' | 'PYG' = 'USD'): string {
  if (currency === 'USD') {
    return formatUsdPrice(price);
  } else {
    const guaraniPrice = usdToGuarani(price);
    return formatGuaraniPrice(guaraniPrice);
  }
}

/**
 * Parse price string to number (handles both USD and Guaraní formats)
 */
export function parsePrice(priceString: string): number {
  // Remove currency symbols and formatting (including Gs, $, ₲)
  const cleanPrice = priceString.replace(/[$₲,\s]|Gs/gi, '');
  const price = parseFloat(cleanPrice);

  // If it's a large number (>10000), assume it's Guaraní and convert to USD
  if (price > 10000) {
    return guaraniToUsd(price);
  }

  return price;
}