import { IRelatedProduct } from './../interfaces/Product';
import { Order } from './../interfaces/Table';
import { IProduct } from '@interfaces/Product';
import { FireAuthErrorTypes } from "@constants/error";
import { IAlert, initialAlert } from "@interfaces/Alert";

export const getAlerFromFireAuthError = (
    errorCode: FireAuthErrorTypes,
    alertId: string,
): IAlert => {
    const alert: IAlert = {
        ...initialAlert,
        id: alertId,
        title: 'Error al iniciar sesión',
        show: true,
    }
    switch (errorCode) {
        case FireAuthErrorTypes.INTERNAL_ERROR: {
            return {
                ...alert,
                message: 'Ocurrió un error inesperado al <b>Iniciar Sesión</b>, intentalo nuevamente y si el error persiste comunicate con <b>Pipe</b> :p',
            }
        }
        case FireAuthErrorTypes.POPUP_CLODES: {
            return {
                ...alert,
                message: 'Se cerró el mensaje de <b>Inicio de Sesión</b> antes de tiempo, inténtalo nuevamente sin cerrar la ventana emergente',
            }
        }
        case FireAuthErrorTypes.USER_DISABLED: {
            return {
                ...alert,
                message: 'Estás <b>inhabilitado</b> para entrar a administrar <strong>Bunny Licores</strong>, pídele a <b>Pipe</b> que te habilite nuevamente',
            }
        }
        default: {
            return {
                ...alert,
                message: `Ocurrió un error inesperado al <b>Iniciar Sesión</b>, muestrale a Pipe este mensaje pa que lo arregle jaja <code>${errorCode}</code>`,
            }
        }
    }
}

export const sortProducts = (
    products: IProduct[],
    order: Order<keyof IProduct>,
) => {
    return products
        .slice(0, products.length)
        .sort((productA, productB) => {
            const creationA = productA.creation.date;
            const creationB = productB.creation.date;

            const defaultOrderAsc = creationA < creationB
                ? -1
                : creationA > creationB
                    ? 1
                    : 0;

            const defaultOrderDesc = creationA > creationB
                ? -1
                : creationA < creationB
                    ? 1
                    : 0;

            const defaultOrder = order.direction === 'desc'
                ? defaultOrderAsc
                : defaultOrderDesc

            return order.id !== undefined && order.id !== 'barcode'
                ? defaultOrderAsc
                : defaultOrder;
        })
        .sort((productA, productB) => {
            const isAsc = order.direction === 'desc';

            const valueA = productA[order.id];
            const valueB = productB[order.id];

            const parsedA = typeof valueA === 'string'
                ? valueA.toLowerCase()
                : valueA;

            const parsedB = typeof valueB === 'string'
                ? valueB.toLowerCase()
                : valueB;

            const defaultAsc = parsedA < parsedB
                ? -1
                : parsedA > parsedB
                    ? 1
                    : 0;

            const defaultDesc = parsedA > parsedB
                ? -1
                : parsedA < parsedB
                    ? 1
                    : 0;

            switch (order.id) {
                case undefined: {
                    return 0;
                }
                case 'images': {
                    const hasImagesA = productA.images;
                    const hasImagesB = productB.images;
                    return hasImagesA && hasImagesB
                        ? 0
                        : hasImagesA
                            ? isAsc
                                ? 1
                                : -1
                            : hasImagesB
                                ? isAsc
                                    ? -1
                                    : 1
                                : 0
                }
                default: {
                    return isAsc
                        ? defaultAsc
                        : defaultDesc;
                }
            }
        });
}

export const convertProductToRelated = (product: IProduct): IRelatedProduct => {
    const related = {
        barcode: product.barcode,
        name: product.name,
        sellPrice: product.sellPrice,
        stockQuantity: product.stockQuantity,
        defaultImage: product.images?.default,
        description: product.description,
        ref: product.ref,
        sellDeposit: product.sellDeposit,
    }
    
    Object.entries(related).forEach(([key, value]) => {
        if (value === undefined) {
            delete related[key]
        }
    })

    return related;
};
