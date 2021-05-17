import { ReactNode } from "react";

export interface Column<T> {
    component: ReactNode;
    id: keyof T;
    noSort?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
}
