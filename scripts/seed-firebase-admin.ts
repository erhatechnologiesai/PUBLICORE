import { adminDb } from "../lib/firebase-admin";
import { MOCK_USERS, MOCK_JOURNALS, MOCK_MANUSCRIPTS, MOCK_ARTICLES } from "../mock/data";

async function seedDatabase() {
  console.log("\n========================================================");
  console.log("   POPULATING GOOGLE CLOUD FIRESTORE: publicore-24c29   ");
  console.log("========================================================\n");

  try {
    // 1. Seed Users Collection
    console.log("[1/5] Writing 'users' collection...");
    let userCount = 0;
    for (const user of MOCK_USERS) {
      await adminDb.collection("users").doc(user.id).set({
        ...user,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      userCount++;
      console.log(`  ✔ User created: ${user.name} (${user.role}) -> ID: ${user.id}`);
    }

    // 2. Seed Journals Collection
    console.log("\n[2/5] Writing 'journals' collection...");
    let journalCount = 0;
    for (const journal of MOCK_JOURNALS) {
      await adminDb.collection("journals").doc(journal.id).set({
        ...journal,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      journalCount++;
      console.log(`  ✔ Journal created: ${journal.title} -> ID: ${journal.id}`);
    }

    // 3. Seed Manuscripts Collection
    console.log("\n[3/5] Writing 'manuscripts' collection...");
    let msCount = 0;
    for (const ms of MOCK_MANUSCRIPTS) {
      await adminDb.collection("manuscripts").doc(ms.id).set({
        ...ms,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      msCount++;
      console.log(`  ✔ Manuscript created: [${ms.code}] ${ms.title.slice(0, 36)}... (${ms.status})`);
    }

    // 4. Seed Articles Collection (Published Repository)
    console.log("\n[4/5] Writing 'articles' collection...");
    let artCount = 0;
    for (const art of MOCK_ARTICLES) {
      await adminDb.collection("articles").doc(art.id).set({
        ...art,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      artCount++;
      console.log(`  ✔ Article created: DOI ${art.doi} -> ID: ${art.id}`);
    }

    // 5. Seed Audit Log Event
    console.log("\n[5/5] Writing 'audit_logs' collection...");
    const auditRef = adminDb.collection("audit_logs").doc();
    await auditRef.set({
      id: auditRef.id,
      action: "FIREBASE_INITIAL_SEED",
      projectId: "publicore-24c29",
      seededBy: "PUBLICORE Administrator",
      counts: {
        users: userCount,
        journals: journalCount,
        manuscripts: msCount,
        articles: artCount,
      },
      timestamp: new Date().toISOString(),
    });
    console.log(`  ✔ Audit record created -> ID: ${auditRef.id}`);

    console.log("\n========================================================");
    console.log("   🎉 SUCCESS: FIRESTORE DATABASE FULLY CREATED!       ");
    console.log("========================================================");
    console.log(`  • Users in Cloud Firestore:        ${userCount}`);
    console.log(`  • Journals in Cloud Firestore:     ${journalCount}`);
    console.log(`  • Manuscripts in Cloud Firestore:  ${msCount}`);
    console.log(`  • Published Articles in Firestore: ${artCount}`);
    console.log(`  • Audit Records in Firestore:      1`);
    console.log("========================================================\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Error seeding Firebase Firestore:", err);
    process.exit(1);
  }
}

seedDatabase();
