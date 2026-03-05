"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {

  // STATE VARIABLES

  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");

  // GOOGLE LOGIN

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  }

  // LOGOUT USER

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // FETCH USER BOOKMARKS

  async function getBookmarks(currentUser: any) {

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setBookmarks(data || []);
    }
  }

  // ADD BOOKMARK
  
  async function addBookmark() {

    if (!title || !url || !user) return;

    const { error } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          user_id: user.id
        }
      ]);

    if (error) {
      console.log(error);
    } else {
      setTitle("");
      setUrl("");
      getBookmarks(user);
    }
  }

  // DELETE BOOKMARK
  

  async function deleteBookmark(id: string) {

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
    } else {
      getBookmarks(user);
    }
  }

  // CHECK LOGIN

  useEffect(() => {

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    setUser(data.user);

    if (data.user) {
      getBookmarks(data.user);
    }
  }

  checkUser();

  // -----------------------------
  // Realtime listener
  // whenever bookmarks table changes
  // we refetch bookmarks
  // -----------------------------

  const channel = supabase
    .channel("bookmarks-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks"
      },
      () => {
        if (user) {
          getBookmarks(user);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, [user]);

  // SEARCH FILTER

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  // UI START

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "white",
        fontFamily: "Inter, sans-serif"
      }}
    >

      {/* 
      NAVBAR
       */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 40px",
          borderBottom: "1px solid #30363d"
        }}
      >

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {
          
          /* replace later with abstrabit logo */}
          <div
            style={{
              width: 32,
              height: 32,
              background: "#22c55e",
              borderRadius: 6
            }}
          />

          <h3 style={{ margin: 0 }}>Smart Bookmark Manager</h3>

        </div>

        {user && (

          <button
            onClick={logout}
            style={{
              background: "#ef4444",
              border: "none",
              padding: "8px 14px",
              color: "white",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Logout
          </button>

        )}

      </div>



      {/* 
      LOGIN SCREEN
       */}

      {!user && (

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh"
          }}
        >

          <button
            onClick={signInWithGoogle}
            style={{
              background: "#161b22",
              border: "1px solid #30363d",
              padding: "12px 24px",
              color: "white",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            🔐 Sign in with Google
          </button>

        </div>

      )}



      {/* 
      MAIN APP
       */}

      {user && (

        <div
          style={{
            maxWidth: 700,
            margin: "50px auto",
            background: "#161b22",
            padding: 30,
            borderRadius: 10,
            border: "1px solid #30363d"
          }}
        >

          {/* ADD BOOKMARK */}

          <div style={{ display: "flex", gap: 10 }}>

            <input
              placeholder="Bookmark Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                flex: 1,
                padding: 10,
                background: "#0d1117",
                border: "1px solid #30363d",
                color: "white",
                borderRadius: 6
              }}
            />

            <input
              placeholder="Bookmark URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                flex: 1,
                padding: 10,
                background: "#0d1117",
                border: "1px solid #30363d",
                color: "white",
                borderRadius: 6
              }}
            />

            <button
              onClick={addBookmark}
              style={{
                background: "#2563eb",
                border: "none",
                padding: "10px 16px",
                color: "white",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              Add
            </button>

          </div>



          {/* SEARCH */}

          <input
            placeholder="Search bookmark..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 10,
              background: "#0d1117",
              border: "1px solid #30363d",
              color: "white",
              borderRadius: 6
            }}
          />


          {/* BOOKMARK LIST */}

          <div style={{ marginTop: 30 }}>

            {filteredBookmarks.map((b: any) => (

              <div
                key={b.id}
                style={{
                  border: "1px solid #30363d",
                  padding: 15,
                  borderRadius: 8,
                  marginBottom: 10
                }}
              >

                <strong>{b.title}</strong>

                <br />

                <a
                  href={b.url}
                  target="_blank"
                  style={{ color: "#58a6ff" }}
                >
                  {b.url}
                </a>

                <br />

                <button
                  onClick={() => deleteBookmark(b.id)}
                  style={{
                    marginTop: 8,
                    background: "#ef4444",
                    border: "none",
                    padding: "6px 10px",
                    color: "white",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        </div>

      )}

    </main>
  );
}