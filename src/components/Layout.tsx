import React, { FC } from 'react';
import { IconButton, Theme, Container, Typography, Button, useMediaQuery, CircularProgress, Backdrop, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { makeStyles, createStyles, useTheme } from '@material-ui/styles';
import { useDispatch, useSelector } from 'hooks/redux';
import { useAuth } from '@hooks/auth';
import { useCharging } from '@hooks/charging';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { removeAlert, updateAlert } from '@actions/alert';
import Toolbar from './Toolbar';
import { cssVariables } from '@styles/theme';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        container: {
            minHeight: cssVariables(theme).containerHeight,
            paddingBottom: theme.spacing(3),
        },
        noSesionMsg: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: 'inherit',
            alignItems: 'center',
            justifyContent: 'center',
        },
        backdrop: {
            zIndex: theme.zIndex.modal + 1,
            color: '#FFFFFF',
        },
    }),
);

export const Layout: FC = ({ children }) => {
    const theme = useTheme<Theme>();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const { user, alert: alerts } = useSelector((state) => state);
    const { globalCharging } = useCharging();
    const dispatch = useDispatch();
    const classes = useStyles();
    const { login } = useAuth();

    const handleLogin = () => {
        login();
    }

    return (
        <div className={classes.root}>
            <Toolbar />
            <Container className={classes.container}>
                {
                    user
                        ? (
                            <>
                                {children}
                            </>
                        ) : (
                            <div className={classes.noSesionMsg}>
                                <IconButton color="primary" onClick={handleLogin}>
                                    <AccountCircle fontSize="large" />
                                </IconButton>
                                <Typography variant={matches ? 'subtitle1' : 'subtitle2'}>Inicia sesión para continuar</Typography>
                            </div>
                        )
                }
            </Container>
            <Backdrop className={classes.backdrop} open={globalCharging}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {
                alerts.map((alert) => {
                    const handleCloseDialog = () => {
                        dispatch(updateAlert(alert.id, { show: false }))
                        setTimeout(() => {
                            dispatch(removeAlert(alert.id));
                        }, 500)
                    }

                    return (
                        <Dialog
                            open={alert.show}
                            onClose={handleCloseDialog}
                            key={`LAYOUT-DEFAULT-DIALOG-${alert.id.toUpperCase()}`}
                            maxWidth="xs"
                        >
                            <DialogTitle>
                                <Typography variant="inherit" color="primary">{alert.title}</Typography>
                            </DialogTitle>
                            <DialogContent>
                                <Markdown
                                    components={{
                                        p: ({ node, ...props }) => <DialogContentText {...props} />,
                                        strong: ({ node, ...props }) => <b><Typography variant="inherit" color="primary" {...props} /></b>,
                                    }}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {alert.message}
                                </Markdown>
                            </DialogContent>
                            <DialogActions>
                                {
                                    alert.cancelButton && (
                                        <Button onClick={() => {
                                            handleCloseDialog();
                                            alert.cancelAction && alert.cancelAction();
                                        }}>
                                            Cancelar
                                        </Button>
                                    )
                                }
                                <Button
                                    onClick={() => {
                                        handleCloseDialog();
                                        alert.acceptAction && alert.acceptAction();
                                    }}
                                    color="primary"
                                >
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )
                })
            }
        </div>
    );
}

export default Layout;
