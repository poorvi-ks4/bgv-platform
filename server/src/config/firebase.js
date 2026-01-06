import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

// Resolve repo root (because you run node from /server)
const serviceAccountPath = path.resolve(
  process.cwd(),
  "..",
  "serviceAccountKey.json"
);

// Debug logs
console.log("🔥🔥 LOADING firebase.js FROM:", import.meta.url);
console.log("🔥 Service account path:", serviceAccountPath);
console.log("🔥 Service account exists:", fs.existsSync(serviceAccountPath));

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `❌ serviceAccountKey.json not found at ${serviceAccountPath}`
  );
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

console.log("🔥 Firebase Project ID:", serviceAccount.project_id);

// Initialize Firebase Admin ONCE
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

export default admin;
export { getAuth };
