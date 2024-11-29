"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import useStore from "../../../../store";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProductDetail() {
  const { addToCart } = useStore();
  const removeFromCart = useStore((state) => state.removeFromCart);
  const [fav, setFav] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id);
  const products = useStore((state) => state.products);
  const removeProduct = useStore((state) => state.removeProduct);
  const user = useStore((state) => state.user);
  const { data: session, status } = useSession();

  const product = products.find((p) => p.id === productId);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.name || "",
    email: user?.email || "",
    direccion: "",
    telefono: "",
    quantity: 1, // Nuevo campo para la cantidad
  });

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const handleRemoveProduct = () => {
    removeProduct(product.id);
    router.push("/");
  };

  const handleBuy = () => {
    setShowModal(true); // Muestra el modal cuando se hace clic en "Comprar"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value, // Asegura que quantity sea un entero mayor o igual a 1
    }));
  };

  const handleFormSubmit = async () => {
    const totalPrice = product.price * formData.quantity; // Calcula el precio total

    console.log({
      title: product.name,
      price: totalPrice, // Precio total enviado
      quantity: formData.quantity,
      unit_price: Number(product.price),
      direccion: formData.direccion,
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
    });

    try {
      const response = await fetch(
        "https://tienda-costa-bakend.vercel.app/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: product.name,
            price: totalPrice, // Precio total enviado
            quantity: formData.quantity,
            unit_price: Number(product.price),
            direccion: formData.direccion,
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      // Redirige al usuario al checkout de MercadoPago
      window.location.href = data.url;
    } catch (error) {
      console.error("Error al realizar la compra:", error);
    } finally {
      setShowModal(false); // Oculta el modal después de enviar la solicitud
    }
  };

  const handleAddToCart = () => {
    addToCart(product); // Agrega el producto al carrito
    setShowNotification(true); // Muestra la notificación
    setFav(false);
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    setFav(true);
  };

  return (
    <>
      <Link href="/" className={styles.backLink}>
        &larr; Volver a la tienda
      </Link>
      <div className={styles.productDetailGeneral}>
        <div className={styles.containerProduct}>
          <div className={styles.containerImageAndDetail}>
            <div className={styles.containerImage}>
              <img
                src={product.image}
                className={styles.image}
                alt="Imagen del Prodcuto"
              />
            </div>
            <div className={styles.containerDetails}>
              <h2 className={styles.name}>{product.name}</h2>
              {/* <p className={styles.description}>{product.description}</p> */}
              <p className={styles.price}>${product.price}</p>
              <div className={styles.containerButtons}>
                <button className={styles.buyButton} onClick={handleBuy}>
                  Comprar
                </button>
                {fav ? (
                  <button
                    className={styles.interacciones}
                    onClick={handleAddToCart}
                  >
                    <h3 onClick={handleAddToCart} className={styles.textAdd}>
                      Añadir al carrito
                    </h3>
                    <svg
                      width="35px"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.svg}
                    >
                      <path
                        d="M5.00014 14H18.1359C19.1487 14 19.6551 14 20.0582 13.8112C20.4134 13.6448 20.7118 13.3777 20.9163 13.0432C21.1485 12.6633 21.2044 12.16 21.3163 11.1534L21.9013 5.88835C21.9355 5.58088 21.9525 5.42715 21.9031 5.30816C21.8597 5.20366 21.7821 5.11697 21.683 5.06228C21.5702 5 21.4155 5 21.1062 5H4.50014M2 2H3.24844C3.51306 2 3.64537 2 3.74889 2.05032C3.84002 2.09463 3.91554 2.16557 3.96544 2.25376C4.02212 2.35394 4.03037 2.48599 4.04688 2.7501L4.95312 17.2499C4.96963 17.514 4.97788 17.6461 5.03456 17.7462C5.08446 17.8344 5.15998 17.9054 5.25111 17.9497C5.35463 18 5.48694 18 5.75156 18H19M7.5 21.5H7.51M16.5 21.5H16.51M8 21.5C8 21.7761 7.77614 22 7.5 22C7.22386 22 7 21.7761 7 21.5C7 21.2239 7.22386 21 7.5 21C7.77614 21 8 21.2239 8 21.5ZM17 21.5C17 21.7761 16.7761 22 16.5 22C16.2239 22 16 21.7761 16 21.5C16 21.2239 16.2239 21 16.5 21C16.7761 21 17 21.2239 17 21.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    className={styles.interaccionesDelete}
                    onClick={() => handleRemoveFromCart(product.id)}
                  >
                    <h3
                      onClick={() => handleRemoveFromCart(product.id)}
                      className={styles.textAdd}
                    >
                      Eliminar del carrito
                    </h3>
                    <svg
                      width="35px"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.00014 14H18.1359C19.1487 14 19.6551 14 20.0582 13.8112C20.4134 13.6448 20.7118 13.3777 20.9163 13.0432C21.1485 12.6633 21.2044 12.16 21.3163 11.1534L21.9013 5.88835C21.9355 5.58088 21.9525 5.42715 21.9031 5.30816C21.8597 5.20366 21.7821 5.11697 21.683 5.06228C21.5702 5 21.4155 5 21.1062 5H4.50014M2 2H3.24844C3.51306 2 3.64537 2 3.74889 2.05032C3.84002 2.09463 3.91554 2.16557 3.96544 2.25376C4.02212 2.35394 4.03037 2.48599 4.04688 2.7501L4.95312 17.2499C4.96963 17.514 4.97788 17.6461 5.03456 17.7462C5.08446 17.8344 5.15998 17.9054 5.25111 17.9497C5.35463 18 5.48694 18 5.75156 18H19M7.5 21.5H7.51M16.5 21.5H16.51M8 21.5C8 21.7761 7.77614 22 7.5 22C7.22386 22 7 21.7761 7 21.5C7 21.2239 7.22386 21 7.5 21C7.77614 21 8 21.2239 8 21.5ZM17 21.5C17 21.7761 16.7761 22 16.5 22C16.2239 22 16 21.7761 16 21.5C16 21.2239 16.2239 21 16.5 21C16.7761 21 17 21.2239 17 21.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className={styles.containerDescription}>
            <h1 className={styles.titleDescription}>Descripción:</h1>
            <p className={styles.description}>{product.description}</p>
          </div>
        </div>

        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Completa tus datos</h3>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Dirección:
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Teléfono:
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Cantidad:
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </label>
              <p className={styles.priceModal}>
                Total: ${product.price * formData.quantity}
              </p>
              <div className={styles.containerButtonsModal}>
                <button onClick={handleFormSubmit}>Confirmar Compra</button>
                <button onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
