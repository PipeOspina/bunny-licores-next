import { useCharging } from '@hooks/charging';
import { IIndexCharging, IProductTableCharging } from '@interfaces/Charging';
import { IconButton, Paper, Table, TableContainer, Theme, Typography, useMediaQuery, TablePagination } from '@material-ui/core';
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
import { initialPagination, Order, Pagination } from '@interfaces/Table';
import TableBody from 'components/Product/TableBody';
import { cssVariables } from '@styles/theme';
import { Liquor } from '@icons/Liquor';
import { sortProducts } from '@utils/functions';

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
    const [order, setOrder] = useState<Order<keyof IProduct>>({ direction: 'asc' });
    const [pagination, setPagination] = useState<Pagination>(initialPagination);

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

    const sortedProducts = sortProducts(products, order);
    const paginatedProducts = sortedProducts.slice(
        pagination.page * pagination.rowsPerPage,
        (pagination.page + 1) * pagination.rowsPerPage,
    )

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

    const updatePagination = (key: keyof Pagination, value: number | number[]) => {
        setPagination((current) => ({
            ...current,
            [key]: value,
        }));
    };

    return (
        <>
            <div className={classes.head}>
                <Title>Productos</Title>
                <CreateProduct products={products} />
            </div>
            {
                sortedProducts.length
                    ? (
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableHeah<IProduct>
                                        columns={headers}
                                        checkbox={checkboxProps}
                                        order={order}
                                        handleSort={(newOrder) => setOrder(newOrder)}
                                    />
                                    <TableBody
                                        columns={headers}
                                        products={paginatedProducts}
                                        onCheck={handleSelectRow}
                                        checked={selectedIds}
                                    />
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={sortedProducts.length}
                                page={pagination.page}
                                onChangePage={(_e, page) => updatePagination('page', page)}
                                rowsPerPage={pagination.rowsPerPage}
                                onChangeRowsPerPage={({ target }) => updatePagination(
                                    'rowsPerPage',
                                    isNaN(parseInt(target.value))
                                        ? initialPagination.rowsPerPage
                                        : parseInt(target.value),
                                )}
                                rowsPerPageOptions={pagination.rowsPerPageOptions}
                            />
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
