"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useStore from "../../store";
import ProductCard from "../components/productCard";
import ProductCardTotal from "@/components/productCardTotal";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import Footer from "@/components/foter";
import '@fortawesome/fontawesome-free/css/all.min.css';
export default function Home() {
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);
  const { data: session, status } = useSession();

  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const allProductsPerPage = 5; // Productos por página en "Todos los Productos"
  const [allProductsPage, setAllProductsPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://tienda-costa-bakend.vercel.app/api/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = filter === "todos" || product.category === filter;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Paginación para "Todos los Productos"
  const allProductsTotalPages = Math.ceil(
    filteredProducts.length / allProductsPerPage
  );
  const allProductsStartIndex = allProductsPage * allProductsPerPage;
  const currentAllProducts = filteredProducts.slice(
    allProductsStartIndex,
    allProductsStartIndex + allProductsPerPage
  );

  const handlePreviousAllProducts = () => {
    if (allProductsPage > 0) setAllProductsPage(allProductsPage - 1);
  };

  const handleNextAllProducts = () => {
    if (allProductsPage < allProductsTotalPages - 1)
      setAllProductsPage(allProductsPage + 1);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <div className={styles.containerBuscador}>
        <input
          type="text"
          placeholder="Buscar producto"
          className={styles.buscador}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.filtro}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(0);
            setAllProductsPage(0);
          }}
          value={filter}
        >
          <option value="todos">Todos</option>
          <option value="suplementos">Suplementos</option>
          <option value="ropa">Ropa</option>
        </select>
      </div>

      {/* Promociones */}
      <h2 className={styles.gridTitle}>Promociones</h2>
      <div className={styles.containerGrid}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          className={styles.scrollButtonPrev}
          disabled={currentPage === 0}
        >
          {"<"}
        </button>
        <div className={styles.productGrid}>
          {loading
            ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                <div key={idx} className={styles.productLink}>
                  <div className={styles.card}>
                    <div className={styles.cardImagePlaceholder}></div>
                    <div className={styles.cardDetailsPlaceholder}>
                      <div className={styles.cardTitlePlaceholder}></div>
                      <div className={styles.cardPricePlaceholder}></div>
                    </div>
                  </div>
                </div>
              ))
            : currentProducts.map((product) => (
                <div key={product.id} className={styles.productLink}>
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          className={styles.scrollButtonNext}
          disabled={currentPage === totalPages - 1}
        >
          {">"}
        </button>
      </div>

      {/* Todos los Productos */}
      <h2 className={styles.gridTitleDos}>Todos los Productos</h2>
      <div className={styles.gridContainer}>
        {loading
          ? Array.from({ length: allProductsPerPage }).map((_, idx) => (
              <div key={idx} className={styles.productItem}>
                <div className={styles.card}>
                  <div className={styles.cardImagePlaceholder}></div>
                  <div className={styles.cardDetailsPlaceholder}>
                    <div className={styles.cardTitlePlaceholder}></div>
                    <div className={styles.cardPricePlaceholder}></div>
                  </div>
                </div>
              </div>
            ))
          : currentAllProducts.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <ProductCardTotal product={product} />
              </div>
            ))}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={handlePreviousAllProducts}
          disabled={allProductsPage === 0}
          className={styles.buttonsPaginacion}
        >
          Anterior
        </button>
        <span className={styles.textPagination}>
          Página {allProductsPage + 1} de {allProductsTotalPages}
        </span>
        <button
          onClick={handleNextAllProducts}
          disabled={allProductsPage === allProductsTotalPages - 1}
          className={styles.buttonsPaginacion}
        >
          Siguiente
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
}
