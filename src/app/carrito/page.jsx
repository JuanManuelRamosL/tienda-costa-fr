"use client";
import Link from "next/link";
import useStore from "../../../store";
import styles from "./Carrito.module.css"; // Importa los estilos personalizados

const Carrito = () => {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const totalPrice = cart.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.title}>
        Tu Carrito{" "}
        <svg
          width="35px"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 2H3.30616C3.55218 2 3.67519 2 3.77418 2.04524C3.86142 2.08511 3.93535 2.14922 3.98715 2.22995C4.04593 2.32154 4.06333 2.44332 4.09812 2.68686L4.57143 6M4.57143 6L5.62332 13.7314C5.75681 14.7125 5.82355 15.2031 6.0581 15.5723C6.26478 15.8977 6.56108 16.1564 6.91135 16.3174C7.30886 16.5 7.80394 16.5 8.79411 16.5H17.352C18.2945 16.5 18.7658 16.5 19.151 16.3304C19.4905 16.1809 19.7818 15.9398 19.9923 15.6342C20.2309 15.2876 20.3191 14.8247 20.4955 13.8988L21.8191 6.94969C21.8812 6.62381 21.9122 6.46087 21.8672 6.3335C21.8278 6.22177 21.7499 6.12768 21.6475 6.06802C21.5308 6 21.365 6 21.0332 6H4.57143ZM10 21C10 21.5523 9.55228 22 9 22C8.44772 22 8 21.5523 8 21C8 20.4477 8.44772 20 9 20C9.55228 20 10 20.4477 10 21ZM18 21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21C16 20.4477 16.4477 20 17 20C17.5523 20 18 20.4477 18 21Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </h2>
      <div className={styles.cartItems}>
        {cart.length === 0 ? (
          <>
            <div className={styles.containerCarritoVacio}>
              <p className={styles.emptyCart}>Tu carrito está vacío</p>
              <Link href="/" className={styles.buttonSeguirCompra}>
                Seguir comprando
              </Link>
            </div>
            <h3 className={styles.textLink}>
              Si tienes una cuenta{" "}
              <Link href="" className={styles.linkLogin}>
                <u>Inicia Sesión</u>
              </Link>{" "}
              para poder finalizar tus compras. <br />O{" "}
              <Link href="" className={styles.linkLogin}>
                <u>registrate</u>
              </Link>{" "}
              si no tenés una.
            </h3>
          </>
        ) : (
          cart.map((product) => (
            <div key={product.id} className={styles.cartItem}>
              <div className={styles.info}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.image}
                />
                <div className={styles.infoProduct}>
                  <h3 className={styles.name}>{product.name}</h3>
                  <p className={styles.price}>${product.price}</p>
                </div>
              </div>
              <div className={styles.containerButtonsCarrito}>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveFromCart(product.id)}
                >
                  Eliminar
                </button>
                <button className={styles.buttonComprar}>Comprar</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles.containerTotal}>
        <p className={styles.totalText}>
          Precio Total <span>${totalPrice}</span>
        </p>
        <button className={styles.buttonComprar}>Pagar Pedido</button>
      </div>
    </div>
  );
};

export default Carrito;
