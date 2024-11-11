'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
import useStore from '../../../../store'
import { useEffect } from 'react'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const productId = parseInt(params.id)
  const products = useStore((state) => state.products)
  const removeProduct = useStore((state) => state.removeProduct)

  const product = products.find(p => p.id === productId)

  useEffect(() => {
    // Cargar el script de MercadoPago
    const script = document.createElement('script');
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  if (!product) {
    return <div>Producto no encontrado</div>
  }

  const handleRemoveProduct = () => {
    removeProduct(product.id)
    router.push('/')
  }

  const handleBuy = async () => {
    try {
      console.log('Iniciando solicitud de creación de preferencia');
      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: product.name,
          price: product.price,
          quantity: 1,
        }),
      });
  
      console.log('Respuesta recibida:', response.status, response.statusText);
      
      if (!response.ok) {
        const textResponse = await response.text();
        console.error('Respuesta de error:', textResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Datos de respuesta:', data);
  
      // ... resto del código para inicializar el checkout
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
    }
  }

  return (
    <div className={styles.productDetail}>
      <Link href="/" className={styles.backLink}>&larr; Volver a la tienda</Link>
      <h2 className={styles.name}>{product.name}</h2>
      <p className={styles.price}>${product.price.toFixed(2)}</p>
      <p className={styles.description}>{product.description}</p>
      <button className={styles.buyButton} onClick={handleBuy}>
        Comprar con Mercado Pago
      </button>
      <div className={styles.choContainer}></div>
      <button className={styles.removeButton} onClick={handleRemoveProduct}>
        Eliminar producto
      </button>
    </div>
  )
}