import React from 'react';
import { useAuth } from "@hooks/auth";
import { useSelector } from "@hooks/redux";
import { Logout } from "@icons";
import { AppBar, Avatar, Button, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Theme, Toolbar, Typography, useMediaQuery, useScrollTrigger } from "@material-ui/core";
import { Menu as MenuIcon } from '@material-ui/icons';
import { createStyles, makeStyles, useTheme } from "@material-ui/styles";
import Link from "next/link";
import { FC, useState } from "react";
import { MenuItems } from '@constants/global';
import { useRouter } from "next/router";
import { useCharging } from "@hooks/charging";
import { IIndexCharging } from "@interfaces/Charging";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        logo: {
            maxHeight: 48,
            cursor: 'pointer',
        },
        logoGrow: {
            flexGrow: 1,
        },
        logoCentered: {
            [theme.breakpoints.up('sm')]: {
                marginRight: '-126.5px',
            },
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
        },
        drawerContainer: {
            width: 250,
        },
        selectedItem: {
            color: theme.palette.primary.main,
        }
    }),
);

const CustomToolbar: FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const user = useSelector(({ user }) => user);
    const { login, logout } = useAuth();
    const classes = useStyles();
    const router = useRouter();
    const { setCharging } = useCharging<IIndexCharging>('index');
    const theme = useTheme<Theme>();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const open = Boolean(anchorEl);

    const toggleDrawer = () => {
        setOpenDrawer(current => !current);
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        handleClose();
        logout();
    }

    const handleLogin = () => {
        login();
    }

    const handleHover = (path: string) => {
        router.prefetch(path);
    }

    const handleGoTo = (path: string) => {
        toggleDrawer();
        setCharging('redirect');
        router.push(path);
    }

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    {
                        user && (
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
                    <Link href="/">
                        {
                            matches && user
                                ? (
                                    <img
                                        src="/svgs/Logo.svg"
                                        alt="Logo of the liquor store"
                                        className={`${classes.logo} ${classes.logoGrow}`}
                                    />
                                ) : (
                                    <img
                                        src="/svgs/FullLogo.svg"
                                        alt="Logo of the liquor store"
                                        className={`${classes.logo} ${classes.logoGrow} ${!user ? classes.logoCentered : ''}`}
                                    />
                                )
                        }
                    </Link>
                    {
                        user
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
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                </MenuItem>
            </Menu>
            <Drawer open={openDrawer} onClose={toggleDrawer}>
                <div className={classes.drawerContainer}>
                    <List>
                        {
                            MenuItems.map((item) => {
                                const selected = router.pathname.includes(item.path);
                                return (
                                    <ListItem
                                        button
                                        key={`MENU-ITEM-${item.path.toUpperCase()}-${item.name.toUpperCase()}`}
                                        onMouseEnter={() => handleHover(item.path)}
                                        onClick={() => handleGoTo(item.path)}
                                        selected={selected}
                                    >
                                        <ListItemIcon><item.icon color={selected ? 'primary' : 'inherit'} /></ListItemIcon>
                                        <ListItemText primary={item.name} className={selected ? classes.selectedItem : ''} />
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </div>
            </Drawer>
        </>
    );
}

export default CustomToolbar;
