import { create } from 'zustand';

const useStore = create((set) => ({
  products: [],
  user: null,
  cart: [],
  setProducts: (products) => set({ products }), // Función para establecer los productos
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  removeProduct: (id) => set((state) => ({ 
    products: state.products.filter(product => product.id !== id) 
  })),
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
  addToCart: (product) => set((state) => {
    const alreadyInCart = state.cart.some(item => item.id === product.id); // Verificar si ya está en el carrito
    if (!alreadyInCart) {
      return { cart: [...state.cart, product] };
    }
    return state; // No cambia el estado si ya está en el carrito
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(product => product.id !== productId),
  })),
}));

export default useStore;
