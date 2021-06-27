import { Button, Dialog, DialogContent, DialogActions, DialogProps, IconButton, Theme, Zoom, useMediaQuery, Tooltip, ButtonBase, Collapse } from '@material-ui/core';
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import { Add, Delete, Done, NavigateBefore, NavigateNext, Share } from '@material-ui/icons';
import { makeStyles, createStyles, useTheme } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import useDialog from '@hooks/dialog';
import { addAlert } from '@actions/alert';

interface Props extends DialogProps {
    onImagesChange: (images: File[]) => void;
    onDefaultImageChange: (image: File) => void;
    handleClose: () => void;
    images: File[] | null;
}

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        galleryContainer: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageActions: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1),
            justifyContent: 'space-between',
        },
        collapse: {
            width: '100%',
            position: 'absolute',
            bottom: 0,
        },
        blurredBack: {
            backgroundColor: 'rgba(0, 0, 0, .2)',
            position: 'absolute',
            height: 68,
            width: '100%',
            marginLeft: `-${theme.spacing(1)}px`,
            borderRadius: `${theme.spacing(1)}px ${theme.spacing(1)}px 0 0`
        },
        buttonLabel: {
            display: 'inline-block',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        },
        button: {
            margin: theme.spacing(1),
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, .88)',
            },
        },
        fabs: {
            display: 'flex',
        },
        selectedIcon: {
            marginRight: theme.spacing(1),
        },
        buttonLabelFlex: {
            display: 'flex',
            alignItems: 'center',
        },
        arrowBefore: {
            position: 'absolute',
            alignSelf: 'center',
            left: theme.spacing(1),
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, .54)',
            }
        },
        arrowNext: {
            position: 'absolute',
            alignSelf: 'center',
            right: theme.spacing(1),
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, .54)',
            }
        },
        imageContainer: {
            maxWidth: '100%',
            maxHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            '&>img': {
                maxWidth: '100%',
                maxHeight: '50vh',
            },
        },
        allImagesContainer: {
            overflowX: 'auto',
            padding: theme.spacing(2),
            [theme.breakpoints.down('sm')]: {
                padding: `${theme.spacing(2)}px 0`,
            },
            display: 'flex',
            '&::before': {
                margin: 'auto',
                content: "''",
            },
            '&::after': {
                margin: 'auto',
                content: "''",
            },
        },
        selectedImage: {
            position: 'absolute',
            top: 0,
            width: 100,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(206, 89, 89, .5)',
            padding: theme.spacing(2),
            borderRadius: 7,
        },
        indexImage: {
            border: `solid 3px ${theme.palette.primary.main}`,
            padding: 2,
            borderRadius: 7,
        },
        imageInBar: {
            minWidth: 100,
            maxWidth: 100,
            height: 100,
            '&:not(:first-child)': {
                marginLeft: theme.spacing(1),
            },
            position: 'relative',
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 7,
        },
        selectedImageImage: {
            borderRadius: 7,
        },
        whiteIcon: {
            color: 'white',
        },
    }),
);

