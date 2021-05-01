import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Column } from '@interfaces/Table';

interface Props {
    columns: Column[];
    checkbox?: boolean;
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

    return (
        <TableHead className={classes?.root}>
            <TableRow className={classes?.row}>
                {
                    checkbox && (
                        <TableCell className={classes?.checkboxCell} padding="checkbox">
                            <Checkbox className={classes?.checkbox} />
                        </TableCell>
                    )
                }
                {
                    columns
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
