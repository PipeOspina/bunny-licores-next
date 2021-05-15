import React from 'react';
import { useRouter } from "next/router";

const Product = () => {
    const router = useRouter();
    const { barcode } = router.query;

    return (
        <>
            Código de barras: {barcode}
        </>
    );
}

export default Product;
