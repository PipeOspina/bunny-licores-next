import { ReactNode, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'

export enum DialogType {
    WARNING = 'DIALOG_TYPE/WARNING',
    ERROR = 'DIALOG_TYPE/ERROR',
}

interface Props {
    message?: ReactNode;
    title?: ReactNode;
    type?: DialogType;
    resetOnClose?: boolean;
    preventClose?: boolean;
    onCancel?: () => void;
    onAccept?: () => void;
}

interface ActionArgs {
    reset?: boolean;
    preventClose?: boolean;
}

const useDialog = ({
    message = '',
    title = 'Advertencia',
    type = DialogType.WARNING,
    resetOnClose = true,
    onCancel,
    onAccept,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [props, setProps] = useState({
        message,
        title,
        type,
    });

    const setDialogProps = (key: keyof Props, value: ReactNode | DialogType | boolean) => {
        setProps((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const closeDialog = () => {
        setOpen(false);
        if (resetOnClose) {
            setTimeout(() => {
                setProps((current) => ({
                    ...current,
                    message,
                    title,
                    type,
                }))
            }, 500);
        }
    };

    const openDialog = () => setOpen(true);

    const handleCancel = ({ preventClose = false }: ActionArgs = {}) => {
        if (props.type === DialogType.WARNING) {
            !preventClose && closeDialog();
            onCancel && onCancel();
        }
    };

    const handleAccept = ({ preventClose = false }: ActionArgs = {}) => {
        !preventClose && closeDialog();
        onAccept && onAccept();
    };

    const Component = () => (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                {
                    typeof props.message === 'string'
                        ? (
                            <DialogContentText>{props.message}</DialogContentText>
                        ) : props.message
                }
            </DialogContent>
            <DialogActions>
                {
                    props.type === DialogType.WARNING
                    && (
                        <Button
                            onClick={() => handleCancel()}
                        >
                            Cancelar
                        </Button>
                    )
                }
                <Button
                    color={props.type === DialogType.ERROR ? 'secondary' : 'primary'}
                    onClick={() => handleAccept()}
                    variant="contained"
                >
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );

    return {
        Component,
        setDialogProps,
        closeDialog,
        openDialog,
    };
};

export default useDialog;
