import { ReactNode } from "react";

export interface Column {
    component: ReactNode;
    id: string;
    noSort?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
}
