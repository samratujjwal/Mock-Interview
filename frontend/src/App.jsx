import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import api from "./services/api";
import { setAuthHeader } from "./utils/authHeader";
import useAuthStore from "./store/useAuthStore";

const App = () => {
  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.post("/auth/refresh");
        const user = res.data?.data?.user || res.data?.user || null;
        const accessToken =
          res.data?.data?.accessToken || res.data?.accessToken || null;
        if (user && accessToken) {
          useAuthStore.getState().setUser(user, accessToken);
          setAuthHeader(accessToken);
        } else {
          useAuthStore.getState().setLoading(false);
        }
      } catch (err) {
        useAuthStore.getState().setLoading(false);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
