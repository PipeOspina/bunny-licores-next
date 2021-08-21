import { useCharging } from '@hooks/charging';
import { IIndexCharging, IProductTableCharging } from '@interfaces/Charging';
import {
	IconButton,
	Paper,
	Table,
	TableContainer,
	Theme,
	Typography,
	useMediaQuery,
	TablePagination,
	Collapse,
	TextField,
	InputAdornment,
} from '@material-ui/core';
import Title from 'components/Title';
import React, { useEffect, useState } from 'react';
import CreateProduct from 'components/Product/CreateProduct';
import { createStyles, makeStyles, useTheme } from '@material-ui/styles';
import TableHeah from 'components/CommonTable/Header';
import { TableHeaders } from '@constants/product';
import { useSubscription } from '@hooks/subscription';
import { IProductSubscriptions } from '@interfaces/Subscription';
import { getProducts, removeProducts } from '@firestore/product';
import { IProduct } from '@interfaces/Product';
import {
	Changes,
	initialPagination,
	Order,
	Pagination,
} from '@interfaces/Table';
import TableBody from 'components/Product/TableBody';
import { cssVariables } from '@styles/theme';
import { Liquor } from '@icons/Liquor';
import { sortProducts } from '@utils/functions';
import { Clear, Delete, Search } from '@material-ui/icons';
import useDialog, { DialogType } from '@hooks/dialog';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		head: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		searchContainer: {
			display: 'flex',
			justifyContent: 'flex-end',
		},
		searchInput: {
			marginBottom: theme.spacing(2),
		},
		fullInput: {
			width: '100%',
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
	}),
);

