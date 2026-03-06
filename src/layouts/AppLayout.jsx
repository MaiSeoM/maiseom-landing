import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { supabase } from "../supabaseClient.js";

const GRAD = "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)";

export default function AppLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("maiseom_selected_plan");
      sessionStorage.clear();
      navigate("/", { replace: true });
      window.location.reload();
    } catch (e) {
      console.error("Logout error:", e);
      alert("Impossible de se déconnecter. Réessaie.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos/maiseom-logo.png" alt="MaiSeoM" className="h-8" />
            <span className="font-extrabold">MaiSeoM</span>
          </Link>
          <div className="text-sm text-gray-700">
            {user?.email} • <span className="font-semibold">{user?.plan}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 py-6">
        <aside className="md:sticky md:top-20 h-max">
          <nav className="rounded-2xl border bg-white shadow-sm p-3">
            
            
            <Item to="/app" end>
              Dashboard
            </Item>
            <Item to="/app/audit">Lancer un audit</Item>
            <Item to="/app/parrainage">MaiSeoM Parrainage</Item>
            <Item to="/app/mon-espace">Mon espace</Item>
            <Item to="/app/settings">Paramètres</Item>

            <button
              className="mt-3 w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundImage: GRAD }}
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </nav>
        </aside>

        <main className="min-h-[60vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Item({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg text-sm font-semibold ${
          isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export { AppLayout };