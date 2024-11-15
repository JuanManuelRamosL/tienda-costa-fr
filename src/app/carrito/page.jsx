// Carrito.jsx
"use client"
import useStore from "../../../store";

const Carrito = () => {

  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      <div>
        {cart.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          cart.map((product) => (
            <div key={product.id}>
              <img src={product.image} alt={product.name} width={50} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => handleRemoveFromCart(product.id)}>
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
      <p>
        Total: ${cart.reduce((total, product) => total + product.price, 0)}
      </p>
    </div>
  );
};

export default Carrito;
