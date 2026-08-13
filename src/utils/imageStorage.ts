const STORAGE_KEY = 'denlight_custom_product_images';

export const getCustomImagesMap = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Failed to parse custom product images from localStorage', e);
    return {};
  }
};

export const getProductImageUrl = (productId: string, defaultUrl: string): string => {
  const customMap = getCustomImagesMap();
  return customMap[productId] || defaultUrl;
};

export const hasCustomProductImage = (productId: string): boolean => {
  const customMap = getCustomImagesMap();
  return Boolean(customMap[productId]);
};

export const saveCustomProductImage = (productId: string, imageUrl: string): void => {
  try {
    const current = getCustomImagesMap();
    current[productId] = imageUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    // Dispatch custom event so components re-render immediately
    window.dispatchEvent(new Event('custom-images-updated'));
  } catch (e) {
    console.error('Failed to save custom image to localStorage', e);
  }
};

export const resetCustomProductImage = (productId: string): void => {
  try {
    const current = getCustomImagesMap();
    delete current[productId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('custom-images-updated'));
  } catch (e) {
    console.error('Failed to reset custom image in localStorage', e);
  }
};
