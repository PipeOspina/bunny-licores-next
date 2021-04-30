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