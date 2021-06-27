import { convertProductToRelated } from './../../utils/functions';
import { IFireProductModRef, IRelatedProduct } from './../../interfaces/Product';
import firebase from 'firebase/app';
import { IFireProduct, IProductMod, IProduct, IProductModRef } from '@interfaces/Product';
import { db } from '../firebaseClient';
import { IUser } from '@interfaces/User';
import { ModificationTypes } from '@constants/product';
import { TCommonQuerySnapshot, TCommonReference } from '@interfaces/Global';
import { uploadImage } from '@services/storage/product';
import { Observable, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';

type ProductRef<T = IFireProduct> = TCommonReference<T>;
type QuerySnapshot<T = IFireProduct> = TCommonQuerySnapshot<T>;

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
    images?: {
        defaultIndex: number,
        all: File[],
    },
    handlers?: {
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
        date: mod.date,
    };

    product.creation = product.lastModification;

    if (images?.all.length) {
        await new Promise((resolve) => {
            const results = images.all.map(
                (image, index) => uploadImage(
                    docRef.id,
                    `${modRef.id}-${index}`,
                    image,
                ),
            )

            const observable = merge(...results.map((res) => res.observable));

            const sub = observable.subscribe({
                complete: async () => {
                    product.images.all = await Promise.all(
                        results.map(async (res) => ({
                            publicURL: (await res.imageRef.getDownloadURL()) as string,
                            storePath: res.imageRef.fullPath,
                        })),
                    );

                    product.images.default = product.images.all.find(
                        (_i, index) => index === images.defaultIndex,
                    );

                    if (!product.images?.default) {
                        delete product.images;
                    }

                    await docRef.set(product);
                    await modRef.set(mod);
                    handlers.onComplete && handlers.onComplete();

                    resolve(null);
                },
                error: handlers.onError,
                next: handlers.onSnapshot,
            });

            handlers.getSubscribtion(sub);
        })
    } else {
        delete product.images;
        await docRef.set(product);
        await modRef.set(mod);
        handlers.onComplete && handlers.onComplete();
    }

    await Promise.all(
        product.relatedProducts?.map(async (related) => {
            const relatedRef = await related.ref.get();
            const relatedData = relatedRef.data();
            const productRelated = convertProductToRelated({
                ...product,
                ref: docRef,
            });

            await related
                .ref
                .update({
                    relatedProducts: relatedData.relatedProducts
                        ? [
                            ...relatedData.relatedProducts,
                            productRelated,
                        ]
                        : [productRelated],
                });
        })
        || []
    );

    return docRef;
}

export const getProducts = () => {
    return new Observable<QuerySnapshot>((observer) => {
        products
            .onSnapshot(
                (res: QuerySnapshot) => { observer.next(res) },
                (err) => { observer.error(err) },
                () => { observer.complete(); console.log('complete (?)') },
            )
    })
        .pipe(
            map((res) => {
                const prods = res
                    .docs
                    .map((doc) => {
                        const data = doc.data();
                        const lastModification = {
                            ...data.lastModification,
                            date: data.lastModification.date.toDate(),
                        };
                        const creation = {
                            ...data.creation,
                            date: data.creation.date.toDate(),
                        };
                        return { ...data, ref: doc.ref, lastModification, creation };
                    })
                return { ...res, data: prods }
            }),
        );
}
