import { useEffect } from "react";

export default function OAuthSuccess({ setUser }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const role = params.get("role") || "STUDENT";
    const picture = params.get("picture");

    if (name && email) {
      setUser({
        name: name,
        role: role,
        id: email.replace(/[@.]/g, "_"),
        email: email,
        picture: picture
      });
      // Clean URL
      window.history.replaceState({}, "", "/");
    } else {
      window.location.href = "/";
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 45%, #e0f2fe 100%)"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎓</div>
        <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a2e", marginBottom: "8px" }}>
          Signing you in...
        </div>
        <div style={{ fontSize: "14px", color: "#888" }}>
          Please wait while we set up your account
        </div>
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
          <div style={{
            width: "32px", height: "32px",
            border: "3px solid #dbeafe",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}