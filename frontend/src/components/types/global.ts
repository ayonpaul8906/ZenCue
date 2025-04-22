declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface Message {
  id?: string;
  sender: string;
  text: string;
  timestamp: Date;
  isNew?: boolean; // Add this flag
}

export interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: string;
}



// export {};