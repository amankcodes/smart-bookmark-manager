
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

## Database Schema

Table: `bookmarks`

Columns:

* `id` (uuid, primary key)
* `created_at` (timestamp)
* `user_id` (uuid)
* `title` (text)
* `url` (text)

---

## Problems Faced and Solutions

### 1. Delete Operation Not Working

Initially the delete button did not remove bookmarks.

**Cause:**
Supabase Row Level Security (RLS) policy did not allow delete operations.

**Solution:**
Created a delete policy allowing users to delete rows where conditions were satisfied.

---

### 2. User Data Visibility Issue

At first all bookmarks were visible to every user.

**Cause:**
Queries were fetching all rows without filtering by user.

**Solution:**
Added filtering based on the logged-in user's ID:

```javascript
.eq("user_id", user.id)
```

This ensured each user only sees their own bookmarks.

---

### 3. Realtime Updates Not Triggering

Bookmarks were not updating across multiple tabs.

**Cause:**
Supabase Realtime was not enabled for the table.

**Solution:**

* Enabled **Realtime** in Supabase for the `bookmarks` table.
* Added a realtime listener using:

```javascript
supabase.channel("bookmarks-realtime")
```

Now updates appear instantly across open tabs.

---

## Future Improvements

* Bookmark categories or tags
* Bookmark editing feature
* Better UI/UX improvements
* Bookmark preview cards

---
## Author

Aman Kumar
amankr1705@gmail.com
+91-8252363485
