import { ReactNode } from "react";

export interface Column<T = any> {
    component: ReactNode;
    id: keyof T;
    noSort?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
}

export interface Order<T = string> {
    direction: 'asc' | 'desc';
    id?: T;
}

export interface Pagination {
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    page: number;
}

export const initialPagination: Pagination = {
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 25, 50, 100]
}
