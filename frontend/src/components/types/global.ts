declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: string;
}

// export {};