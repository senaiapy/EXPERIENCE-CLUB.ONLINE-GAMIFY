// Currency conversion utilities

// Exchange rate: 1 USD = 7300 Guaraníes (adjust as needed)
export const USD_TO_GUARANI_RATE = 7300;

/**
 * Convert USD price to Paraguayan Guaraníes
 * @param usdPrice Price in USD
 * @returns Price in Guaraníes
 */
export function usdToGuarani(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_GUARANI_RATE);
}

/**
 * Format price in Guaraníes with proper locale formatting
 * @param guaraniPrice Price in Guaraníes
 * @returns Formatted price string with ₲ symbol
 */
export function formatGuaraniPrice(guaraniPrice: number): string {
  return `₲${guaraniPrice.toLocaleString('es-PY')}`;
}

/**
 * Convert USD to Guaraníes and format for display
 * @param usdPrice Price in USD
 * @returns Formatted Guaraní price string
 */
export function convertAndFormatPrice(usdPrice: number): string {
  const guaraniPrice = usdToGuarani(usdPrice);
  return formatGuaraniPrice(guaraniPrice);
}

/**
 * Format USD price for reference display
 * @param usdPrice Price in USD
 * @returns Formatted USD price string
 */
export function formatUsdPrice(usdPrice: number): string {
  return `$${usdPrice.toFixed(2)} USD`;
}

/**
 * Format price as ₲ without decimal places (no USD conversion)
 * Use this for frontend where prices are already in Guaraníes in DB
 * @param price Price already in Guaraníes
 * @returns Formatted Guaraní price string without decimals
 */
export function formatGuaraniPriceNoDecimals(price: number): string {
  return `₲${Math.round(price).toLocaleString('es-PY')}`;
}