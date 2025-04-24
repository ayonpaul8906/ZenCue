declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    cloudinary: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export interface Message {
  id?: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  userId?: string;
  conversationId?: string;
  contextId?: string;
  isNew?: boolean;
}

export interface UserUsage {
  explanationsToday: number;
  chatsToday: number;
  lastUsed: any; // or Timestamp
  plan: "free" | "silver" | "gold" | "platinum" | null;
  freeClaimed: boolean;
}

export interface PlanLimits {
  textexplanations: number;
  imageexplanations: number;
  chats: number;
  mindzone: boolean;
}

export interface SubscriptionPlan {
  id: number;
  title: string;
  emoji: string;
  color: string;
  borderColor: string;
  buttonColor: string;
  description: string;
  features: string[];
  price: string;
  ethValue: string;
  limits: PlanLimits;
}

export interface UserSubscription {
  userId: string;
  planId: number;
  planTitle: string;
  price: string;
  ethValue: string;
  purchaseDate: any; // FirebaseTimestamp
  status: 'active' | 'inactive';
  limits: PlanLimits;
}

// export {};