const Products = () => {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
	const [openCreate, setOpenCreate] = useState(false);
	const [order, setOrder] = useState<Order<keyof IProduct>>({
		direction: 'asc',
	});
	const [pagination, setPagination] = useState<Pagination>(initialPagination);
	const [searchValue, setSearchValue] = useState('');
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

	const selectedIds = selectedProducts.map((prod) => prod.id);

	const { Component, openDialog, setDialogProps } = useDialog({
		message: `¿Está seguro que desea eliminar <strong>${selectedProducts.length} producto${includeS}</strong>?`,
		onAccept: () => {
			setCharging('deleteProducts');
			removeProducts(selectedIds).finally(() =>
				setCharging('deleteProducts', false),
			);
			setSelectedProducts([]);
		},
		title: 'Eliminar Productos',
		type: DialogType.WARNING,
		useMarkdown: true,
		resetOnClose: true,
	});

	const preheaders = matchTablet
		? TableHeaders.filter((header) => header.tablet || header.mobile)
		: TableHeaders;

	const headers = matchMobile
		? TableHeaders.filter((header) => header.mobile)
		: preheaders;

	const sortedProducts = sortProducts(products, order);
	const searchResult = sortedProducts.filter((product) => {
		const searchField = `
                    ${product.barcode}
                    ${product.name}
                    ${product.stockQuantity}
                    ${product.soldQuantity}
                    ${product.sellPrice}
                    ${product.buyPrice}
                    ${product.description || ''}
                `;
		return searchField.toLowerCase().includes(searchValue.toLowerCase());
	});

	const paginatedProducts = (
		searchValue ? searchResult : sortedProducts
	).slice(
		pagination.page * pagination.rowsPerPage,
		(pagination.page + 1) * pagination.rowsPerPage,
	);

	const toggleAllChecked = () => {
		const newSelected = searchValue ? searchResult : products;

		setSelectedProducts(selectedProducts.length === 0 ? newSelected : []);
	};

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
	};

	const getPaginationAndChanges = (
		callback: (
			currentPagination: Pagination,
			currentChanges: Changes,
		) => void,
	) => {
		setPagination((currentPagination) => {
			setChanges((currentChanges) => {
				callback(currentPagination, currentChanges);
				return currentChanges;
			});
			return currentPagination;
		});
	};

	useEffect(() => {
		indexCharging('redirect', false);
		setCharging('getProducts');
		setPagination((current) => current);
		setChanges((current) => current);
		setSubscribtion(
			'getProducts',
			getProducts().subscribe({
				next: (res) => {
					const resChanges = res.docChanges();
					getPaginationAndChanges(
						(currentPagination, currentChanges) => {
							if (currentChanges.allreadyCharged) {
								const { rowsPerPage, page } = currentPagination;
								const min = page * rowsPerPage;
								const max = page * rowsPerPage + rowsPerPage;
								const newIds = resChanges
									.filter(
										(change, index) =>
											change.type === 'added' &&
											index >= min &&
											index < max,
									)
									.map((change) => change.doc.data().id);
								const deletedIds = resChanges
									.filter(
										(change, index) =>
											change.type === 'removed' &&
											index >= min &&
											index < max,
									)
									.map((change) => change.doc.data().id);
								const modifiedIds = resChanges
									.filter(
										(change, index) =>
											change.type === 'modified' &&
											index >= min &&
											index < max,
									)
									.map((change) => change.doc.data().id);

								if (!deletedIds.length) {
									setProducts(res.data as any);
								}

								setChanges({
									allreadyCharged: true,
									newIds,
									deletedIds,
									modifiedIds,
								});

								setTimeout(() => {
									if (deletedIds.length) {
										setTimeout(() => {
											setProducts(res.data as any);
										}, 100);
									}
									setChanges({
										allreadyCharged: true,
										newIds: [],
										deletedIds: [],
										modifiedIds: [],
									});
								}, 500);
							} else {
								setProducts(res.data as any);
								setChanges({
									allreadyCharged: true,
									newIds: [],
									deletedIds: [],
									modifiedIds: [],
								});
							}
						},
					);
					setCharging('getProducts', false);
				},
				error: console.error,
			}),
		);
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
				return current.filter((prod) => prod !== product);
			}
			return [...current, product];
		});
	};

	const updatePagination = (
		key: keyof Pagination,
		value: number | number[],
	) => {
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
			{sortedProducts.length ? (
				<>
					<div className={classes.searchContainer}>
						<TextField
							id="SERACH-FIELD-PRODUCT-TABLE"
							onChange={({ target }) =>
								setSearchValue(target.value)
							}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											size="small"
											onClick={() => {
												searchValue
													? setSearchValue('')
													: document
															.getElementById(
																'SERACH-FIELD-PRODUCT-TABLE',
															)
															?.focus();
											}}
										>
											{searchValue ? (
												<Clear />
											) : (
												<Search />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
							label="Buscar"
							value={searchValue}
							className={`${classes.searchInput} ${
								matchMobile ? classes.fullInput : ''
							}`}
						/>
					</div>
					<Paper>
						<TableContainer>
							<Table>
								<TableHeah<IProduct>
									columns={headers}
									checkbox={
										searchValue && searchResult.length === 0
											? undefined
											: checkboxProps
									}
									order={order}
									handleSort={(newOrder) =>
										setOrder(newOrder)
									}
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
						<Collapse
							in={
								sortedProducts.length >
								pagination.rowsPerPageOptions[0]
							}
						>
							<TablePagination
								component="div"
								count={sortedProducts.length}
								page={pagination.page}
								onPageChange={(_e, page) =>
									updatePagination('page', page)
								}
								rowsPerPage={pagination.rowsPerPage}
								onChangeRowsPerPage={({ target }) =>
									updatePagination(
										'rowsPerPage',
										Number.isNaN(
											Number.parseInt(target.value, 10),
										)
											? initialPagination.rowsPerPage
											: Number.parseInt(target.value, 10),
									)
								}
								rowsPerPageOptions={
									pagination.rowsPerPageOptions
								}
							/>
						</Collapse>
					</Paper>
				</>
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
			)}
			<CreateProduct
				hideButton={{ open: openCreate, setOpen: setOpenCreate }}
				products={products}
			/>
			<Component />
		</>
	);
};

export default Products;
