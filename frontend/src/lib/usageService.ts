import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const PLAN_LIMITS = {
  free: { textexplanations: 5, imageexplanations: 5, chats: 10, mindzone: false }, // Total limit, not per day
  silver: { textexplanations: 10, imageexplanations: 10, chats: 30, mindzone: true }, // Per day
  gold: { textexplanations: 20, imageexplanations: 20, chats: 60, mindzone: true }, // Per day
  platinum: { textexplanations: 30, imageexplanations: 30, chats: 100, mindzone: true }, // Per day
  none: { textexplanations: 0, imageexplanations: 0, chats: 0, mindzone: false }
};

export async function getUserUsage(uid: string) {
  try {
    // 1. Get subscription status
    const subRef = doc(db, 'subscriptions', uid);
    const subSnap = await getDoc(subRef);
    let plan = 'none';
    
    if (subSnap.exists()) {
      const subData = subSnap.data();
      if (subData.status === 'active') {
        if (subData.planId === 1) plan = 'free';
        else if (subData.planId === 2) plan = 'silver';
        else if (subData.planId === 3) plan = 'gold';
        else if (subData.planId === 4) plan = 'platinum';
      }
    }

    // For free plan
    if (plan === 'free' || plan === 'none') {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      return {
        textexplanations: userData.totalTextExplanations || 0,
        imageexplanations: userData.totalImageExplanations || 0,
        chatsToday: userData.totalChats || 0,
        plan,
        limits: PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS],
        mindzone: false // Explicitly set mindzone to false for free plan
      };
    }

    // For paid plans
    const today = new Date().toISOString().slice(0, 10);
    const usageRef = doc(db, 'users', uid, 'usage', today);
    const usageSnap = await getDoc(usageRef);
    let usageData = usageSnap.exists()
      ? usageSnap.data()
      : { textexplanations: 0, imageexplanations: 0, chatsToday: 0 };
    
    return {
      ...usageData,
      plan,
      limits: PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS],
      mindzone: true // Paid plans have mindzone access
    };
  } catch (error) {
    console.error('Error getting user usage:', error);
    return {
      textexplanations: 0,
      imageexplanations: 0,
      chatsToday: 0,
      plan: 'none',
      limits: PLAN_LIMITS.none,
      mindzone: false // Default to no mindzone access
    };
  }
}

export async function incrementUsage(uid: string, type: "textexplanations" | "imageexplanations" | "chatsToday") {
  try {
    const subRef = doc(db, 'subscriptions', uid);
    const subSnap = await getDoc(subRef);
    let plan = 'none';
    if (subSnap.exists()) {
      const subData = subSnap.data();
      if (subData.status === 'active') {
        if (subData.planId === 1) plan = 'free';
        else if (subData.planId === 2) plan = 'silver';
        else if (subData.planId === 3) plan = 'gold';
        else if (subData.planId === 4) plan = 'platinum';
      }
    }

    if (plan === 'free') {
      // For free plan, increment total usage in user doc
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      // Fix: Use correct field names for free plan
      const fieldName = type === 'textexplanations' ? 'totalTextExplanations' : 
      type === 'imageexplanations' ? 'totalImageExplanations' : 
      type === 'chatsToday' ? 'totalChats' : 'totalChats';
      
      const currentValue = userSnap.exists() ? (userSnap.data()?.[fieldName] || 0) : 0;
      await setDoc(userRef, {
        [fieldName]: currentValue + 1
      }, { merge: true });
    } else {
      // For paid plans, increment daily usage
      const today = new Date().toISOString().slice(0, 10);
      const usageRef = doc(db, 'users', uid, 'usage', today);
      const usageSnap = await getDoc(usageRef);
      let data = usageSnap.exists()
        ? usageSnap.data()
        : { textexplanations: 0, imageexplanations: 0, chatsToday: 0 };
      data[type] = (data[type] || 0) + 1;
      await setDoc(usageRef, { ...data, lastUsed: serverTimestamp() }, { merge: true });
    }
  } catch (error) {
    console.error('Error incrementing usage:', error);
    throw error;
  }
}

export function getPlanLimits(plan: string | null) {
  if (!plan || plan === 'none') return PLAN_LIMITS.none;
  return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
}
