import { useState } from "react";
import Header from "components/Header.jsx";
import Hero from "components/Hero.jsx";
import Footer from "components/Footer.jsx";

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (!email.trim()) {
      setErrMsg("Veuillez entrer un email valide.");
      return;
    }

    setLoading(true);
    try {
      // 👉 Mets ton endpoint Google Apps Script ici
      const ENDPOINT = "https://script.google.com/macros/s/TON_ID/exec";

      const params = new URLSearchParams({ email });

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error("Submit error:", err);
      setErrMsg("Oups, l’inscription a échoué. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Hero
          onSubmit={handleSubmit}
          email={email}
          setEmail={setEmail}
          loading={loading}
          submitted={submitted}
          errMsg={errMsg}
        />
      </main>
      <Footer />
    </div>
  );
}
