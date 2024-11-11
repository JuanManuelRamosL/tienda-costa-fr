import { create } from 'zustand'

const useStore = create((set) => ({
  products: [
    { id: 1, name: "Camiseta", price: 19.99, description: "Una cómoda camiseta de algodón" },
    { id: 2, name: "Pantalones", price: 39.99, description: "Pantalones vaqueros de alta calidad" },
    { id: 3, name: "Zapatos", price: 59.99, description: "Zapatos elegantes y duraderos" },
  ],
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  removeProduct: (id) => set((state) => ({ 
    products: state.products.filter(product => product.id !== id) 
  })),
}))

export default useStore