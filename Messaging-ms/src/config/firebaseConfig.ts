import * as admin from "firebase-admin";
import { Messaging } from "firebase-admin/lib/messaging";

// Path to your Firebase service account JSON
import serviceAccount from "./serviceAccountKey.json";

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// Export the messaging instance
const messaging: Messaging = admin.messaging();
export default messaging;