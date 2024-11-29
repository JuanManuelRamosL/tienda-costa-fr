"use client";

import Link from "next/link";
import ProductCard from "../components/productCard";
import styles from "./page.module.css";
import useStore from "../../store";
import Nav from "@/components/nav";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCardTotal from "@/components/productCardTotal";

export default function Home() {
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);
  const { data: session, status } = useSession();

  const [currentPage, setCurrentPage] = useState(0);
  const [gridPage, setGridPage] = useState(0);
  const [filter, setFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 4;
  const gridItemsPerPage = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://tienda-costa-bakend.vercel.app/api/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, [setProducts]);

  // Filtrado solo para el carrusel
  const filteredProducts = products.filter((product) => {
    const matchesCategory = filter === "todos" || product.category === filter;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const gridTotalPages = Math.ceil(products.length / gridItemsPerPage); // Productos no filtrados en la tabla

  const startIndex = currentPage * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const gridStartIndex = gridPage * gridItemsPerPage;
  const currentGridProducts = products.slice(
    gridStartIndex,
    gridStartIndex + gridItemsPerPage
  ); // Productos no filtrados en la tabla

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    else setCurrentPage(0);
  };

  const handleGridPrevious = () => {
    if (gridPage > 0) setGridPage(gridPage - 1);
  };

  const handleGridNext = () => {
    if (gridPage < gridTotalPages - 1) setGridPage(gridPage + 1);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  return (
    <div>
      {/* <Nav /> */}
      <div className={styles.containerBuscador}>
        <input
          type="text"
          placeholder="Buscar producto"
          className={styles.buscador}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <svg
          width="30px"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          <path
            d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <select
          className={styles.filtro}
          onChange={handleFilterChange}
          value={filter}
        >
          <option value="todos">Todos</option>
          <option value="suplementos">Suplementos</option>
          <option value="ropa">Ropa</option>
        </select>
      </div>

      {/* Carrusel de productos */}
      <h2 className={styles.gridTitle}>Promociones</h2>
      <div className={styles.containerGrid}>
        <button
          onClick={handlePrevious}
          className={styles.scrollButtonPrev}
          disabled={currentPage === 0}
        >
          {"<"}
        </button>
        <div className={styles.productGrid}>
          {currentProducts.map((product, index) => (
            <div
              key={product.id}
              className={`${styles.productLink} ${styles.slideIn}`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <button
          onClick={handleNext}
          className={styles.scrollButtonNext}
          disabled={currentPage === totalPages - 1}
        >
          {">"}
        </button>
      </div>

      <div className={styles.gridContainerResponsive}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Grilla de todos los productos */}
      <h2 className={styles.gridTitleDos}>Todos los Productos</h2>
      <div className={styles.gridContainer}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <ProductCardTotal product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
