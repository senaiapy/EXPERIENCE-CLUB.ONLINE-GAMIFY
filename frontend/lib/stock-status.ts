const POSITIVE_KEYWORDS = [
  'en stock',
  'disponible',
  'disponivel',
  'em estoque',
  'in stock',
  'available'
];

const NEGATIVE_KEYWORDS = [
  'agotado',
  'sin stock',
  'sem estoque',
  'out of stock',
  'no disponible'
];

function normalize(status?: string) {
  if (!status) {
    return '';
  }

  return status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function getAvailability(status?: string, stockQuantity?: number) {
  const normalized = normalize(status);
  const hasPositiveKeyword = POSITIVE_KEYWORDS.some((keyword) =>
    normalized.includes(keyword)
  );
  const hasNegativeKeyword = NEGATIVE_KEYWORDS.some((keyword) =>
    normalized.includes(keyword)
  );

  let isAvailable = false;

  if (typeof stockQuantity === 'number') {
    if (stockQuantity > 0) {
      isAvailable = true;
    } else if (stockQuantity <= 0) {
      isAvailable = false;
    }
  }

  if (!isAvailable && hasPositiveKeyword) {
    isAvailable = true;
  }

  if (hasNegativeKeyword) {
    isAvailable = false;
  }

  return {
    isAvailable,
    label: isAvailable ? 'En stock' : 'Agotado',
    raw: status?.trim() || '',
  };
}

export function getAvailabilityBadgeClasses(isAvailable: boolean) {
  return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
}
