import React from "react"; // ⬅️ REQUIRED to avoid "jsx is not defined"
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <main className="container mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
