import { createMuiTheme } from '@material-ui/core/styles';

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

export default theme;
