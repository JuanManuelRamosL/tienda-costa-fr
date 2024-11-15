"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import useStore from "../../../../store";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProductDetail() {
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
    telefono:""
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
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    console.log({
      title: product.name,
      price: product.price,
      quantity: 1,
      unit_price: Number(product.price),
      direccion: formData.direccion,
      nombre: formData.nombre,
      email: formData.email,
      telefono:formData.telefono
    })
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
            price: product.price,
            quantity: 1,
            unit_price: Number(product.price),
            direccion: formData.direccion,
            nombre: formData.nombre,
            email: formData.email,
            telefono:formData.telefono
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

  return (
<>
<Link href="/" className={styles.backLink}>
    &larr; Volver a la tienda
  </Link>
    <div className={styles.productDetail}>
 
    <img src={product.image} alt="" />
    <h2 className={styles.name}>{product.name}</h2>
    <p className={styles.description}>{product.description}</p>
    <p className={styles.price}>${product.price}</p>
    <button className={styles.buyButton} onClick={handleBuy}>
      Comprar
    </button>
    <button className={styles.removeButton} onClick={handleRemoveProduct}>
      Eliminar producto
    </button>

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
            Telefono:
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleFormSubmit}>Confirmar Compra</button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      </div>
    )}
  </div>
</>
   
  );
}
