import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { isProduction } from "@/utils/Environment";
// https://firebase.google.com/docs/web/setup#available-libraries

let analytics: any = null;
if (isProduction()) {
  const firebaseConfig = {
    apiKey: "AIzaSyBspzDzLJNzSdJmSpIka3vJmu0Sao1MdI4",
    authDomain: "nativescript-initializr.firebaseapp.com",
    projectId: "nativescript-initializr",
    storageBucket: "nativescript-initializr.appspot.com",
    messagingSenderId: "870937679413",
    appId: "1:870937679413:web:694d5518dc8d10ac8f037c",
    measurementId: "G-7GWFL2Q2V7",
  };
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
}

export const eventAnalytics = (event: EventsAnalytics) => {
  if (isProduction()) logEvent(analytics, event as string);
};

export enum EventsAnalytics {
  Download = "download",
  Share = "share",
}
