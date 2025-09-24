// Menu Items Export Hub
import { jainMenuItems } from './jainMenuItems';
import { packageMenuItems } from './packageMenuItems';
import { customizedMenuItems } from './customizedMenuItems';
import { cocktailMenuItems } from './cocktailMenuItems';

// Menu Items Service
export const getMenuItems = (menuType, packageType = 'standard') => {
  switch (menuType) {
    case 'packages':
      return packageMenuItems[packageType] || packageMenuItems.standard;
    case 'jain':
      return jainMenuItems;
    case 'customized':
    case 'veg':
      return customizedMenuItems;
    case 'cocktail':
      return cocktailMenuItems;
    default:
      return jainMenuItems; // Default fallback
  }
};

// Get package types for package menu
export const getPackageTypes = () => {
  return Object.keys(packageMenuItems);
};

// Export individual menu items
export { 
  jainMenuItems, 
  packageMenuItems, 
  customizedMenuItems, 
  cocktailMenuItems 
};

export default {
  getMenuItems,
  getPackageTypes,
  jainMenuItems,
  packageMenuItems,
  customizedMenuItems,
  cocktailMenuItems
};
