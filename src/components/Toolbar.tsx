import { useAuth } from "@hooks/auth";
import { useSelector } from "@hooks/redux";
import { Logout } from "@icons";
import { AppBar, Avatar, Button, Drawer, Hidden, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Theme, Toolbar, Typography } from "@material-ui/core";
import { Menu as MenuIcon } from '@material-ui/icons';
import { createStyles, makeStyles } from "@material-ui/styles";
import Link from "next/link";
import { FC, useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            cursor: 'pointer',
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
    }),
);

const CustomToolbar: FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const user = useSelector(({ user }) => user);
    const { login, logout } = useAuth();
    const classes = useStyles();

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

    return (
        <>
            <AppBar position="static">
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
                    <Hidden xsDown={!!user}>
                        <Link href="/">
                            <img
                                src="/svgs/FullLogo.svg"
                                alt="Logo of the liquor store"
                                className={`${classes.logo} ${!user ? classes.logoCentered : ''}`}
                            />
                        </Link>
                    </Hidden>
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

            </Drawer>
        </>
    );
}

export default CustomToolbar;
