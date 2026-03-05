
# Smart Bookmark Manager

A simple full-stack bookmark manager built with **Next.js** and **Supabase**.
Users can sign in with Google, save personal bookmarks, and see updates in real-time across browser tabs.

---

## Live Demo

https://smart-bookmark-manager-blush.vercel.app/

---

## Tech Stack

* **Next.js (App Router)** – Frontend and application structure
* **Supabase** – Authentication, Database, Realtime updates
* **Tailwind CSS / Basic Styling** – UI styling
* **Vercel** – Deployment

---

## Features

* Google OAuth login (no email/password)
* Add bookmarks (Title + URL)
* Delete bookmarks
* Bookmarks are **private per user**
* **Realtime updates** across multiple tabs
* Simple responsive UI

---

## Problems Faced & How I Solved Them

During development of this project, I encountered a few challenges while integrating Supabase with the Next.js application. Below are the main issues and how they were resolved.

### 1. Row Level Security (RLS) Preventing Delete Operations

Initially, bookmark deletion was not working even though the frontend logic was correct.

**Cause:**
Supabase had Row Level Security enabled, but the required policies were not configured properly for delete operations.

**Solution:**
I created a policy allowing users to delete rows only if the `user_id` of the bookmark matches the authenticated user's ID. This ensured both security and correct functionality.

---

### 2. Ensuring User-Specific Bookmark Visibility

At first, all bookmarks were being returned from the database query.

**Cause:**
The query did not filter bookmarks based on the logged-in user's ID.

**Solution:**
I updated the query to filter records using the authenticated user's ID:

```javascript
.eq("user_id", user.id)
```

This ensured that each user can only see their own bookmarks.

---

### 3. Supabase Realtime Not Triggering Updates

Realtime updates across multiple tabs were not working initially.

**Cause:**
Realtime was not enabled for the `bookmarks` table in Supabase.

**Solution:**
I enabled realtime replication in Supabase and implemented a realtime subscription in the frontend using:

```javascript
supabase.channel("bookmarks-realtime")
```

Now when a bookmark is added or deleted in one tab, it automatically appears in other open tabs without refreshing the page.

---

### 4. Production Login Issues After Deployment

After deploying the app on Vercel, Google login initially failed.

**Cause:**
The Vercel deployment URL was not added in Supabase authentication settings.

**Solution:**
I added the deployed Vercel URL in **Supabase → Authentication → URL Configuration → Redirect URLs**, which allowed Google OAuth to redirect correctly after login.

---

These issues helped me better understand Supabase authentication, database policies, and realtime event subscriptions while integrating them with a Next.js application.


## How It Works

1. User signs in using **Google OAuth** through Supabase.
2. After login, the user's `user_id` is used to store bookmarks.
3. Each bookmark is saved in the `bookmarks` table with:

   * `title`
   * `url`
   * `user_id`
4. Queries filter bookmarks by the logged-in user's `user_id`, ensuring privacy.
5. Supabase **Realtime subscriptions** listen to changes in the bookmarks table and automatically update the UI.

---




---
## Author

Aman Kumar
amankr1705@gmail.com
+91-8252363485
