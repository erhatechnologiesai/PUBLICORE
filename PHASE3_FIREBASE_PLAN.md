# Phase 3: Google Firebase & Cloud Firestore Database Architecture

**Platform:** PUBLICORE Scholarly Publishing Engine  
**Target Scope:** `PUBLICORE-main/phase-2`  
**Database Engine:** **Google Cloud Firestore (NoSQL Document Store)**  
**Storage Engine:** **Firebase Cloud Storage** (Binary PDFs, Figures & JATS XML)  
**Security Engine:** **Firestore Security Rules** (Double-Blind & RBAC)

---

## 1. Why Firebase Firestore is an Excellent Choice for PUBLICORE

1. **Real-Time Subscriptions (`onSnapshot`)**:
   - Editors aur Authors ko live notifications milti hain jab reviewer feedback submit ho ya manuscript production me publish ho, bina browser refresh kiye.
2. **Integrated Binary Storage (Firebase Storage)**:
   - Manuscripts ke original PDFs aur high-resolution supplementary images ko directly Google Cloud Storage buckets me upload aur serve kiya ja sakta hai.
3. **Zero DevOps & Serverless Auto-Scaling**:
   - Koi local database server ya connection pool manage nahi karna parta.
4. **Fine-Grained Security Rules**:
   - Single-blind aur double-blind peer review policies Firestore rules ke zariye database-level par enforce hoti hain.

---

## 2. Firestore Document Collections Schema

- **`users`**: `{ id, email, name, role, orcid, institution, hIndex, researchInterests, createdAt }`
- **`journals`**: `{ id, slug, title, issn, impactFactor, acceptanceRate, chiefEditorName }`
- **`manuscripts`**: `{ id, code, title, abstract, keywords, status, journalId, submittingUserId, doi, jatsXml, authors, timeline, reviewerComments, aiScreenReport }`
- **`articles`**: `{ id, slug, doi, title, abstract, journalId, volume, issue, metrics, sections, references, publishedAt }`
- **`audit_logs`**: `{ id, action, userId, metadata, timestamp }`

---

## 3. Implemented Files in `phase-2`

1. **`lib/firebase.ts`**: Firebase app, Firestore, Auth, aur Storage initialization.
2. **`services/firebaseService.ts`**: CRUD operations, real-time listeners, aur 1-click mock data seeder.
3. **`firestore.rules`**: Academic publishing security rules (Double-blind protection & RBAC).
4. **`app/dashboard/database/page.tsx`**: Interactive Firebase Control & Telemetry Desk.

---

## 4. How to Connect Your Real Firebase Project

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** in Build tab.
3. Register a Web App in Project Settings to get `firebaseConfig`.
4. Put the values in `phase-2/.env.local`.
5. Open `http://localhost:3000/dashboard/database` and click **"Seed / Sync to Firestore"**!
