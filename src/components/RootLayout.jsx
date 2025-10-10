// src/components/RootLayout.jsx
import Footer from "./Footer";

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