const SelectDefaultImage = ({
    onImagesChange,
    onDefaultImageChange,
    handleClose,
    images = [],
    ...props
}: Props) => {
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    const [imageIndex, setImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme<Theme>();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const handleUploadMore = () => {
        inputRef?.current.click();
    };

    const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (event) => {
        const files = [...event.target.files as unknown as File[]];
        if (files) {
            if (files.find((file) => !file.type.includes('image'))) {
                dispatch(addAlert({
                    id: 'invalid-file-type',
                    message: 'Solo puedes subir archivos de tipo <b>imagen</b> para tus productos',
                    show: true,
                    title: 'Archivo Invalido',
                }));
            }
            const uploaded = files.filter((file) => file.type.includes('image'));
            onImagesChange(images
                ? [
                    ...images,
                    ...uploaded,
                ]
                : uploaded,
            );
        }
    }

    const deleteImage = (index: number) => {
        setTimeout(() => {
            onImagesChange(images.filter((_img, i) => i !== index));
        }, 500)

        if (images.length === 1) {
            handleClose();
        } else if (index === (images.length - 1)) {
            setImageIndex(index - 1);
        }

        if (index === selectedImage && images.length !== 1) {
            setSelectedImage(0);
        }
    };

    useEffect(() => {
        const paths = images?.map((image) => window.URL.createObjectURL(image));
        setImagePaths(paths || []);
    }, [images])

    useEffect(() => {
        onDefaultImageChange(images && images[selectedImage]);
    }, [selectedImage]);

    useEffect(() => {
        if (imagePaths.length !== 0) {
            const path = imagePaths[imageIndex];
            document
                .getElementById(`IMAGES-VERTICAL-SCROLL-${path}-${imageIndex}`)
                ?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [imageIndex]);

    return (
        <>
            <Dialog
                {...props}
                onClose={(e, r) => {
                    handleClose();
                    props.onClose && props.onClose(e, r);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogContent>
                    <div className={classes.galleryContainer}>
                        <BindKeyboardSwipeableViews
                            enableMouseEvents
                            slideStyle={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            index={imageIndex}
                            onChangeIndex={(i) => setImageIndex(i)}
                        >
                            {
                                imagePaths.map((path, i) => {
                                    const isSelected = i === selectedImage;
                                    const sufix = isSelected ? 'da' : 'r';
                                    return (
                                        <div className={classes.imageContainer} key={`IMAGE-SELECTOR-${path}-${i}`}>
                                            <img src={path} />
                                            <Collapse
                                                in={imageIndex === i}
                                                className={classes.collapse}
                                                classes={{
                                                    wrapperInner: classes.imageActions
                                                }}
                                            >
                                                <span className={classes.blurredBack} />
                                                <Tooltip
                                                    title={`Selecciona${sufix} como foto predeterminada`}
                                                    placement="top"
                                                    arrow
                                                >
                                                    <Button
                                                        className={classes.button}
                                                        classes={{
                                                            label: classes.buttonLabel,
                                                        }}
                                                        color={isSelected ? 'primary' : 'default'}
                                                        onClick={() => setSelectedImage(i)}
                                                    >
                                                        <div className={classes.buttonLabelFlex}>
                                                            {
                                                                isSelected && (
                                                                    <Done
                                                                        fontSize="small"
                                                                        color="primary"
                                                                        className={classes.selectedIcon}
                                                                    />
                                                                )
                                                            }
                                                            <div className={classes.buttonLabel}>
                                                                Selecciona{sufix}
                                                            </div>
                                                        </div>
                                                    </Button>
                                                </Tooltip>
                                                <div className={classes.fabs}>
                                                    <Tooltip title="Compartir" placement="top" arrow>
                                                        <IconButton
                                                            size="small"
                                                            className={classes.button}
                                                        >
                                                            <Share fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar" placement="top" arrow>
                                                        <IconButton
                                                            size="small"
                                                            className={classes.button}
                                                            onClick={() => deleteImage(i)}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </Collapse>
                                        </div>
                                    )
                                })
                            }
                        </BindKeyboardSwipeableViews>
                        {
                            matches && (
                                <>
                                    <IconButton
                                        size="small"
                                        className={classes.arrowBefore}
                                        onClick={() => setImageIndex((currentIndex) => {
                                            return currentIndex === 0
                                                ? imagePaths.length - 1
                                                : currentIndex - 1
                                        })}
                                    >
                                        <NavigateBefore />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        className={classes.arrowNext}
                                        onClick={() => setImageIndex((currentIndex) => {
                                            return currentIndex === imagePaths.length - 1
                                                ? 0
                                                : currentIndex + 1
                                        })}
                                    >
                                        <NavigateNext />
                                    </IconButton>
                                </>
                            )
                        }
                    </div>
                    <div className={classes.allImagesContainer}>
                        {
                            imagePaths.map((path, i) => {
                                return (
                                    <ButtonBase
                                        className={classes.imageInBar}
                                        onClick={() => setImageIndex(i)}
                                        onDoubleClick={() => setSelectedImage(i)}
                                        key={`IMAGES-VERTICAL-SCROLL-${path}-${i}`}
                                    >
                                        <img
                                            src={path}
                                            id={`IMAGES-VERTICAL-SCROLL-${path}-${i}`}
                                            className={`
                                                ${classes.image}
                                                ${imageIndex === i ? classes.indexImage : ''}
                                                ${selectedImage === i ? classes.selectedImageImage : ''}
                                            `}
                                        />
                                        <Zoom in={selectedImage === i}>
                                            <div className={classes.selectedImage}>
                                                <Done
                                                    color="inherit"
                                                    className={classes.whiteIcon}
                                                />
                                            </div>
                                        </Zoom>
                                    </ButtonBase>
                                );
                            })
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        color="primary"
                        onClick={() => handleUploadMore()}
                    >
                        Subir Más
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleClose()}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
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
};

export default SelectDefaultImage;
