# PUBLICORE — Phase 2: Full Publishing Sequence & Responsive Architecture

Welcome to **PUBLICORE Phase 2**. This release delivers an end-to-end connected **Scholarly Publishing Lifecycle Sequence** and **100% Mobile, Tablet & Desktop Responsive Layouts** across all dashboards, reader portals, and submission workflows.

---

## 🌟 What's New in Phase 2?

### 1. 🔄 Complete End-to-End Publishing Lifecycle Sequence
In Phase 1, states were simulated and disjointed. In Phase 2, the publishing workflow is **interconnected and sequentially progressive**:
1. **Author Submission (`/submit`)**:
   - 8-step wizard creates a new manuscript with auto-generated code (`PUB-2026-XXXX`).
   - Automatically sets status to `"Submitted"` and notifies the sequence.
2. **Editor Desk Screening (`/dashboard/editor/screening/[id]`)**:
   - Evaluates AI scope, novelty, and rigor scores.
   - Editor clicks **"Approve & Assign Reviewers"** (moves to step 3) or **"Desk Reject"**.
3. **Reviewer Assignment (`/dashboard/editor/assign-reviewers/[id]`)**:
   - Matches candidate reviewers with AI expertise % and Conflict of Interest (COI) check.
   - Editor confirms invitations ➔ Manuscript moves to `"Under Review"`.
4. **Peer Review Workspace (`/dashboard/reviewer/workspace/[id]`)**:
   - Reviewer evaluates double-blind manuscript across 4-point rubric (Originality, Methodology, Clarity, Significance).
   - Submits confidential editor notes & author feedback with recommendation (`Accept`, `Minor Revision`, `Major Revision`, `Reject`).
5. **Editorial Decision Desk (`/dashboard/editor/decision/[id]`)**:
   - Aggregates peer review feedback.
   - Editor issues binding decision:
     - **Accept** ➔ Moves manuscript to Production desk.
     - **Revision** ➔ Returns manuscript to Author Revision Center.
     - **Reject** ➔ Rejection recorded in audit logs.
6. **Author Revision Center (`/dashboard/author/revisions/[id]`)**:
   - Author reads point-by-point reviewer comments.
   - Enters item-by-item rebuttals, uploads revised manuscript, increments to **Version 2**.
7. **Production & Ingestion Desk (`/dashboard/production`)**:
   - Lists accepted manuscripts.
   - 1-Click **"Publish & Mint DOI"** triggers Crossref DOI deposit, generates real JATS XML 1.3 metadata, and moves status to `"Published"`.
8. **Live Published Article (`/articles/[id]`)**:
   - The published manuscript is instantly live in the digital library and readable in the interactive Article Reader with themes, font scaling, and citations!

---

### 2. 📱 Fully Responsive Mobile, Tablet & Desktop UI
- **Mobile Off-Canvas Drawer**:
  - On screens `< 1024px`, the dashboard features a sticky action bar with a **"Dashboard Menu"** button that slides out a sleek drawer with backdrop blur.
- **Responsive Multi-Step Stepper**:
  - Desktop: Full horizontal 8-step stepper.
  - Mobile: Compact progress bar (`Step X of 8: [Title] - 38% Complete`) with tap-able step dots.
- **Adaptive Data Grids & Metrics**:
  - Smooth scaling from single-column on 360px phones to 4-column cards on desktop.
- **Article Reader & AI Chat Workspace**:
  - Floating reading preferences bar that wraps comfortably on mobile.
  - Collapsible side panels for research sources.

---

### 3. 💾 Persistent Storage & Live State Events
- All sequence state changes are saved to browser `localStorage` (`publicore_phase2_manuscripts` & `publicore_phase2_articles`).
- Updates broadcast custom `publicore_state_change` window events, meaning switching roles or tabs updates immediately without page refreshes.
- **1-Click "Reset Demo"**:
  - Built into the sequence bar and sidebar to reset data to clean mock defaults anytime.

---

## 🚀 Quick Start Instructions

Navigate to the `phase-2` folder:

```bash
cd phase-2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build:
```bash
npm run build
npm run start
```
