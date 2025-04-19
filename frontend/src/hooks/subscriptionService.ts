import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface UserSubscription {
  plan: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export const saveSubscriptionPlan = async (uid: string, planDetails: UserSubscription) => {
  const ref = doc(db, 'subscriptions', uid);
  await setDoc(ref, planDetails);
};

export const getCurrentSubscription = async (uid: string): Promise<UserSubscription | null> => {
  const ref = doc(db, 'subscriptions', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserSubscription) : null;
};
