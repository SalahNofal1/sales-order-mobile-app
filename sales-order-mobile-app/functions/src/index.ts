import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

admin.initializeApp();

const ADMIN_EMAILS = new Set([
  'admin@gmail.com',
  'admin2@hotmail.com',
  'salahnofal602@gmail.com',
]);

async function isAdminCaller(uid: string, email: string | undefined) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (ADMIN_EMAILS.has(normalizedEmail)) return true;

  try {
    const doc = await admin.firestore().doc(`employees/${uid}`).get();
    const role = String(doc.data()?.role || '').toLowerCase();
    return role === 'admin';
  } catch {
    return false;
  }
}

export const adminSetPasswordByEmail = onCall(async (req: CallableRequest) => {
  if (!req.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in.');
  }

  const callerUid = req.auth.uid;
  const callerEmail = req.auth.token.email as string | undefined;
  const ok = await isAdminCaller(callerUid, callerEmail);
  if (!ok) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }

  const data = (req.data || {}) as { email?: string; newPassword?: string };
  const email = String(data.email || '').trim().toLowerCase();
  const newPassword = String(data.newPassword || '');

  if (!email) throw new HttpsError('invalid-argument', 'Employee email is required.');
  if (!newPassword || newPassword.trim().length < 6) {
    throw new HttpsError('invalid-argument', 'Password must be at least 6 characters.');
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password: newPassword.trim() });
    return { ok: true, uid: user.uid };
  } catch (e: any) {
    throw new HttpsError('internal', e?.message || 'Failed to update password.');
  }
});

