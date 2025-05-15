import { useMemo, useState } from 'react';

const useFilteredPaginatedProducts = (products, categories, activeCategory, itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return []; 
        return products.filter(product => {
            if (activeCategory === 'all') {
                return categories.includes(product.category_id); 
            }
            return product.category_id === Number(activeCategory);
        });
    }, [products, categories, activeCategory]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
        if (direction === 'reset') {
            setCurrentPage(1);
        }
    };

    const paginatedProducts = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredProducts, currentPage, itemsPerPage]);

    return {
        paginatedProducts,
        currentPage,
        totalPages,
        handlePageChange,
    };
};

export default useFilteredPaginatedProducts;

