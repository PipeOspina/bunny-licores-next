import { useCharging } from '@hooks/charging';
import { IIndexCharging } from '@interfaces/Charging';
import { Button } from '@material-ui/core';
import Link from 'components/Link';
import Title from 'components/Title';
import React, { useEffect, useState } from 'react';
import CreateProduct from 'components/CreateProduct';

const Products = () => {
    const [openCreate, setOpenCreate] = useState(false);

    const { setCharging } = useCharging<IIndexCharging>('index');

    useEffect(() => {
        setCharging('redirect', false)
    }, []);

    return (
        <>
            <div>
                <Title>Productos</Title>
                <CreateProduct />
            </div>
        </>
    );
}

export default Products;
