import { create } from 'zustand';

const useStore = create((set) => ({
  products: [],
  user: null,
  cart: [],
  purchases: [
    {
      name: "Remera Deportiva",
      price: 2000,
      shippingStatus: "Enviado",
      image: "https://http2.mlstatic.com/D_NQ_NP_649628-MLA50912086610_072022-O.webp",
    },
    {
      name: "Creatina ENA",
      price: 31000,
      shippingStatus: "En camino",
      image: "https://http2.mlstatic.com/D_NQ_NP_2X_882636-MLU75591903237_042024-F.webp",
    },
  ],
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
