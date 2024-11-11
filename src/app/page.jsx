'use client'

import Link from 'next/link'
import ProductCard from '../components/productCard'
import styles from './page.module.css'
import useStore from '../../store'

export default function Home() {
  const products = useStore((state) => state.products)

  return (
    <div>
      <h2 className={styles.title}>Nuestros Productos</h2>
      <div className={styles.productGrid}>
        {products.map(product => (
          <Link 
            href={`/products/${product.id}`}
            key={product.id} 
            className={styles.productLink}
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  )
}