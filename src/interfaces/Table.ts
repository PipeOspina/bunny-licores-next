import { ReactNode } from "react";

export interface Column<T = any> {
    component: ReactNode;
    id: keyof T;
    noSort?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
}
