import { initialProduct, IProduct, IProductModRef } from '@interfaces/Product';
import { Avatar, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grow, IconButton, TextField, Theme, Typography, useMediaQuery } from '@material-ui/core';
import React, { ChangeEventHandler, Dispatch, FC, KeyboardEventHandler, useState } from 'react';
import NumberFormat from 'components/CustomNumberFormat';
import { createStyles, makeStyles, useTheme } from '@material-ui/styles';
import { Close, PhotoCamera } from '@material-ui/icons';
import { useDispatch, useSelector } from '@hooks/redux';
import { addAlert } from '@actions/alert';
import { addProduct } from '@firestore/product';
import { useSubscription } from '@hooks/subscription';
import { IProductSubscriptions } from '@interfaces/Subscription';
import { useCharging } from '@hooks/charging';
import { ICreateProductCharging } from '@interfaces/Charging';
import { numberToCOP } from 'utils/converters';

interface Props {
    hideButton?: {
        open: boolean;
        setOpen: Dispatch<React.SetStateAction<boolean>>;
    };
}

type Errors = {
    [P in keyof IProduct]?: string;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        closeButton: {
            marginLeft: 'auto',
        },
        title: {
            '& h2': {
                display: 'flex',
                alignItems: 'center',
            }
        },
        container: {
            display: 'flex',
            paddingBottom: theme.spacing(3),
            [theme.breakpoints.down('xs')]: {
                flexDirection: 'column',
            },
        },
        avatarColumn: {
            alignSelf: 'center',
            marginRight: theme.spacing(2),
        },
        formColumn: {
            '& > *': {
                width: '100%',
                '&:not(:last-child)': {
                    marginBottom: theme.spacing(2),
                },
            },
        },
        doubleInput: {
            display: 'flex',
            justifyContent: 'space-between',
            '& > *': {
                width: '48%',
            }
        },
    }),
);

