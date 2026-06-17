import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageShell({ children, hideFooter = false }: { children: React.ReactNode; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

