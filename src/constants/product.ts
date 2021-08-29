import { Column } from '@interfaces/Table';
import { IProduct } from '@interfaces/Product';

type ProductTableHeaders = (Column<IProduct> & {
	mobile?: boolean;
	tablet?: boolean;
})[];

export const TableHeaders: ProductTableHeaders = [
	{
		component: 'Foto',
		id: 'images',
		tablet: true,
		align: 'center',
	},
	{
		component: 'Código de Barras',
		id: 'barcode',
		tablet: true,
	},
	{
		component: 'Nombre',
		id: 'name',
		mobile: true,
	},
	{
		component: 'En Inventario',
		id: 'stockQuantity',
		align: 'center',
	},
	{
		component: 'Vendidos',
		id: 'soldQuantity',
		align: 'center',
	},
	{
		component: 'Precio Compra',
		id: 'buyPrice',
		tablet: true,
		align: 'right',
	},
	{
		component: 'Precio Venta',
		id: 'sellPrice',
		mobile: true,
		align: 'right',
	},
];

export default {
	TableHeaders,
};
