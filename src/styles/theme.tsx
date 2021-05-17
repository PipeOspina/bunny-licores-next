import { createMuiTheme, Theme } from '@material-ui/core/styles';

const primary = '#CE5959'

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: primary,
        },
    },
    overrides: {
        MuiButton: {
            contained: {
                background: '#FFFFFF',
            },
        },
    },
});

export const cssVariables = (theme: Theme) => ({
    containerHeight: `calc(100vh - 64px - ${theme.spacing(3)}px)`,
})

export default theme;
