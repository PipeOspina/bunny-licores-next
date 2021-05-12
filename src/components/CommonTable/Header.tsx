import { Checkbox, Grow, TableCell, TableHead, TableRow, TableSortLabel, Theme, useMediaQuery } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { FC, MouseEventHandler, ReactNode, useState } from 'react';

import { Column } from '@interfaces/Table';
import { useTheme } from '@material-ui/styles';

interface Props {
    columns: Column[];
    checkbox?: {
        totalRows: number;
        rowsSelected: number;
        onClick: () => void;
        header?: ReactNode;
    };
    orderBy?: string;
    order?: 'asc' | 'desc';
    classes?: {
        root?: string;
        row?: string;
        cell?: string;
        checkboxCell?: string;
        checkbox?: string;
    };
    handleSortBy?: (id: string) => void;
}

const Head: FC<Props> = (props) => {
    const {
        columns,
        checkbox,
        classes,
        order,
        orderBy,
        handleSortBy,
    } = props;

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
                                return (
                                    <TableCell
                                        key={`${router.pathname.toUpperCase()}-TABLE-HEADER-${id.toUpperCase()}`}
                                        align={align || 'left'}
                                        sortDirection={orderBy === id ? order : false}
                                        className={classes?.cell}
                                    >
                                        {
                                            noSort
                                                ? component
                                                : (
                                                    <TableSortLabel
                                                        active={orderBy === id}
                                                        direction={orderBy === id ? order : 'asc'}
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
