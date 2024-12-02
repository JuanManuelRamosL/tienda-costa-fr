"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useStore from "../../store";
import ProductCard from "../components/productCard";
import ProductCardTotal from "@/components/productCardTotal";
import styles from "./page.module.css";

export default function Home() {
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);

  const [currentPage, setCurrentPage] = useState(0);
  const [allProductsPage, setAllProductsPage] = useState(0);
  const [filter, setFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 4;
  const allProductsPerPage = 5;

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const allProductsTotalPages = Math.ceil(
    filteredProducts.length / allProductsPerPage
  );
  const allProductsStartIndex = allProductsPage * allProductsPerPage;
  const currentAllProducts = filteredProducts.slice(
    allProductsStartIndex,
    allProductsStartIndex + allProductsPerPage
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
    </div>
  );
}
