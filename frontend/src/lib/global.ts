declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
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



// export {};