import { db } from './firebase';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { auth } from './firebase'; // Import auth to get the current user

interface SubscriptionData {
  planId: number;
  planTitle: string;
  price: string;
  ethValue: string;
}

const getExpiryDate = (planId: number): Timestamp | null => {
  const now = new Date();
  let expiryTime: Date | null = null;

  switch (planId) {
    case 2: // 1 Month
      expiryTime = new Date(now.setMonth(now.getMonth() + 1));
      break;
    case 3: // 3 Months
      expiryTime = new Date(now.setMonth(now.getMonth() + 3));
      break;
    case 4: // 6 Months
      expiryTime = new Date(now.setMonth(now.getMonth() + 6));
      break;
    default:
      return null; // Unknown plan
  }

  return expiryTime ? Timestamp.fromDate(expiryTime) : null;
};

export const storeSubscription = async (subscriptionData: SubscriptionData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found.');
      throw new Error('No authenticated user found.');
    }

    const subscriptionRef = doc(db, 'subscriptions', user.uid); // Use the user's UID as the document ID for simplicity (one active sub per user)
    const expiryDate = getExpiryDate(subscriptionData.planId);

    await setDoc(subscriptionRef, {
      userId: user.uid,
      planId: subscriptionData.planId,
      planTitle: subscriptionData.planTitle,
      price: subscriptionData.price,
      ethValue: subscriptionData.ethValue,
      purchaseDate: Timestamp.now(),
      expiryDate: expiryDate, // Add the expiry date
      status: 'active', // Initial status is active
    });

    console.log('Subscription data stored successfully for user:', user.uid, 'Expiry:', expiryDate?.toDate());
    return true;
  } catch (error: any) {
    console.error('Error storing subscription data:', error.message);
    return false;
  }
};

export const getActiveSubscription = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found.');
      return null;
    }

    const subscriptionRef = doc(db, 'subscriptions', user.uid);
    const docSnap = await getDoc(subscriptionRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null; // No active subscription found for the user
    }
  } catch (error: any) {
    console.error('Error fetching active subscription:', error.message);
    return null;
  }
};