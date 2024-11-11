import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <h1>Mi Tienda</h1>
        </header>
        <main className="main-content">
          {children}
        </main>
        <footer className="footer">
          <p>&copy; 2023 Mi Tienda. Todos los derechos reservados.</p>
        </footer>
      </body>
    </html>
  )
}