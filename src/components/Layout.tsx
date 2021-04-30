import React, { FC, useState } from 'react';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Theme, Avatar, Drawer, Container, Typography, Button, Hidden, useMediaQuery, ListItemIcon, ListItemText } from '@material-ui/core';
import { Menu as MenuIcon, AccountCircle } from '@material-ui/icons';
import { makeStyles, createStyles, useTheme } from '@material-ui/styles';
import { useSelector } from 'hooks/redux';
import { useAuth } from '@hooks/auth';
import { Logout } from '@icons';

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
            display: 'flex',
            alignItems: 'center',
        },
        avatarText: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            '&>p:first-child': {
                marginBottom: `-${theme.spacing(.5)}px`,
            },
        }
    }),
);

export const Layout: FC<Props> = ({ children, title }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const { login, logout } = useAuth();

    const theme = useTheme<Theme>();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const open = Boolean(anchorEl);

    const user = useSelector((state) => state.user);
    const logged = !!user;

    const classes = useStyles();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogin = () => {
        login();
    }

    const handleLogout = () => {
        handleClose();
        logout();
    }

    const toggleDrawer = () => {
        setOpenDrawer(current => !current);
    }

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
                            src="/svgs/FullLogo.svg"
                            alt="Logo of the liquor store"
                            className={`${classes.logo} ${!logged ? classes.logoCentered : ''}`}
                        />
                    </Hidden>
                    {
                        logged
                            ? (
                                <div className={classes.avatar}>
                                    <div className={classes.avatarText}>
                                        <Typography>
                                            {user.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            {user.email}
                                        </Typography>
                                    </div>
                                    <IconButton
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <Avatar src={user.avatarURL}>
                                            {
                                                user
                                                    .name
                                                    .split(' ')
                                                    .slice(0, 2)
                                                    .map((name) => name[0].toUpperCase())
                                            }
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
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" onClick={handleLogout} />
                </MenuItem>
            </Menu>
            <Drawer open={openDrawer} onClose={toggleDrawer}>

            </Drawer>
        </div>
    );
}

export default Layout;
