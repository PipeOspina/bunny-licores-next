import React, { FC, MouseEvent, useState } from 'react';
import {
	Avatar,
	ButtonBase,
	Checkbox,
	Dialog,
	DialogContent,
	Grow,
	TableBody as MuiTableBody,
	TableCell,
	TableRow,
	Theme,
	useMediaQuery,
	Zoom,
	Tooltip,
} from '@material-ui/core';
import { IProduct } from '@interfaces/Product';
import { Changes, Column } from '@interfaces/Table';
import { Liquor, WineBar, SportsBar, LocalBar } from '@icons/Liquor';
import { numberToCOP } from 'utils/converters';
import { makeStyles, createStyles, useTheme } from '@material-ui/styles';
import Link from 'components/Link';
import { useRouter } from 'next/router';
import { Info } from '@material-ui/icons';

interface Props {
	products: IProduct[];
	columns: Column<IProduct>[];
	onCheck: (product: IProduct) => void;
	checked: string[];
	changes: Changes;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		noWrap: {
			whiteSpace: 'nowrap',
		},
		avatarButton: {
			borderRadius: '50%',
		},
		avatar: {
			backgroundColor: theme.palette.primary.main,
		},
		image: {
			maxWidth: '70vw',
			maxHeight: '70vh',
		},
		row: {
			cursor: 'pointer',
		},
		cell: {
			transition: 'color .3s, font-weight .3s',
		},
		new: {
			color: 'limegreen',
			fontWeight: 500,
			transition: 'color .3s',
		},
		deleted: {
			color: 'firebrick',
			fontWeight: 500,
			transition: 'color .3s',
		},
		modified: {
			color: 'goldenrod',
			fontWeight: 500,
			transition: 'color .3s',
		},
		noProducts: {
			height: 250,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
	}),
);

const TableBody: FC<Props> = (props) => {
	const { products, columns, onCheck, checked, changes } = props;

	const [openImage, setOpenImage] = useState(false);
	const [imageURL, setImageURL] = useState('');
	const [isTouch, setIsTouch] = useState(false);
	const [touchMoving, setTouchMoving] = useState(false);
	const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
	const [alreadyChecked, setAlreadyChecked] = useState(false);
	touchMoving;

	const icons = [Liquor, WineBar, SportsBar, LocalBar];

	const classes = useStyles();
	const theme = useTheme<Theme>();
	const match = useMediaQuery(theme.breakpoints.up('sm'));
	const router = useRouter();

	const toggleOpenImage = (
		event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
		url?: string,
	) => {
		event.preventDefault();
		event.stopPropagation();
		if (url) {
			setOpenImage(true);
			setImageURL(url);
		} else {
			setOpenImage(false);
			setTimeout(() => {
				setImageURL('');
			}, 500);
		}
	};

	const handleTouchStart = (product: IProduct) => {
		setIsTouch(true);
		if (checked.length === 0) {
			setTouchTimer(
				setTimeout(() => {
					setTouchMoving((current) => {
						if (!current) {
							setTimeout(() => {
								onCheck(product);
								setAlreadyChecked(true);
							}, 100);
						}
						return current;
					});
				}, 500),
			);
		}
	};

	const handleClickProduct = (product: IProduct) => {
		if (!isTouch && checked.length) {
			onCheck(product);
		} else {
			router.push(`productos/${product.barcode}`);
		}
	};

	const handleTouchEnd = (product: IProduct) => {
		touchTimer && clearInterval(touchTimer);
		if (checked.length !== 0) {
			if (!alreadyChecked) {
				setTouchMoving((current) => {
					if (!current) {
						onCheck(product);
						setAlreadyChecked(true);
					}
					return false;
				});
			}
		} else {
			setTimeout(() => {
				setAlreadyChecked((current) => {
					setTouchMoving((currentMoving) => {
						if (!current && !currentMoving) {
							handleClickProduct(product);
						}
						return false;
					});
					return current;
				});
			}, 10);
		}
		setTimeout(() => {
			setAlreadyChecked(false);
		}, 10);
		setTouchTimer(null);
	};

	return (
		<>
			<MuiTableBody>
				{products.length ? (
					products.map((product) => {
						const Icon = icons[product.name.length % icons.length];
						const isNew = !!changes.newIds.find(
							(id) => id === product.id,
						);
						const isDeleted = !!changes.deletedIds.find(
							(id) => id === product.id,
						);
						const isModified = !!changes.modifiedIds.find(
							(id) => id === product.id,
						);
						return (
							<TableRow
								key={`PRODUCTS-TABLE-ROW-${product.id.toUpperCase()}`}
								role="button"
								selected={checked.includes(product.id)}
								onTouchStart={() => handleTouchStart(product)}
								onTouchMove={() => setTouchMoving(true)}
								onTouchEnd={() => handleTouchEnd(product)}
								className={`
                                        ${classes.row}
                                    `}
								onClick={() =>
									!isTouch
										? handleClickProduct(product)
										: null
								}
								hover
							>
								<Grow
									in={match || checked.length !== 0}
									unmountOnExit
								>
									<TableCell
										padding="checkbox"
										className={classes.cell}
									>
										<Checkbox
											color="primary"
											checked={checked.includes(
												product.id,
											)}
											onClick={(e) => {
												e.stopPropagation();
												if (
													!alreadyChecked ||
													!isTouch
												) {
													onCheck(product);
													setAlreadyChecked(true);
												}
											}}
										/>
									</TableCell>
								</Grow>
								{columns.map((column) => {
									const isPrice =
										column.id === 'sellPrice' ||
										column.id === 'buyPrice';
									const isImages = column.id === 'images';

									const valueIsImages = isImages
										? product.images?.default.publicURL
										: product[column.id];
									const value = isPrice
										? numberToCOP(
												product[column.id] as number,
										  )
										: valueIsImages;

									return (
										<TableCell
											align={column.align}
											key={`PRODUCTS-TABLE-CELL-${product.id.toUpperCase()}-${column.id.toUpperCase()}`}
											className={`
                                                        ${classes.cell}
                                                        ${
															isPrice
																? classes.noWrap
																: ''
														}
                                                        ${
															isNew
																? classes.new
																: ''
														}
                                                        ${
															isDeleted
																? classes.deleted
																: ''
														}
                                                        ${
															isModified &&
															!isDeleted
																? classes.modified
																: ''
														}
                                                    `}
										>
											{column.id === 'images' ? (
												<ButtonBase
													className={
														classes.avatarButton
													}
													onClick={(e) =>
														toggleOpenImage(
															e,
															product.images
																.default
																.publicURL,
														)
													}
												>
													<Avatar
														src={
															value?.toString() ||
															''
														}
														className={
															classes.avatar
														}
													>
														<Icon />
													</Avatar>
												</ButtonBase>
											) : (
												value
											)}
										</TableCell>
									);
								})}
							</TableRow>
						);
					})
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} align="center">
							<div className={classes.noProducts}>
								<Tooltip
									title="Limpia el campo de busqueda o recarga la página"
									arrow
								>
									<Info color="primary" />
								</Tooltip>
								&nbsp;&nbsp;&nbsp;No se encontraron Productos
							</div>
						</TableCell>
					</TableRow>
				)}
			</MuiTableBody>
			<Dialog
				TransitionComponent={Zoom}
				open={openImage}
				onClose={() => setOpenImage(false)}
				maxWidth="xl"
			>
				<DialogContent>
					<Link href={imageURL} target="_blank">
						<img
							src={imageURL}
							className={classes.image}
							alt={imageURL}
						/>
					</Link>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default TableBody;
