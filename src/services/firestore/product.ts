import firebase from 'firebase';
import { IProduct, IProductMod } from '@interfaces/Product';
import { db } from '../firebaseClient';
import { IUser } from '@interfaces/User';
import { ModificationTypes } from '@constants/product';
import { TCommonReference } from '@interfaces/Global';
import { uploadImage } from '@services/storage/product';
import { Subscription } from 'rxjs';

type ProductRef = TCommonReference<IProduct>;

const products = db.collection('Products');

const mods = (id, ref?: ProductRef) => (
    ref?.collection('Modifications')
    || products
        .doc(id)
        .collection('Modifications')
);

export const createRef = (): ProductRef => {
    return products.doc();
}

export const createModRef = (
    productId: string,
    productRef?: ProductRef,
) => {
    return mods(productId, productRef).doc();
}

export const addProduct = async (
    product: IProduct,
    { name, id, email }: IUser,
    image?: File,
    imageHandlers?: {
        getSubscribtion: (subscription: Subscription) => void,
        onError: (error: firebase.storage.FirebaseStorageError) => void;
        onSnapshot?: (snapshot) => void;
        onComplete?: () => void;
    },
): Promise<ProductRef> => {
    const docRef = createRef();
    const modRef = createModRef(docRef.id, docRef);

    product.id = docRef.id;

    const mod: IProductMod = {
        date: new Date(),
        fields: { ...product },
        user: { name, id, email },
        type: ModificationTypes.CREATE,
        id: modRef.id,
    }

    product.lastModification = {
        type: mod.type,
        id: mod.id,
        ref: modRef,
    };

    if (image) {
        await new Promise((res) => {
            const { imageRef, observable } = uploadImage(docRef.id, modRef.id, image)
            const sub = observable
                .subscribe({
                    complete: async () => {
                        const url = await imageRef.getDownloadURL()
                        product.image = url;
                        await docRef.set(product);
                        await modRef.set(mod);
                        imageHandlers.onComplete();
                        res(null);
                    },
                    error: imageHandlers.onError,
                    next: imageHandlers.onSnapshot,
                });
            imageHandlers.getSubscribtion(sub);
        });
    } else {
        await docRef.set(product);
        await modRef.set(mod);
    }

    return docRef;
}

export const addModification = async (
    modification: IProductMod,
    productId: string,
    ref?: ProductRef,
) => {
    const modRef = ref || createModRef(productId)
    await modRef.set(modification)
}
