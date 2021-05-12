import { Column } from "@interfaces/Table";

type ProductTableHeaders = (Column & { mobile?: boolean, tablet?: boolean })[];

export const TableHeaders: ProductTableHeaders = [
    {
        component: 'Foto',
        id: 'image',
        tablet: true,
        align: 'center'
    }, {
        component: 'Código de Barras',
        id: 'barcode',
        tablet: true,
    }, {
        component: 'Nombre',
        id: 'name',
        mobile: true,
    }, {
        component: 'En Inventario',
        id: 'stockQuantity',
        align: 'center'
    }, {
        component: 'Vendidos',
        id: 'soldQuantity',
        align: 'center'
    }, {
        component: 'Precio',
        id: 'price',
        mobile: true,
        align: 'center'
    },
];

export enum ModificationTypes {
    CREATE = 'MODIFICATION_TYPE/CREATE',
    UPDATE = 'MODIFICATION_TYPE/UPDATE',
    DELETE = 'MODIFICATION_TYPE/DELETE',
}
