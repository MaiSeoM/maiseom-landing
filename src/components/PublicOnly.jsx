import { useLocation } from "react-router-dom";

export default function PublicOnly({ children }) {
  const location = useLocation();
  const path = location.pathname || "/";

  // Cache dans l'app + auth
  if (path.startsWith("/app") || path === "/login" || path === "/signup") {
    return null;
  }

  return children;
}
