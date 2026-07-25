# memo.log 🌸

*A personal digital archive for the little moments that would otherwise be forgotten.*

**Live demo:** [memo-log-lime.vercel.app](https://memo-log-lime.vercel.app)

---

## Why I built this

I kept noticing that I'd live through moments, a good conversation, a recipe that finally worked, a random Tuesday that felt oddly beautiful and then forget them within weeks. Most journaling apps are either too rigid (one text box, one format) or too productivity-focused (habit trackers, streaks, gamification).

I wanted something that felt like a personal scrapbook: a place for journal entries, but also for the paintings I make, the recipes I try, the books I read and the movies that stay with me.. all in one space, tied together by AI-powered reflection.

## What it does

- **Six dedicated spaces** — Journal, Mind Notes (since ive been into psychology lately), Made This (creative work), Kitchen Diaries, Screen Time and Bookshelf — each with prompts tailored to that kind of entry
- **Google Sign-In authentication** — every user gets their own private, isolated space
- **Editable personal profile** — name, photo, intro and a custom accent color that themes the whole app
- **AI-powered weekly/monthly/yearly recaps** — Gemini reads your entries and reflects back a warm, personal summary
- **Activity heatmap** — a GitHub-style contribution graph showing which days you've documented
- **Archive with month + category filtering** — browse past entries, search across all of them, edit or delete any entry
- **Image uploads** via Cloudinary for photos attached to entries
- **Fully responsive** — works on desktop and mobile browsers

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend / Database | Firebase Firestore (real-time, per-user data) |
| Authentication | Firebase Auth (Google Sign-In) |
| Image hosting | Cloudinary |
| AI | Google Gemini API |
| Charts | Recharts |
| Deployment | Vercel |

## Architecture highlights

- Every Firestore document is tagged with `userId`, and Firestore Security Rules enforce that users can only read/write their own data — not just a client-side check, but enforced at the database level.
- All six entry types (Journal, Kitchen, Books, etc.) share one underlying data model and one reusable form/list component, configured per-category via a single `fieldsConfig.js` file — adding a new entry type takes minutes, not hours.
- The AI recap feature runs server-side (Next.js API routes) so the Gemini API key is never exposed to the client.

## Challenges I ran into (and fixed)

- **Firebase project & security setup from scratch** — configuring Firestore, Storage, and Authentication, and later hardening the security rules from an open `if true` to proper `request.auth.uid` checks.
- **Composite index requirements** — queries filtering by `userId` *and* ordering by timestamp needed a Firestore composite index, which isn't obvious until the query fails at runtime.
- **AI model deprecation** — Google retired several Gemini model versions mid-project; switched to using the `gemini-flash-latest` alias so the app doesn't break every time a specific model version is sunset.
- **Multi-user data isolation** — retrofitting an initially single-user app to properly scope every read/write by the logged-in user's ID.

## Running locally

```bash
git clone https://github.com/ayushi511/memo.log.git
cd memo.log
npm install
```

Create a `.env.local` file with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
GEMINI_API_KEY=
```

```bash
npm run dev
```

## Roadmap / what's next

- Semantic search across entries (using embeddings)
- "On this day" — surfacing entries from previous years on the same date
- AI-generated tags per entry, with tag-based filtering in the Archive
- Export a year-in-review as a downloadable PDF

---

Built solo, from an empty Next.js project to a deployed, multi-user, AI-integrated app.