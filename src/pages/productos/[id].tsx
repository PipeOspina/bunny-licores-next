import React from 'react';
import { useRouter } from "next/router";

const Product = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            Id de Producto: {id}
        </>
    );
}

export default Product;
