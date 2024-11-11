import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.price}>${product.price.toFixed(2)}</p>
      <p className={styles.description}>{product.description}</p>
    </div>
  )
}