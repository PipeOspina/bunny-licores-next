import { useCharging } from '@hooks/charging';
import { IIndexCharging, IProductCharging } from '@interfaces/Charging';
import { Avatar, Button, Checkbox, Paper, Table, TableCell, TableContainer, TableRow, Theme, useMediaQuery } from '@material-ui/core';
import Link from 'components/Link';
import Title from 'components/Title';
import React, { useEffect, useState } from 'react';
import CreateProduct from 'components/Product/CreateProduct';
import { createStyles, makeStyles, useTheme } from '@material-ui/styles';
import TableHeah from 'components/CommonTable/Header';
import { TableHeaders } from '@constants/product';
import { useSubscription } from '@hooks/subscription';
import { IProductSubscriptions } from '@interfaces/Subscription';
import { getProducts } from '@services/firestore/product';
import { IProduct } from '@interfaces/Product';
import TableBody from 'components/Product/TableBody';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        head: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    })
);

const Products = () => {
    const [products, setProducts] = useState<IProduct[]>([]);

    const { setCharging: indexCharging } = useCharging<IIndexCharging>('index');
    const { setCharging } = useCharging<IProductCharging>('product');
    const classes = useStyles();
    const theme = useTheme<Theme>();
    const matchMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const matchTablet = useMediaQuery(theme.breakpoints.down('sm'));
    const { setSubscribtion } = useSubscription<IProductSubscriptions>();
    const headers = matchMobile
        ? TableHeaders.filter((header) => header.mobile)
        : matchTablet
            ? TableHeaders.filter((header) => header.tablet || header.mobile)
            : TableHeaders;

    useEffect(() => {
        indexCharging('redirect', false)
        setCharging('getProducts');
        setSubscribtion(
            'getProducts',
            getProducts()
                .subscribe({
                    next: (res) => {
                        setProducts(res.data);
                        setCharging('getProducts', false);
                    }
                })
        )
    }, []);

    return (
        <>
            <div className={classes.head}>
                <Title>Productos</Title>
                <CreateProduct />
            </div>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHeah
                            columns={headers}
                            checkbox
                        />
                        <TableBody
                            columns={headers}
                            products={products}
                        />
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}

export default Products;
