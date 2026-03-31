import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product._id);

      if (existing) {
        return prev.map(i =>
          i.id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          discount: product.discount || 0,
          quantity,
        }
      ];
    });
  };

  // ✅ Remove
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  // ✅ Update quantity
  const updateQuantity = (id, quantity) => {
    setCart(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, quantity: Math.max(1, quantity) }
          : i
      )
    );
  };

  // ✅ Clear
  const clearCart = () => setCart([]);

  // ✅ TOTAL (đã tính discount)
  const getCartTotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.price * (1 - (item.discount || 0) / 100);
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}