const CreateProduct: FC<Props> = ({ hideButton }) => {
    const [open, setOpen] = hideButton
        ? [hideButton.open, hideButton.setOpen]
        : useState(false);
    const [product, setProduct] = useState<IProduct>(initialProduct);
    const [errors, setErrors] = useState<Errors>({});
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [haveDeposit, setHaveDeposit] = useState(false);

    const classes = useStyles();
    const theme = useTheme<Theme>();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    const dispatch = useDispatch();
    const { setSubscribtion, unsubscribe } = useSubscription<IProductSubscriptions>();
    const { setCharging } = useCharging<ICreateProductCharging>('createProduct');
    const user = useSelector(({ user }) => user);

    const sell = product.sellPrice + (product.sellDeposit || 0);
    const buy = product.buyPrice + (product.buyDeposit || 0);

    const profit = numberToCOP(sell - buy);

    const toggleOpen = () => {
        setOpen((current) => {
            if (current) {
                setTimeout(() => {
                    setProduct(initialProduct);
                    setErrors({});
                    setUploadedImage(null);
                    unsubscribe('uploadPhoto');
                    setCharging('addProduct', false);
                }, 500);
            }
            return !current;
        });
    }

    const updateProduct = (
        key: keyof IProduct,
        value: string | number | IProductModRef
    ) => {
        setErrors((current) => ({ ...current, [key]: undefined }))
        setProduct((current) => ({
            ...current,
            [key]: value,
        }));
    }

    const handleCreate = () => {
        if (!product.name || !product.sellPrice || !product.buyPrice || !product.barcode) {
            setErrors({
                barcode: !product.barcode
                    ? 'Lee el código de barras del producto'
                    : undefined,
                name: !product.name
                    ? 'Ingresa un nombre para el producto'
                    : undefined,
                sellPrice: !product.sellPrice
                    ? 'En cuanto lo vendes'
                    : undefined,
                buyPrice: !product.buyPrice
                    ? 'En cuanto lo compraste'
                    : undefined,
            });
        } else {
            createProduct();
        }
    }

    const createProduct = () => {
        setCharging('addProduct');
        const handlers = {
            getSubscribtion: (sub) => setSubscribtion('uploadPhoto', sub),
            onError: console.log,
            onComplete: () => toggleOpen(),
        }
        addProduct(
            product,
            user,
            uploadedImage,
            handlers,
        );
    }

    const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.includes('image')) {
                setUploadedImage(file);
                updateProduct('image', URL.createObjectURL(file));
            } else {
                dispatch(addAlert({
                    id: 'invalid-file-type',
                    message: 'Solo puedes subir archivos de tipo <b>imagen</b> para tus productos',
                    show: true,
                    title: 'Archivo Invalido',
                }));
            }
        }
    }

    const handleUploadPhoto = () => {
        document.getElementById('productPhotoInput').click();
    }

    const handleKeyPressed: KeyboardEventHandler<HTMLDivElement> = (e) => {
        const type = (e.target as any).type || '';

        if (type === 'text' && e.key === 'Enter') {
            const nextInput = (e.target as any).getAttribute('next-input') || 'Enter';
            if (matches && nextInput !== 'Enter') {
                const nextElement = document.getElementById(nextInput);
                nextElement?.focus();
            } else {
                handleCreate();
            }
        }
    }

    return (
        <>
            {
                !hideButton && (
                    <Button
                        onClick={toggleOpen}
                        color="primary"
                        variant="contained"
                    >
                        Crear Producto
                    </Button>
                )
            }
            <Dialog
                onClose={toggleOpen}
                open={open}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle className={classes.title}>
                    Crear Producto
                    <IconButton className={classes.closeButton} onClick={toggleOpen}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.container} onKeyPress={handleKeyPressed}>
                    <div className={classes.avatarColumn}>
                        <IconButton onClick={handleUploadPhoto}>
                            <Avatar src={product.image}>
                                <PhotoCamera />
                            </Avatar>
                        </IconButton>
                    </div>
                    <div className={classes.formColumn}>
                        <TextField
                            value={product.barcode}
                            placeholder="Código de barras"
                            label="Código de Barras"
                            onChange={({ target }) => updateProduct('barcode', target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                id: 'create-product-dialog-barcode-input',
                                ['next-input']: 'create-product-dialog-name-input',
                            }}
                            error={!!errors.barcode}
                            helperText={errors.barcode}
                            autoFocus
                            required
                        />
                        <TextField
                            value={product.name}
                            placeholder="Nombre del producto"
                            label="Nombre"
                            onChange={({ target }) => updateProduct('name', target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                id: 'create-product-dialog-name-input',
                                ['next-input']: 'create-product-dialog-buy-price-input',
                            }}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                        />
                        <div className={matches ? classes.formColumn : classes.doubleInput}>
                            <TextField
                                value={product.buyPrice || ''}
                                placeholder="Precio de compra"
                                label="Compra"
                                InputProps={{
                                    inputComponent: NumberFormat as any
                                }}
                                onChange={({ target }) => {
                                    const value = Number(target.value)
                                    const price = isNaN(value) ? 0 : value;
                                    updateProduct('buyPrice', Number(price))
                                }}
                                inputProps={{
                                    id: 'create-product-dialog-buy-price-input',
                                    ['next-input']: 'create-product-dialog-sell-price-input',
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!errors.buyPrice}
                                helperText={errors.buyPrice}
                                required
                            />
                            <TextField
                                value={product.sellPrice || ''}
                                placeholder="Precio de venta"
                                label="Venta"
                                InputProps={{
                                    inputComponent: NumberFormat as any
                                }}
                                onChange={({ target }) => {
                                    const value = Number(target.value)
                                    const price = isNaN(value) ? 0 : value;
                                    updateProduct('sellPrice', Number(price))
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    id: 'create-product-dialog-sell-price-input',
                                    ['next-input']: haveDeposit
                                        ? 'create-product-dialog-buy-deposit-input'
                                        : 'Enter',
                                }}
                                error={!!errors.sellPrice}
                                helperText={errors.sellPrice}
                                required
                            />
                        </div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={haveDeposit}
                                    onChange={() => setHaveDeposit((current) => !current)}
                                    color="primary"
                                />
                            }
                            label="Producto con depósito"
                        />
                        <Collapse in={haveDeposit}>
                            <div className={matches ? classes.formColumn : classes.doubleInput}>
                                <TextField
                                    value={product.buyDeposit || ''}
                                    placeholder="Deposito del Distribuidor"
                                    label="Distribuidor"
                                    InputProps={{
                                        inputComponent: NumberFormat as any
                                    }}
                                    onChange={({ target }) => {
                                        const value = Number(target.value)
                                        const price = isNaN(value) ? 0 : value;
                                        updateProduct('buyDeposit', Number(price))
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        id: 'create-product-dialog-buy-deposit-input',
                                        ['next-input']: 'create-product-dialog-sell-deposit-input',
                                    }}
                                    required
                                />
                                <TextField
                                    value={product.sellDeposit || ''}
                                    placeholder="Deposito del Cliente"
                                    label="Cliente"
                                    InputProps={{
                                        inputComponent: NumberFormat as any
                                    }}
                                    onChange={({ target }) => {
                                        const value = Number(target.value)
                                        const price = isNaN(value) ? 0 : value;
                                        updateProduct('sellDeposit', Number(price))
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        id: 'create-product-dialog-sell-deposit-input',
                                    }}
                                    required
                                />
                            </div>
                        </Collapse>
                        <Grow in={!!(product.sellPrice && product.buyPrice)}>
                            <Typography color="primary">
                                {product.sellPrice >= product.buyPrice ? 'Ganancia' : 'Perdida'} de {profit}
                            </Typography>
                        </Grow>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleOpen}>
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleCreate}
                    >
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
            <input
                type="file"
                id="productPhotoInput"
                onChange={handleFileSelect}
                accept="image/*"
                hidden
            />
        </>
    );
}

export default CreateProduct;
