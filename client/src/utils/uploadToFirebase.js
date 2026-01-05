import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

export const uploadFile = async (file, folder) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("Not authenticated");

  const fileRef = ref(
    storage,
    `${folder}/${user.uid}/${Date.now()}_${file.name}`
  );

  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};
