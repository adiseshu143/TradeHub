export const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(price || 0);

export const calculateDiscount = (original, current) => {
  if (!original || !current || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const orderStatusColor = (status) => {
  const map = {
    delivered: 'bg-green-50 text-green-700 border-green-200',
    shipped: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-amber-50 text-amber-700 border-amber-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[status] || 'bg-slate-50 text-slate-700 border-slate-200';
};

/**
 * Search and recommend products based on user query
 * Matches product name, category, and description
 * Returns sorted results with relevance score
 * 
 * @param {Array} products - Array of products to search
 * @param {string} searchTerm - User search query
 * @returns {Array} Products sorted by relevance
 */
export const searchAndRecommendProducts = (products, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return [];

  const term = searchTerm.toLowerCase().trim();
  const words = term.split(' ').filter(w => w.length > 0);

  const scored = products.map((product) => {
    let score = 0;
    const name = product.name?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    const highlights = (product.highlights || []).map(h => h.toLowerCase()).join(' ');

    // Exact name match (highest priority)
    if (name === term) score += 100;
    // Name contains search term
    else if (name.includes(term)) score += 50;

    // Category match
    if (category === term) score += 40;
    else if (category.includes(term)) score += 20;

    // Word-by-word matching
    words.forEach(word => {
      if (name.includes(word)) score += 15;
      if (category.includes(word)) score += 10;
      if (description.includes(word)) score += 5;
      if (highlights.includes(word)) score += 3;
    });

    // Boost high-rated products
    if (score > 0 && product.rating >= 4.5) score += 5;
    if (score > 0 && product.rating >= 4) score += 3;

    return { ...product, relevanceScore: score };
  });

  // Filter products with score > 0 and sort by relevance (descending) then by rating
  return scored
    .filter(p => p.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore || b.rating - a.rating);
};

/**
 * Get product recommendations based on a category and exclusions
 * Used to recommend related products
 * 
 * @param {Array} products - Array of all products
 * @param {string} currentCategory - Current product category
 * @param {Array} excludeIds - Product IDs to exclude
 * @param {number} limit - Max recommendations to return
 * @returns {Array} Recommended products
 */
export const getRelatedProducts = (products, currentCategory, excludeIds = [], limit = 4) => {
  return products
    .filter(p => p.category === currentCategory && !excludeIds.includes(p.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};