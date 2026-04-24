import { Slot, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase/config";

export default function Layout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (employee) => {
      if (employee) {
        router.replace("/cart");
      } else {
        router.replace("/login");
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) return null;

  return <Slot />;
}
