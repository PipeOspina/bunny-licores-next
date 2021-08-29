import { ShoppingCartOutlined } from '@material-ui/icons';
import { Liquor, Sell, Inventory, ManageAccounts } from '@icons/Menu';

export const MenuItems = [
	{
		name: 'Productos',
		icon: Liquor,
		path: '/productos',
	},
	{
		name: 'Ventas',
		icon: Sell,
		path: '/ventas',
	},
	{
		name: 'Compras',
		icon: ShoppingCartOutlined,
		path: '/compras',
	},
	{
		name: 'Inventario',
		icon: Inventory,
		path: '/inventario',
	},
	{
		name: 'Clientes',
		icon: ManageAccounts,
		path: '/clientes',
	},
];

export default {
	MenuItems,
};
