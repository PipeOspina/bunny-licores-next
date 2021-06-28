import { useCharging } from '@hooks/charging';
import { IIndexCharging, IProductTableCharging } from '@interfaces/Charging';
import { IconButton, Paper, Table, TableContainer, Theme, Typography, useMediaQuery, TablePagination, Collapse } from '@material-ui/core';
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
import { Changes, initialPagination, Order, Pagination } from '@interfaces/Table';
import TableBody from 'components/Product/TableBody';
import { cssVariables } from '@styles/theme';
import { Liquor } from '@icons/Liquor';
import { sortProducts } from '@utils/functions';
import { Delete } from '@material-ui/icons';
import { removeProduct } from '@firestore/product'
import useDialog, { DialogType } from '@hooks/dialog';

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
        },
        checkboxHead: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    })
);

const Products = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [order, setOrder] = useState<Order<keyof IProduct>>({ direction: 'asc' });
    const [pagination, setPagination] = useState<Pagination>(initialPagination);
    const [changes, setChanges] = useState<Changes>({
        allreadyCharged: false,
        newIds: [],
        deletedIds: [],
        modifiedIds: [],
    });

    const { setCharging: indexCharging } = useCharging<IIndexCharging>('index');
    const { setCharging } = useCharging<IProductTableCharging>('productTable');
    const classes = useStyles();
    const theme = useTheme<Theme>();
    const matchMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const matchTablet = useMediaQuery(theme.breakpoints.down('sm'));
    const { setSubscribtion } = useSubscription<IProductSubscriptions>();

    const includeS = (selectedProducts.length !== 1 && 's') || '';

    const { Component, openDialog, setDialogProps } = useDialog({
        message: `¿Está seguro que desea eliminar <strong>${selectedProducts.length} producto${includeS}</strong>?`,
        onAccept: () => {
            selectedIds.forEach((id) => removeProduct(id));
            setSelectedProducts([]);
        },
        title: 'Eliminar Productos',
        type: DialogType.WARNING,
        useMarkdown: true,
        resetOnClose: true,
    })

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
        header: (
            <div className={classes.checkboxHead}>
                <Typography>
                    {selectedProducts.length}
                    &nbsp;Producto{includeS}
                    &nbsp;selesccionado{includeS}
                </Typography>
                <IconButton onClick={openDialog}>
                    <Delete />
                </IconButton>
            </div>
        ),
    }

    useEffect(() => {
        indexCharging('redirect', false)
        setCharging('getProducts');
        setSubscribtion(
            'getProducts',
            getProducts()
                .subscribe({
                    next: (res) => {
                        const changes = res.docChanges();
                        setPagination((current) => {
                            setChanges((currentChanges) => {
                                console.log(currentChanges);
                                if (currentChanges.allreadyCharged) {
                                    const min = current.page * current.rowsPerPage;
                                    const max = (current.page * current.rowsPerPage) + current.rowsPerPage;
                                    const newIds = changes
                                        .filter((change, index) => (
                                            change.type === 'added'
                                            && index >= min
                                            && index < max
                                        ))
                                        .map((change) => change.doc.data().id);
                                    const deletedIds = changes
                                        .filter((change, index) => (
                                            change.type === 'removed'
                                            && index >= min
                                            && index < max
                                        ))
                                        .map((change) => change.doc.data().id);
                                    const modifiedIds = changes
                                        .filter((change, index) => (
                                            change.type === 'modified'
                                            && index >= min
                                            && index < max
                                        ))
                                        .map((change) => change.doc.data().id);

                                    if (!deletedIds.length) {
                                        setProducts(res.data);
                                    }

                                    setTimeout(() => {
                                        if (deletedIds.length) {
                                            setTimeout(() => {
                                                setProducts(res.data);
                                            }, 100);
                                        }
                                        setChanges({
                                            allreadyCharged: true,
                                            newIds: [],
                                            deletedIds: [],
                                            modifiedIds: [],
                                        });
                                    }, 500)
                                    return {
                                        allreadyCharged: true,
                                        newIds,
                                        deletedIds,
                                        modifiedIds,
                                    };
                                } else {
                                    console.log('entro')
                                    setProducts(res.data);
                                }
                                return {
                                    allreadyCharged: true,
                                    newIds: [],
                                    deletedIds: [],
                                    modifiedIds: [],
                                };
                            })
                            return current;
                        });
                        setCharging('getProducts', false);
                    },
                    error: console.log,
                })
        )
    }, []);

    useEffect(() => {
        setDialogProps(
            'message',
            `¿Está seguro que desea eliminar <strong>${selectedProducts.length} producto${includeS}</strong>?`,
        );
    }, [selectedProducts]);

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
                                        changes={changes}
                                    />
                                </Table>
                            </TableContainer>
                            <Collapse in={sortedProducts.length > pagination.rowsPerPageOptions[0]}>
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
                            </Collapse>
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
            <Component />
        </>
    );
}

export default Products;
