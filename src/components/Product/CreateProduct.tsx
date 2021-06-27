import { initialProduct, IProduct, IProductModRef, IRelatedProduct } from '@interfaces/Product';
import { Avatar, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grow, IconButton, TextField, Theme, Typography, useMediaQuery, Chip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { ChangeEventHandler, Dispatch, FC, KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import NumberFormat from 'components/CustomNumberFormat';
import SelectDefaultImage from 'components/utils/SelectDefaultImage';
import { createStyles, makeStyles, useTheme } from '@material-ui/styles';
import { CheckBox, Close, Done, PhotoCamera } from '@material-ui/icons';
import { useDispatch, useSelector } from '@hooks/redux';
import { addAlert } from '@actions/alert';
import { addProduct } from '@firestore/product';
import { useSubscription } from '@hooks/subscription';
import { IProductSubscriptions } from '@interfaces/Subscription';
import { useCharging } from '@hooks/charging';
import { ICreateProductCharging } from '@interfaces/Charging';
import { numberToCOP } from 'utils/converters';
import { IProductImage } from '@interfaces/Image';
import { convertProductToRelated } from '@utils/functions';

interface Props {
    hideButton?: {
        open: boolean;
        setOpen: Dispatch<React.SetStateAction<boolean>>;
    };
    products: IProduct[];
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
                '&>div>*:first-child': {
                    marginRight: theme.spacing(1),
                },
                display: 'flex',
                alignItems: 'center',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            }
        },
        titleLeft: {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        titleLabel: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        container: {
            display: 'flex',
            paddingBottom: theme.spacing(1),
            flexDirection: 'column',
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
        confirm: {
            width: 250,
        },
        chip: {
            margin: `${theme.spacing(1)}px ${theme.spacing(.5)}px`
        },
        imageCheckContainer: {
            position: 'relative',
        },
        imageCheck: {
            margin: theme.spacing(1),
            borderRadius: '50%',
        },
        imageSpan: {
            top: 0,
            position: 'absolute',
            margin: theme.spacing(1),
            borderRadius: '50%',
            opacity: '80%',
            backgroundColor: theme.palette.primary.main,
            height: 24,
            width: 24,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
);

const CreateProduct: FC<Props> = ({ hideButton, products }) => {
    const [open, setOpen] = hideButton
        ? [hideButton.open, hideButton.setOpen]
        : useState(false);
    const [product, setProduct] = useState<IProduct>(initialProduct);
    const [errors, setErrors] = useState<Errors>({});
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [haveDeposit, setHaveDeposit] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openGallery, setOpenGallery] = useState(false);
    const [defaultIndex, setDefaultIndex] = useState(0);

    const classes = useStyles();
    const theme = useTheme<Theme>();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    const dispatch = useDispatch();
    const { setSubscribtion, unsubscribe } = useSubscription<IProductSubscriptions>();
    const { setCharging } = useCharging<ICreateProductCharging>('createProduct');
    const user = useSelector(({ user }) => user);
    const inputRef = useRef<HTMLInputElement>(null)

    const sell = product.sellPrice + (product.sellDeposit || 0);
    const buy = product.buyPrice + (product.buyDeposit || 0);

    const profit = numberToCOP(sell - buy);

    const toggleOpen = () => {
        setOpen((current) => {
            if (current) {
                setOpenConfirm(false);
                setOpenGallery(false);
                setTimeout(() => {
                    setProduct(initialProduct);
                    setErrors({});
                    setUploadedImages([]);
                    unsubscribe('uploadPhoto');
                    setCharging('addProduct', false);
                    setHaveDeposit(false);
                }, 500);
            }
            return !current;
        });
    }

    const updateProduct = (
        key: keyof IProduct,
        value: string | number | IProductModRef | IProductImage | (string | IRelatedProduct)[]
    ) => {
        setErrors((current) => ({ ...current, [key]: undefined }))
        if (value !== undefined) {
            setProduct((current) => ({
                ...current,
                [key]: value,
            }));
        } else {
            setProduct((current) => {
                delete current[key];
                return current;
            });
        }
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
            { all: uploadedImages, defaultIndex },
            handlers,
        );
    }

    const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (event) => {
        const files = [...event.target.files as unknown as File[]];
        if (files) {
            if (!files.find((file) => !file.type.includes('image'))) {
                const uploaded = files.filter((file) => file.type.includes('image'));
                setUploadedImages(uploaded);
                setOpenGallery(uploaded.length > 1);
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
        inputRef?.current.click();

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

    const closeCreateProduct = () => {
        if (product.name || product.barcode) {
            setOpenConfirm(true);
        } else {
            toggleOpen();
        }
    };

    const updateDefaultImage = (image?: File) => {
        if (image) {
            const path = window.URL.createObjectURL(image);
            updateProduct('images', {
                default: {
                    publicURL: path,
                    storePath: '',
                },
                all: product.images
                    ? product.images.all
                    : [{
                        publicURL: path,
                        storePath: '',
                    }]
            })
            setDefaultIndex(uploadedImages.indexOf(image));
        }
    };

    const handleRelated = (
        _e: React.ChangeEvent<{}>,
        value: (string | IProduct)[]
    ) => {
        updateProduct('relatedProducts', value.map((related) => {
            return typeof related === 'string'
                ? related
                : convertProductToRelated(related);
        }));
    };

    useEffect(() => {
        if (uploadedImages.length !== 0) {
            updateProduct('images', {
                default: product.images?.default.publicURL
                    ? product.images.default
                    : {
                        publicURL: uploadedImages[0]
                            ? window.URL.createObjectURL(uploadedImages[0])
                            : '',
                        storePath: '',
                    },
                all: uploadedImages.map((up) => ({
                    publicURL: window.URL.createObjectURL(up),
                    storePath: '',
                }))
            })
        } else {
            updateProduct('images', undefined);
        }
    }, [uploadedImages]);

    useEffect(() => {
        if (!haveDeposit) {
            updateProduct('sellDeposit', undefined);
            updateProduct('buyDeposit', undefined);
        }
    }, [haveDeposit]);

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
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle className={classes.title}>
                    <div className={classes.titleLeft}>
                        <IconButton
                            onClick={() => {
                                if (product.images?.default.publicURL) {
                                    setOpenGallery(true);
                                } else {
                                    handleUploadPhoto()
                                }
                            }}
                        >
                            <Avatar src={product.images?.default.publicURL}>
                                <PhotoCamera />
                            </Avatar>
                        </IconButton>
                        <div className={classes.titleLabel}>
                            Crear Producto{product.name ? ':' : ''} {product.name}
                        </div>
                    </div>
                    <IconButton className={classes.closeButton} onClick={closeCreateProduct}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.container} onKeyPress={handleKeyPressed}>
                    <div className={classes.formColumn}>
                        <div className={matches ? classes.formColumn : classes.doubleInput}>
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
                                    ['next-input']: 'create-product-dialog-description-input',
                                }}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
                        </div>
                        {
                            !matches && (
                                <div className={classes.formColumn}>
                                    <TextField
                                        value={product.description}
                                        placeholder="Descripción"
                                        label="Descripción"
                                        onChange={({ target }) => updateProduct('description', target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            id: 'create-product-dialog-description-input',
                                            ['next-input']: 'create-product-dialog-related-input'
                                        }}
                                        multiline
                                        rowsMax={3}
                                        rows={3}
                                    />
                                    {
                                        products.length !== 0 && (
                                            <Autocomplete
                                                options={products}
                                                disableCloseOnSelect
                                                getOptionLabel={({ name }: IProduct) => name}
                                                getOptionSelected={(option, value) => (
                                                    (
                                                        typeof option !== 'string'
                                                        && option.id
                                                    ) === (
                                                        typeof value !== 'string'
                                                        && value.id
                                                    )
                                                )}
                                                limitTags={2}
                                                onChange={handleRelated}
                                                renderTags={(tagValue, getTagProps) =>
                                                    tagValue.map(({ images, name }: IProduct, index) => (
                                                        <Chip
                                                            {...getTagProps({ index })}
                                                            label={name}
                                                            avatar={images ? <Avatar src={images.default?.publicURL} /> : undefined}
                                                            className={classes.chip}
                                                        />
                                                    ))
                                                }
                                                noOptionsText="Producto no encontrado"
                                                renderOption={({ name, images }: IProduct, { selected }) => (
                                                    <React.Fragment>
                                                        {
                                                            images
                                                                ? (
                                                                    <div className={classes.imageCheckContainer}>
                                                                        <img
                                                                            src={images.default?.publicURL}
                                                                            height="24"
                                                                            width="24"
                                                                            className={classes.imageCheck}
                                                                        />
                                                                        {
                                                                            selected && (
                                                                                <span className={classes.imageSpan}>
                                                                                    <Done fontSize="small" />
                                                                                </span>
                                                                            )
                                                                        }
                                                                    </div>
                                                                ) : (
                                                                    <Checkbox checked={selected} color="primary" />
                                                                )
                                                        }
                                                        {name}
                                                    </React.Fragment>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Productos relacionados"
                                                        placeholder="Productos relacionados"
                                                        InputLabelProps={{
                                                            ...params.InputLabelProps,
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            ...params.inputProps,
                                                            id: 'create-product-dialog-related-input',
                                                            ['next-input']: 'create-product-dialog-buy-price-input'
                                                        }}
                                                    />
                                                )}
                                                multiple
                                            />
                                        )
                                    }
                                </div>
                            )
                        }
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
                                        ['next-input']: 'Enter',
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
            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
            >
                <DialogTitle>Cerrar</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.confirm}>
                        ¿Estás seguro que deseas cerrar la creación del producto&nbsp;
                        <strong>{product.name || `# ${product.barcode}`}?</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleOpen}
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <SelectDefaultImage
                open={openGallery}
                handleClose={() => setOpenGallery(false)}
                images={uploadedImages}
                onImagesChange={setUploadedImages}
                onDefaultImageChange={updateDefaultImage}
            />
            <input
                ref={inputRef}
                type="file"
                onChange={handleFileSelect}
                onClick={(event) => (event.target as any).value = ''}
                accept="image/*"
                multiple
                hidden
            />
        </>
    );
}

export default CreateProduct;
