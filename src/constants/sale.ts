import { Column } from '@interfaces/Table';

type SaleTableHeaders = (Column & { mobile?: boolean; tablet?: boolean })[];

export const TableHeaders: SaleTableHeaders = [
	{
		component: 'Referencia',
		id: 'reference',
	},
	{
		component: 'Cliente',
		id: 'client',
		mobile: true,
	},
	{
		component: 'Metodo de Pago',
		id: 'paymentMethod',
	},
	{
		component: 'Fecha',
		id: 'date',
		tablet: true,
	},
	{
		component: 'Valor',
		id: 'price',
		align: 'right',
		mobile: true,
	},
	{
		component: 'Acciones',
		id: 'Actions',
		align: 'center',
		noSort: true,
	},
];

export const MobileTableHeaders = TableHeaders.filter(
	(column) => column.mobile,
);

export const TabletTableHeaders = TableHeaders.filter(
	(column) => column.mobile || column.tablet,
);
