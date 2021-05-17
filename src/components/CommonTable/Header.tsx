import { Checkbox, Grow, TableCell, TableHead, TableRow, TableSortLabel, Theme, useMediaQuery } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { FC, MouseEventHandler, ReactNode, useState, ReactElement } from 'react';

import { Column } from '@interfaces/Table';
import { useTheme } from '@material-ui/styles';
import { IProduct } from '@interfaces/Product';

interface Order<T = string> {
    direction: 'asc' | 'desc';
    id?: T;
}

interface Props<T = {}> {
    columns: Column<T>[];
    checkbox?: {
        totalRows: number;
        rowsSelected: number;
        onClick: () => void;
        header?: ReactNode;
    };
    classes?: {
        root?: string;
        row?: string;
        cell?: string;
        checkboxCell?: string;
        checkbox?: string;
    };
    handleSort?: (order: Order<keyof T>) => void;
    initialSort?: Order<keyof T>;
}

const Head = <T extends unknown>(props: Props<T>) => {
    const {
        columns,
        checkbox,
        classes,
        handleSort,
        initialSort,
    } = props;

    const [order, setOrder] = useState<Order<keyof T>>(initialSort || { direction: 'asc' });

    const router = useRouter();
    const theme = useTheme<Theme>();
    const match = useMediaQuery(theme.breakpoints.up('sm'));

    const checked = (
        checkbox.rowsSelected !== 0
        && checkbox.totalRows !== 0
        && checkbox.rowsSelected === checkbox.totalRows
    )

    const indeterminate = (
        checkbox.rowsSelected !== 0
        && checkbox.totalRows !== 0
        && checkbox.rowsSelected < checkbox.totalRows
    )

    const handleSortBy = (id: keyof T) => {

    }

    return (
        <TableHead className={classes?.root}>
            <TableRow className={classes?.row}>
                {
                    checkbox && (
                        <Grow in={match || checkbox.rowsSelected !== 0} unmountOnExit>
                            <TableCell className={classes?.checkboxCell} padding="checkbox">
                                <Checkbox
                                    className={classes?.checkbox}
                                    color="primary"
                                    onClick={() => checkbox?.onClick()}
                                    checked={checked}
                                    indeterminate={indeterminate}
                                />
                            </TableCell>
                        </Grow>
                    )
                }
                {
                    checkbox?.header && checkbox?.rowsSelected !== 0
                        ? (
                            <TableCell colSpan={columns.length}>
                                {checkbox.header}
                            </TableCell>
                        ) : columns
                            .map((column) => {
                                const { id, component, align, noSort } = column;
                                const key = `${router.pathname.toUpperCase()}-TABLE-HEADER-${id.toString().toUpperCase()}`
                                return (
                                    <TableCell
                                        key={key}
                                        align={align || 'left'}
                                        sortDirection={order.id === id ? order.direction : false}
                                        className={classes?.cell}
                                    >
                                        {
                                            noSort
                                                ? component
                                                : (
                                                    <TableSortLabel
                                                        active={order.id === id}
                                                        direction={order.id === id ? order.direction : 'asc'}
                                                        onClick={() => handleSortBy && handleSortBy(id)}
                                                    >
                                                        {component}
                                                    </TableSortLabel>
                                                )
                                        }
                                    </TableCell>
                                )
                            })
                }
            </TableRow>
        </TableHead>
    );
}

export default Head;
