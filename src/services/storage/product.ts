import firebase from 'firebase';
import { Observable } from 'rxjs';
import { storage } from '../firebaseClient';

const folder = storage.ref('images/Products')

export const uploadImage = (productId: string, imageId: string, image: File) => {
    const uploadTask = folder
        .child(productId)
        .child(imageId)
        .put(image);

    const observable = new Observable<firebase.storage.UploadTaskSnapshot>(
        (observer) => {
            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                (res) => { observer.next(res) },
                (err) => { observer.error(err) },
                () => { observer.complete() }
            )
        }
    );

    const { ref: imageRef } = uploadTask.snapshot;

    return { observable, imageRef };
}
