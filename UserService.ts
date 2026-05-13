import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createUserProfile = async (userId: string, data: any) => {
await setDoc (doc(db, "employees", userId), data);
};