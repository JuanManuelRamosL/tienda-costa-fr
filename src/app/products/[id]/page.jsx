"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import useStore from "../../../../store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import StockModal from "@/components/modal";

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
  const [userDetails, setUserDetails] = useState(null);
  console.log(user);
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
    // Verificar si el stock es suficiente antes de proceder
    if (product.stock < 1) {
      alert("El producto no tiene stock suficiente para realizar la compra.");
      return; // Salir de la función si no hay stock suficiente
    }

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
      userId: userDetails.id,
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
            userId: userDetails.id,
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (user?.email) {
      fetchUserByEmail(user.email);
    }
  }, [user]);

  const fetchUserByEmail = async (email) => {
    try {
      const response = await fetch(
        `https://tienda-costa-bakend.vercel.app/api/users/email/${email}`
      );
      if (!response.ok) {
        throw new Error("Usuario no encontrado o error en la solicitud");
      }
      const data = await response.json();
      setUserDetails(data);
    } catch (err) {
      console.error("Error al obtener el usuario:", err);
      setError(err.message);
    }
  };
  console.log(userDetails);
  return (
    <>
      {/*  <Link href="/" className={styles.backLink}>
        &larr; Volver a la tienda 
      </Link> */}
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
              <div className={styles.containerSuperior}>
                <h2 className={styles.name}>{product.name}</h2>
                {/* <p className={styles.description}>{product.description}</p> */}

                <h1 className={styles.price}>${product.price}</h1>
                <p className={styles.textEnvio}>
                  Envío Gratis{" "}
                  <svg
                    width="33px"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 7H16.3373C16.5818 7 16.7041 7 16.8192 7.02763C16.9213 7.05213 17.0188 7.09253 17.1083 7.14736C17.2092 7.2092 17.2957 7.29568 17.4686 7.46863L21.5314 11.5314C21.7043 11.7043 21.7908 11.7908 21.8526 11.8917C21.9075 11.9812 21.9479 12.0787 21.9724 12.1808C22 12.2959 22 12.4182 22 12.6627V15.5C22 15.9659 22 16.1989 21.9239 16.3827C21.8224 16.6277 21.6277 16.8224 21.3827 16.9239C21.1989 17 20.9659 17 20.5 17M15.5 17H14M14 17V7.2C14 6.0799 14 5.51984 13.782 5.09202C13.5903 4.71569 13.2843 4.40973 12.908 4.21799C12.4802 4 11.9201 4 10.8 4H5.2C4.0799 4 3.51984 4 3.09202 4.21799C2.71569 4.40973 2.40973 4.71569 2.21799 5.09202C2 5.51984 2 6.0799 2 7.2V15C2 16.1046 2.89543 17 4 17M14 17H10M10 17C10 18.6569 8.65685 20 7 20C5.34315 20 4 18.6569 4 17M10 17C10 15.3431 8.65685 14 7 14C5.34315 14 4 15.3431 4 17M20.5 17.5C20.5 18.8807 19.3807 20 18 20C16.6193 20 15.5 18.8807 15.5 17.5C15.5 16.1193 16.6193 15 18 15C19.3807 15 20.5 16.1193 20.5 17.5Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </p>
                {product.stock > 0 ? (
                  <p className={styles.stockMessageDisponible}>Producto con stock disponible.</p>
                ) : (
                  <p className={styles.stockMessageNoDisponible}>Producto sin stock disponible.</p>
                )}

                <p className={styles.description}>
                  Stock: {product.stock} unidades
                </p>
              </div>
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

        {showModal && product.stock > 1 ? (
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
        ) : (
          <StockModal show={showModal} onClose={() => setShowModal(false)} />
        )}
      </div>
    </>
  );
}
