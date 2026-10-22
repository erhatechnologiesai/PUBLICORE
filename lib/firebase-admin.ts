import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import path from "path";
import fs from "fs";

let adminApp: App;

if (getApps().length === 0) {
  try {
    const keyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: "publicore-24c29",
      });
      console.log("[FIREBASE_ADMIN] Initialized with serviceAccountKey.json for project: publicore-24c29");
    } else {
      adminApp = initializeApp({
        projectId: "publicore-24c29",
      });
      console.log("[FIREBASE_ADMIN] Initialized with default projectId: publicore-24c29");
    }
  } catch (err) {
    console.warn("[FIREBASE_ADMIN] Initialization warning:", err);
    adminApp = getApps()[0] || initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

export const adminDb: Firestore = getFirestore(adminApp);
export default adminApp;
