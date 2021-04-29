import React, { FC, useState } from 'react';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Theme, Avatar, Drawer, Container, Typography, Button, Hidden, useMediaQuery } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle } from '@material-ui/icons';
import { makeStyles, createStyles, useTheme } from '@material-ui/styles';
import { useDispatch, useSelector } from 'hooks/redux';
import { actions } from '@actions/user';

interface Props {
    title: string;
}

const useStyles = makeStyles<Theme>((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        logo: {
            [theme.breakpoints.up('xs')]: {
                flexGrow: 1,
            },
            [theme.breakpoints.down('xs')]: {
                flexGrow: 1,
            },
            maxHeight: 48,
        },
        logoCentered: {
            [theme.breakpoints.up('sm')]: {
                marginRight: '-126.5px',
            },
        },
        title: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        container: {
            height: 'calc(100vh - 64px)'
        },
        noSesionMsg: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatar: {
            marginLeft: 'auto',
        },
    }),
);

export const Layout: FC<Props> = ({ children, title }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const theme = useTheme<Theme>();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const open = Boolean(anchorEl);

    const logged = useSelector((state) => !!state.user);

    const classes = useStyles();

    const dispatch = useDispatch();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogin = () => {
        dispatch(actions.setUser({ name: 'Yope' }))
    }

    const toggleDrawer = () => {
        setOpenDrawer(current => !current);
    }

    console.log(matches, 'mathces');

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {
                        logged && (
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                onClick={toggleDrawer}
                            >
                                <MenuIcon />
                            </IconButton>
                        )
                    }
                    <Hidden xsDown={logged}>
                        <img
                            src="svgs/FullLogo.svg"
                            alt="Bunny Licores"
                            className={`${classes.logo} ${!logged ? classes.logoCentered : ''}`}
                        />
                    </Hidden>
                    {
                        logged
                            ? (
                                <div className={classes.avatar}>
                                    <IconButton
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <Avatar>
                                            <AccountCircle />
                                        </Avatar>
                                    </IconButton>
                                </div>
                            ) : (
                                <Hidden xsDown>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        onClick={handleLogin}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </Hidden>
                            )
                    }
                </Toolbar>
            </AppBar>
            <Container className={classes.container}>
                {
                    logged
                        ? (
                            <>
                                <Typography variant="h4" color="primary" className={classes.title}>
                                    {title}
                                </Typography>
                                {children}
                            </>
                        )
                        : (
                            <div className={classes.noSesionMsg}>
                                <IconButton color="primary" onClick={handleLogin}>
                                    <AccountCircle fontSize="large" />
                                </IconButton>
                                <Typography variant={matches ? 'subtitle1' : 'subtitle2'}>Inicia sesión para continuar</Typography>
                            </div>
                        )
                }
            </Container>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
            <Drawer open={openDrawer} onClose={toggleDrawer}>

            </Drawer>
        </div>
    );
}

export default Layout;
