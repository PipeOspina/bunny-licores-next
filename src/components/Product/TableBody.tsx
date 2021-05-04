import React, { FC, useEffect, useState } from 'react';
import { Avatar, Button, ButtonBase, Checkbox, Dialog, DialogContent, TableBody as MuiTableBody, TableCell, TableRow, Theme, Zoom } from '@material-ui/core';
import { IProduct } from '@interfaces/Product';
import { Column } from '@interfaces/Table';
import { Liquor, WineBar, SportsBar, LocalBar } from '@icons/Liquor';
import { numberToCOP } from 'utils/converters';
import { makeStyles, createStyles } from '@material-ui/styles';
import Link from 'components/Link';

interface Props {
    products: IProduct[];
    columns: Column[];
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
    }),
);

const TableBody: FC<Props> = ({ products, columns }) => {
    const [openImage, setOpenImage] = useState(false);
    const [imageURL, setImageURL] = useState('');

    const icons = [
        Liquor,
        WineBar,
        SportsBar,
        LocalBar,
    ];

    const classes = useStyles();

    const toggleOpenImage = (url?: string) => {
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

    const imageLoaded = () => {
        console.log('loaded');
        setOpenImage(!!imageURL);
    }

    return (
        <>
            <MuiTableBody>
                {
                    products.map((product) => {
                        const Icon = icons[Math.floor(Math.random() * icons.length)]
                        return (
                            <TableRow
                                key={`PRODUCTS-TABLE-ROW-${product.id.toUpperCase()}`}
                                role="checkbox"
                                hover
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary" />
                                </TableCell>
                                {
                                    columns.map((column) => {
                                        const value = column.id === 'price'
                                            ? numberToCOP(product[column.id]).replace('$', '$ ')
                                            : product[column.id];
                                        return (
                                            <TableCell
                                                align={column.align}
                                                key={`PRODUCTS-TABLE-CELL-${product.id.toUpperCase()}-${column.id.toUpperCase()}`}
                                                className={column.id === 'price' ? classes.noWrap : ''}
                                            >
                                                {
                                                    column.id === 'image'
                                                        ? (
                                                            <ButtonBase
                                                                className={classes.avatarButton}
                                                                onClick={() => {
                                                                    console.log('clicked (?)');
                                                                    toggleOpenImage(product.image)
                                                                }}
                                                            >
                                                                <Avatar src={value} className={classes.avatar}>
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
            >
                <DialogContent>
                    <Link href={imageURL} target="_blank">
                        <img src={imageURL} className={classes.image} onLoad={() => imageLoaded()} />
                    </Link>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TableBody
