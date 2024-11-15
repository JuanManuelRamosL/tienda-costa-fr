/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true, // Para alertas de errores en desarrollo
	onDemandEntries: {
	  // Configuración para las recargas automáticas
	  maxInactiveAge: 60 * 1000, // 60 segundos antes de eliminar páginas no activas
	  pagesBufferLength: 5, // Mantiene 5 páginas en el buffer de desarrollo
	},
  };
  
  export default nextConfig;
  