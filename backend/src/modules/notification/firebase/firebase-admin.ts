import 'dotenv/config';
import * as admin from 'firebase-admin';
import { existsSync, readFileSync } from 'fs';

let firebaseMessaging: admin.messaging.Messaging | null = null;

try {
    const firebasePath =
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    console.log(
        'firebasePath:',
        firebasePath,
    );

    console.log(
        'exists:',
        firebasePath
            ? existsSync(firebasePath)
            : false,
    );
    if (
        firebasePath &&
        existsSync(firebasePath)
    ) {
        const serviceAccount = JSON.parse(
            readFileSync(firebasePath, 'utf8'),
        );

        const app =
            admin.apps.length > 0
                ? admin.app()
                : admin.initializeApp({
                    credential:
                        admin.credential.cert(
                            serviceAccount,
                        ),
                });

        firebaseMessaging = app.messaging();

        console.log(
            '[Firebase] Initialized successfully',
        );
    } else {
        console.warn(
            '[Firebase] Service account not found, running in mock mode',
        );
    }
} catch (error) {
    console.error(
        '[Firebase] Initialization failed:',
        error,
    );
}

export { firebaseMessaging };