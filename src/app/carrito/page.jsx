"use client";
import useStore from "../../../store";
import styles from "./Carrito.module.css"; // Importa los estilos personalizados

const Carrito = () => {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const totalPrice = cart.reduce((total, product) => total + product.price, 0);

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.title}>Carrito de Compras</h2>
      <div className={styles.cartItems}>
        {cart.length === 0 ? (
          <p className={styles.emptyCart}>No hay productos en el carrito.</p>
        ) : (
          cart.map((product) => (
            <div key={product.id} className={styles.cartItem}>
              <img src={product.image} alt={product.name} className={styles.image} />
              <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.price}>${product.price}</p>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveFromCart(product.id)}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
      <div className={styles.total}>
        <p>Total: <span>${totalPrice}</span></p>
      </div>
    </div>
  );
};

export default Carrito;
