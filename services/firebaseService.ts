import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { Manuscript, Article, Journal, User } from "@/types";
import { MOCK_USERS, MOCK_JOURNALS, MOCK_MANUSCRIPTS, MOCK_ARTICLES } from "@/mock/data";

export interface FirebaseSyncResult {
  success: boolean;
  usersCount: number;
  journalsCount: number;
  manuscriptsCount: number;
  articlesCount: number;
  error?: string;
}

export const firebaseService = {
  isConfigured(): boolean {
    return isFirebaseConfigured();
  },

  // 1-Click Data Seeder: Uploads initial mock baseline into Firestore
  async seedFirestore(): Promise<FirebaseSyncResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        usersCount: 0,
        journalsCount: 0,
        manuscriptsCount: 0,
        articlesCount: 0,
        error: "Firebase environment variables are not configured in .env.local yet.",
      };
    }

    try {
      // 1. Seed Users
      let uCount = 0;
      for (const u of MOCK_USERS) {
        await setDoc(doc(db, "users", u.id), {
          ...u,
          syncedAt: serverTimestamp(),
        });
        uCount++;
      }

      // 2. Seed Journals
      let jCount = 0;
      for (const j of MOCK_JOURNALS) {
        await setDoc(doc(db, "journals", j.id), {
          ...j,
          syncedAt: serverTimestamp(),
        });
        jCount++;
      }

      // 3. Seed Manuscripts
      let mCount = 0;
      for (const m of MOCK_MANUSCRIPTS) {
        await setDoc(doc(db, "manuscripts", m.id), {
          ...m,
          syncedAt: serverTimestamp(),
        });
        mCount++;
      }

      // 4. Seed Articles
      let aCount = 0;
      for (const a of MOCK_ARTICLES) {
        await setDoc(doc(db, "articles", a.id), {
          ...a,
          syncedAt: serverTimestamp(),
        });
        aCount++;
      }

      return {
        success: true,
        usersCount: uCount,
        journalsCount: jCount,
        manuscriptsCount: mCount,
        articlesCount: aCount,
      };
    } catch (err: any) {
      console.error("Firestore seeding error:", err);
      return {
        success: false,
        usersCount: 0,
        journalsCount: 0,
        manuscriptsCount: 0,
        articlesCount: 0,
        error: err?.message || "Failed to write to Firestore collections.",
      };
    }
  },

  // Read Manuscripts from Firestore
  async getManuscripts(): Promise<Manuscript[]> {
    if (!this.isConfigured()) return [];
    try {
      const q = query(collection(db, "manuscripts"), orderBy("submittedAt", "desc"));
      const snap = await getDocs(q);
      const list: Manuscript[] = [];
      snap.forEach((d) => list.push(d.data() as Manuscript));
      return list;
    } catch (err) {
      console.warn("Firestore getManuscripts failed:", err);
      return [];
    }
  },

  // Create new Submission in Firestore
  async createManuscript(manuscript: Manuscript): Promise<boolean> {
    if (!this.isConfigured()) return false;
    try {
      await setDoc(doc(db, "manuscripts", manuscript.id), {
        ...manuscript,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.error("Firestore createManuscript failed:", err);
      return false;
    }
  },

  // Update Status in Firestore
  async updateManuscriptStatus(id: string, status: string, timeline: any): Promise<boolean> {
    if (!this.isConfigured()) return false;
    try {
      const ref = doc(db, "manuscripts", id);
      await updateDoc(ref, {
        status,
        timeline,
        updatedAt: new Date().toISOString().split("T")[0],
      });
      return true;
    } catch (err) {
      console.error("Firestore updateManuscriptStatus failed:", err);
      return false;
    }
  },

  // Save Published Article to Firestore
  async publishArticle(article: Article): Promise<boolean> {
    if (!this.isConfigured()) return false;
    try {
      await setDoc(doc(db, "articles", article.id), {
        ...article,
        publishedAt: new Date().toISOString().split("T")[0],
      });
      return true;
    } catch (err) {
      console.error("Firestore publishArticle failed:", err);
      return false;
    }
  },

  // Audit Log writing
  async logAuditEvent(action: string, userId?: string, metadata?: any): Promise<void> {
    if (!this.isConfigured()) return;
    try {
      const logRef = doc(collection(db, "audit_logs"));
      await setDoc(logRef, {
        action,
        userId: userId || "anonymous",
        metadata: metadata || {},
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Failed to write audit log to Firestore:", err);
    }
  },
};
