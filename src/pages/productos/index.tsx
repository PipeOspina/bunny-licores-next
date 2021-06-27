import { useCharging } from '@hooks/charging';
import { IIndexCharging, IProductTableCharging } from '@interfaces/Charging';
import { IconButton, Paper, Table, TableContainer, Theme, Typography, useMediaQuery } from '@material-ui/core';
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
import { cssVariables } from '@styles/theme';
import { Liquor } from '@icons/Liquor';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        head: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        noProducts: {
            height: `calc(${cssVariables(theme).containerHeight} - 105px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        },
        newProductLink: {
            cursor: 'pointer',
        }
    })
);

const Products = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
    const [openCreate, setOpenCreate] = useState(false);

    const { setCharging: indexCharging } = useCharging<IIndexCharging>('index');
    const { setCharging } = useCharging<IProductTableCharging>('productTable');
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
    const selectedIds = selectedProducts.map((prod) => prod.id);

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
                    },
                    error: console.log,
                })
        )
    }, []);

    const handleSelectRow = (product: IProduct) => {
        setSelectedProducts((current) => {
            if (current.includes(product)) {
                return current.filter((prod) => prod !== product)
            }
            return [
                ...current,
                product,
            ]
        });
    }

    const toggleAllChecked = () => {
        setSelectedProducts((
            selectedProducts.length === 0
                ? products
                : []
        ));
    }

    const checkboxProps = {
        onClick: toggleAllChecked,
        rowsSelected: selectedProducts.length,
        totalRows: products.length,
        header: 'holi :p'
    }

    return (
        <>
            <div className={classes.head}>
                <Title>Productos</Title>
                <CreateProduct products={products} />
            </div>
            {
                products.length
                    ? (
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHeah<IProduct>
                                        columns={headers}
                                        checkbox={checkboxProps}
                                    />
                                    <TableBody
                                        columns={headers}
                                        products={products}
                                        onCheck={handleSelectRow}
                                        checked={selectedIds}
                                    />
                                </Table>
                            </TableContainer>
                        </Paper>
                    ) : (
                        <div className={classes.noProducts}>
                            <IconButton
                                color="primary"
                                onClick={() => setOpenCreate(true)}
                            >
                                <Liquor />
                            </IconButton>
                            <Typography>No existen productos para mostrar</Typography>
                            <Typography
                                variant="subtitle2"
                                color="primary"
                                className={classes.newProductLink}
                                onClick={() => setOpenCreate(true)}
                            >
                                Haz click aquí para crear uno
                            </Typography>
                        </div>
                    )
            }
            <CreateProduct
                hideButton={{ open: openCreate, setOpen: setOpenCreate }}
                products={products}
            />
        </>
    );
}

export default Products;
