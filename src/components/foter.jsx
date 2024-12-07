import Link from 'next/link';
import styles from "./foter.module.css"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLinks}>
          <Link href="https://www.instagram.com" target="_blank" className={styles.footerLink}>
            <i className="fab fa-instagram"></i> Instagram
          </Link>
          <Link href="https://www.facebook.com" target="_blank" className={styles.footerLink}>
            <i className="fab fa-facebook-f"></i> Facebook
          </Link>
          <Link href="https://wa.me/1234567890" target="_blank" className={styles.footerLink}>
            <i className="fab fa-whatsapp"></i> WhatsApp
          </Link>
        </div>
        <p className={styles.footerText}>© 2024 Mi Tienda. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
