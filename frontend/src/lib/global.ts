declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    cloudinary: any;
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
}

export interface UserUsage {
  explanationsToday: number;
  chatsToday: number;
  lastUsed: any; // or Timestamp
  plan: "free" | "silver" | "gold" | "platinum" | null;
  freeClaimed: boolean;
}



// export {};