import { useCharging } from "@hooks/charging";
import { IIndexCharging } from "@interfaces/Charging";
import { Paper, Table, TableContainer, Theme, useMediaQuery, } from "@material-ui/core";
import Title from "components/Title";
import TableHead from "components/CommonTable/Header";
import { FC, useEffect } from "react";
import { TableHeaders, MobileTableHeaders, TabletTableHeaders } from '@constants/sale';
import { useTheme } from "@material-ui/styles";

const Ventas: FC = () => {
    const { setCharging } = useCharging<IIndexCharging>('index');
    const theme = useTheme<Theme>();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('xs'));
    const tabletMatches = useMediaQuery(theme.breakpoints.down('sm'));
    const headers = mobileMatches
        ? MobileTableHeaders
        : tabletMatches
            ? TabletTableHeaders
            : TableHeaders;

    useEffect(() => {
        setCharging('redirect', false);
    }, []);

    return (
        <>
            <Title>Ventas</Title>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead
                            columns={headers}
                            checkbox
                        />
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}

export default Ventas;
