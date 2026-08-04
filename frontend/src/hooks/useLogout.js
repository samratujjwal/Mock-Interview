import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import useAuthStore from "../store/useAuthStore.js";
import { clearAuthHeader } from "../utils/authHeader.js";

export default function useLogout() {
  const navigate = useNavigate();
  const clearUser = useAuthStore((s) => s.clearUser);

  return async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Proceed with client-side logout even if the request fails.
    } finally {
      clearAuthHeader();
      clearUser();
      navigate("/");
    }
  };
}
