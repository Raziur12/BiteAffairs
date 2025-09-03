// Menu data service
import jainMenuData from '../data/jain-menu.json';
import packagesMenuData from '../data/packages-menu.json';
import customizedMenuData from '../data/customized-menu.json';
import cocktailMenuData from '../data/cocktail-party-menu.json';

export const menuService = {
  getMenuData: (menuType) => {
    const menuData = {
      jain: jainMenuData,
      packages: packagesMenuData,
      customized: customizedMenuData,
      cocktail: cocktailMenuData
    };
    
    return menuData[menuType] || jainMenuData;
  },

  getAllMenus: () => ({
    jain: jainMenuData,
    packages: packagesMenuData,
    customized: customizedMenuData,
    cocktail: cocktailMenuData
  }),

  searchMenuItems: (searchQuery, dietaryFilter = 'all') => {
    const allMenus = menuService.getAllMenus();
    let allItems = [];

    // Collect all items from all menus
    Object.values(allMenus).forEach(menu => {
      if (menu.categories) {
        menu.categories.forEach(category => {
          if (category.items) {
            allItems = [...allItems, ...category.items.map(item => ({
              ...item,
              category: category.name,
              menuType: menu.title
            }))];
          }
        });
      }
    });

    // Apply filters
    return allItems.filter(item => {
      // Dietary filter
      const matchesDietary = dietaryFilter === 'all' || 
        (dietaryFilter === 'jain' && item.isJain) ||
        (dietaryFilter === 'veg' && item.isVeg && !item.isNonVeg) ||
        (dietaryFilter === 'non-veg' && item.isNonVeg);

      // Search filter
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDietary && matchesSearch;
    });
  }
};

export default menuService;
