import React, { FC, MouseEvent, useState } from 'react';
import { Avatar, ButtonBase, Checkbox, Dialog, DialogContent, Grow, TableBody as MuiTableBody, TableCell, TableRow, Theme, useMediaQuery, Zoom } from '@material-ui/core';
import { IProduct } from '@interfaces/Product';
import { Column } from '@interfaces/Table';
import { Liquor, WineBar, SportsBar, LocalBar } from '@icons/Liquor';
import { numberToCOP } from 'utils/converters';
import { makeStyles, createStyles, useTheme } from '@material-ui/styles';
import Link from 'components/Link';
import { useRouter } from 'next/router';

interface Props {
    products: IProduct[];
    columns: Column<IProduct>[];
    onCheck: (product: IProduct) => void;
    checked: string[];
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
    }),
);

const TableBody: FC<Props> = (props) => {
    const {
        products,
        columns,
        onCheck,
        checked,
    } = props;

    const [openImage, setOpenImage] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [isTouch, setIsTouch] = useState(false);
    const [touchMoving, setTouchMoving] = useState(false);
    const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
    const [alreadyChecked, setAlreadyChecked] = useState(false);

    const icons = [
        Liquor,
        WineBar,
        SportsBar,
        LocalBar,
    ];

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
    }

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
                }, 500)
            );
        }
    }

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
                            console.log(current, currentMoving);
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
    }

    const handleClickProduct = (product: IProduct) => {
        if (!isTouch && checked.length) {
            onCheck(product)
        } else {
            router.push(`productos/${product.barcode}`);
        }
    }

    return (
        <>
            <MuiTableBody>
                {
                    products.map((product) => {
                        const Icon = icons[product.name.length % icons.length]
                        return (
                            <TableRow
                                key={`PRODUCTS-TABLE-ROW-${product.id.toUpperCase()}`}
                                role="button"
                                selected={checked.includes(product.id)}
                                onTouchStart={() => handleTouchStart(product)}
                                onTouchMove={() => setTouchMoving(true)}
                                onTouchEnd={() => handleTouchEnd(product)}
                                className={classes.row}
                                onClick={() => !isTouch ? handleClickProduct(product) : null}
                                hover
                            >
                                <Grow in={match || checked.length !== 0} unmountOnExit>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={checked.includes(product.id)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!alreadyChecked || !isTouch) {
                                                    onCheck(product);
                                                    setAlreadyChecked(true);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                </Grow>
                                {
                                    columns.map((column) => {
                                        const isPrice = column.id === 'sellPrice' || column.id === 'buyPrice';
                                        const value = isPrice
                                            ? numberToCOP(product[column.id] as number)
                                            : product[column.id];
                                        return (
                                            <TableCell
                                                align={column.align}
                                                key={`PRODUCTS-TABLE-CELL-${product.id.toUpperCase()}-${column.id.toUpperCase()}`}
                                                className={isPrice ? classes.noWrap : ''}
                                            >
                                                {
                                                    column.id === 'image'
                                                        ? (
                                                            <ButtonBase
                                                                className={classes.avatarButton}
                                                                onClick={(e) => toggleOpenImage(e, product.image)}
                                                            >
                                                                <Avatar src={value?.toString() || ''} className={classes.avatar}>
                                                                    <Icon />
                                                                </Avatar>
                                                            </ButtonBase>
                                                        ) : value
                                                }
                                            </TableCell>
                                        );
                                    })
                                }
                            </TableRow>
                        );
                    })
                }
            </MuiTableBody>
            <Dialog
                TransitionComponent={Zoom}
                open={openImage}
                onClose={() => setOpenImage(false)}
                maxWidth="xl"
            >
                <DialogContent>
                    <Link href={imageURL} target="_blank">
                        <img src={imageURL} className={classes.image} />
                    </Link>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TableBody
