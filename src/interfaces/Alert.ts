export interface IAlert {
    id: string;
    title: string;
    message: string;
    show: boolean;
    acceptAction?: () => void;
    cancelAction?: () => void;
    cancelButton?: boolean;
}

export const initialAlert: IAlert = {
    id: '',
    message: '',
    title: '',
    show: false,
}
