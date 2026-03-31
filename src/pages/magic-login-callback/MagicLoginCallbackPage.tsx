import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/Api";

type CallbackResponse = {
  two_factor?: string;
};

export function MagicLoginCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const api = useMemo(() => apiClient, []);
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const query = location.search.startsWith("?") ? location.search.slice(1) : location.search;
      if (!query) {
        if (isMounted) {
          navigate("/onboarding/magic-login", {
            replace: true,
            state: { error: "Invalid magic link. Please request a new one." },
          });
        }
        return;
      }

      try {
        const response = await api.get<CallbackResponse>(`/api/magic-login?${query}`);
        const token = response?.two_factor?.trim();
        if (!token) {
          throw new Error("Missing two_factor token.");
        }
        navigate("/onboarding/multi-factor", {
          replace: true,
          state: { twoFactorToken: token },
        });
      } catch {
        if (isMounted) {
          navigate("/onboarding/magic-login", {
            replace: true,
            state: { error: "Could not verify magic link. Please request a new email link." },
          });
        }
      } finally {
        if (isMounted) setIsResolving(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [api, location.search, navigate]);

  if (isResolving) return null;
  return null;
}
