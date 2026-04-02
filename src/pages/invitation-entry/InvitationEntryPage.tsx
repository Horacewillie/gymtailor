import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api/Api";

export function InvitationEntryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { invitationId } = useParams<{ invitationId: string }>();

  useEffect(() => {
    const id = invitationId?.trim() ?? "";
    const query = location.search.startsWith("?") ? location.search : `?${location.search}`;
    const params = new URLSearchParams(query);
    const signature = params.get("signature") ?? "";
    const expires = params.get("expires") ?? "";

    if (!id || !signature || !expires) {
      navigate("/onboarding/create-account", { replace: true });
      return;
    }

    const canonicalInvitationUrl = `${API_BASE_URL}/api/invitation/${encodeURIComponent(id)}/view${query}`;
    localStorage.setItem("pendingInvitationId", id);
    localStorage.setItem("pendingInvitationSignature", signature);
    localStorage.setItem("pendingInvitationExpires", expires);
    localStorage.setItem("pendingInvitationUrl", canonicalInvitationUrl);

    navigate("/onboarding/create-account", { replace: true });
  }, [invitationId, location.search, navigate]);

  return null;
}
