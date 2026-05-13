import { getFunctions, httpsCallable } from 'firebase/functions';

export async function adminSetPasswordByEmail(email: string, newPassword: string) {
  const fn = httpsCallable(getFunctions(), 'adminSetPasswordByEmail');
  const res = await fn({ email, newPassword });
  return res.data as { ok: boolean; uid: string };
}

