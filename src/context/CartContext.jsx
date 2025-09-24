import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += Number(action.payload.quantity);
        return {
          ...state,
          items: updatedItems,
          totalItems: Number(state.totalItems) + Number(action.payload.quantity)
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          totalItems: Number(state.totalItems) + Number(action.payload.quantity)
        };
      }
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item => {
        if (item.id === action.payload.id) {
          const newQuantity = Math.max(0, action.payload.quantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
      
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: newTotalItems
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload.id);
      const totalAfterRemoval = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: filteredItems,
        totalItems: totalAfterRemoval
      };
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemQuantity = (id) => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
