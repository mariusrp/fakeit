import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDzuxtP6CVDf_nPekeL6kyBdPE1DoPgpNs",
  authDomain: "game-700aa.firebaseapp.com",
  projectId: "game-700aa",
  storageBucket: "game-700aa.firebasestorage.app",
  messagingSenderId: "830277933538",
  appId: "1:830277933538:web:9856d7d47ce3e41f5dc1bb",
  measurementId: "G-55L2SV349R",
  databaseURL:
    "https://game-700aa-default-rtdb.europe-west1.firebasedatabase.app/",
};

class FirebaseService {
  private _app: FirebaseApp;
  private _database: Database;

  constructor() {
    this._app = initializeApp(firebaseConfig);
    this._database = getDatabase(this._app);
  }

  get database(): Database {
    return this._database;
  }

  get app(): FirebaseApp {
    return this._app;
  }
}

// Singleton instance
export const firebaseService = new FirebaseService();
export const database = firebaseService.database;
export default firebaseService;
