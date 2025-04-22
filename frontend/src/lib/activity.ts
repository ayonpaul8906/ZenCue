import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, Timestamp, deleteDoc, getDocs } from 'firebase/firestore';

export const ActivityTypes = {
    PROFILE_UPDATE: 'profile_update',
    PAGE_VISIT: 'page_visit',
    FEATURE_USE: 'feature_use',
    SUBSCRIPTION: 'subscription',
    CHAT: 'chat',
    TTS: 'text_to_speech'
} as const;

export interface UserActivity {
    id?: string;
    type: keyof typeof ActivityTypes;
    action: string;
    details?: string;
    timestamp: Date;
}

export const logActivity = async (userId: string, activity: Omit<UserActivity, 'timestamp'>) => {
    try {
        const activitiesRef = collection(db, 'users', userId, 'activities');
        await addDoc(activitiesRef, {
            ...activity,
            timestamp: Timestamp.now()
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

export const cleanupOldActivities = async (userId: string) => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const activitiesRef = collection(db, 'users', userId, 'activities');
        const q = query(
            activitiesRef,
            where('timestamp', '<', Timestamp.fromDate(twoDaysAgo))
        );

        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error cleaning up activities:', error);
    }
};