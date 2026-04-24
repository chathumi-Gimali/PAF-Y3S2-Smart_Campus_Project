import { useState, useEffect } from "react";

export default function Login({ setUser }) {
  const [mounted, setMounted] = useState(false);
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const slides = [
    { title: "Smart Campus Operations Hub", desc: "The centralized platform for SLIIT campus facility and resource management." },
    { title: "Book Resources Easily", desc: "Reserve lecture halls, labs, study areas and equipment in seconds." },
    { title: "Track & Manage Incidents", desc: "Report and track maintenance issues with real-time status updates." },
  ];

  const ACCOUNTS = {
    "student@sliit.lk":     { password: "123456", role: "STUDENT",    name: "John Student" },
    "lecturer@sliit.lk":    { password: "123456", role: "LECTURER",   name: "Dr. Smith" },
    "admin@sliit.lk":       { password: "123456", role: "ADMIN",      name: "Admin User" },
    "technician@sliit.lk":  { password: "123456", role: "TECHNICIAN", name: "Tech Mike" },
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const validate = (field, value) => {
    if (field === "email") {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email";
    }
    if (field === "password") {
      if (!value) return "Password is required";
      if (value.length < 6) return "Min 6 characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) setErrors({ ...errors, [name]: validate(name, value) });
    setServerError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      email: validate("email", form.email),
      password: validate("password", form.password),
    };
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (Object.values(newErrors).some(e => e)) return;

    setLoading(true);
    setServerError("");

    setTimeout(() => {
      const account = ACCOUNTS[form.email.toLowerCase()];
      if (!account || account.password !== form.password) {
        setServerError("Invalid email or password. Check the hint below.");
        setLoading(false);
        return;
      }
      setUser({ name: account.name, role: account.role, id: account.role.toLowerCase() + "001" });
    }, 800);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes textFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ripple   { 0%{transform:scale(1);opacity:0.35} 100%{transform:scale(2.4);opacity:0} }
        @keyframes cardIn   { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes orbDrift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12px,-10px)} }
        @keyframes iconBob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .sc-input { transition:all 0.2s ease !important; font-family:'Plus Jakarta Sans',sans-serif !important; }
        .sc-input:focus { outline:none !important; border-color:#1e3a8a !important; box-shadow:0 0 0 3px rgba(30,58,138,0.11) !important; background:#f0f5ff !important; }
        .sc-btn { position:relative; overflow:hidden; transition:all 0.2s ease !important; }
        .sc-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent); transform:translateX(-100%); transition:transform 0.45s ease; }
        .sc-btn:hover::after { transform:translateX(100%); }
        .sc-btn:hover:not(:disabled) { transform:translateY(-2px) !important; box-shadow:0 12px 30px rgba(30,58,138,0.42) !important; }
        .sc-btn:active:not(:disabled) { transform:translateY(0) !important; }
        .sc-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .sc-dot { cursor:pointer; }
        .check-anim { animation:checkPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
        .google-btn { transition:all 0.2s ease !important; }
        .google-btn:hover { transform:translateY(-1px) !important; box-shadow:0 4px 16px rgba(0,0,0,0.12) !important; border-color:#c5d2f6 !important; }
      `}</style>

      <div style={s.pageBg} />

      <div style={{
        ...s.card,
        opacity: mounted ? 1 : 0,
        animation: mounted ? "cardIn 0.65s cubic-bezier(0.16,1,0.3,1) both" : "none",
      }}>

        {/* ══ LEFT PANEL ══ */}
        <div style={s.illustSide}>
          <div style={{ position:"absolute", width:380, height:380, borderRadius:"50%", background:"rgba(255,255,255,0.05)", top:-100, left:-100, animation:"orbDrift 14s ease-in-out infinite" }} />
          <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.04)", bottom:-30, right:-60, animation:"orbDrift 10s ease-in-out infinite reverse" }} />
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize:"28px 28px", zIndex:0 }} />

          {[300,210,130].map(size => (
            <div key={size} style={{ position:"absolute", width:size, height:size, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.12)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
          ))}
          <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.15)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"ripple 3.5s ease-out infinite" }} />
          <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.08)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"ripple 3.5s ease-out 1.4s infinite" }} />

          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:86, height:86, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3, boxShadow:"0 8px 32px rgba(0,0,0,0.15)" }}>
            <span style={{ fontSize:36 }}>🎓</span>
          </div>

          <div style={{ display:"flex", gap:14, justifyContent:"center", zIndex:4, position:"relative", width:"100%", paddingTop:8 }}>
            {[{emoji:"📅",label:"Book"},{emoji:"🏛️",label:"Facilities"},{emoji:"🔧",label:"Maintain"},{emoji:"📊",label:"Reports"}].map((b,i) => (
              <div key={i} style={{ width:62, height:62, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"1.5px solid rgba(255,255,255,0.28)", backdropFilter:"blur(10px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, animation:`iconBob ${3.8+i*0.5}s ease-in-out infinite`, animationDelay:`${i*0.3}s`, boxShadow:"0 4px 16px rgba(0,0,0,0.12)" }}>
                <span style={{ fontSize:22 }}>{b.emoji}</span>
                <span style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.9)", letterSpacing:"0.04em" }}>{b.label}</span>
              </div>
            ))}
          </div>

          <div style={{ flex:1 }} />

          <div style={{ width:"100%", zIndex:3, position:"relative", paddingBottom:8 }}>
            <div key={slide} style={{ textAlign:"center", padding:"0 20px", marginBottom:14, animation:"textFade 0.4s ease both" }}>
              <h2 style={{ fontSize:17, fontWeight:800, color:"#fff", marginBottom:7, lineHeight:1.4 }}>{slides[slide].title}</h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>{slides[slide].desc}</p>
            </div>
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:14 }}>
              {slides.map((_,i) => (
                <div key={i} className="sc-dot" onClick={() => setSlide(i)} style={{ height:6, borderRadius:3, width: i===slide ? 24 : 6, background: i===slide ? "#fff" : "rgba(255,255,255,0.32)", transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={s.formSide}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:"linear-gradient(135deg,#1e3a8a,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 4px 14px rgba(30,58,138,0.35)" }}>🎓</div>
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:"#0f172a" }}>Smart Campus</div>
              <div style={{ fontSize:12, color:"#94a3b8" }}>Operations Hub · SLIIT</div>
            </div>
          </div>

          <h1 style={s.formTitle}>Welcome Back <span style={{ fontSize:22 }}>👋</span></h1>
          <p style={s.formSub}>Sign in to access Smart Campus Operations Hub</p>

          {serverError && (
            <div style={{ ...s.errBox, animation:"shake 0.4s ease" }}>⚠ {serverError}</div>
          )}

          {/* ✅ Google OAuth Button */}
          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            style={s.googleBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ flex:1, height:"1px", background:"#e2e8f0" }} />
            <span style={{ fontSize:12, color:"#94a3b8", fontWeight:500 }}>or sign in with email</span>
            <div style={{ flex:1, height:"1px", background:"#e2e8f0" }} />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom:12 }}>
              <div style={{ position:"relative" }}>
                <span style={s.icoWrap}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input className="sc-input" type="email" name="email" value={form.email}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Email address"
                  style={{ ...s.inp, borderColor: touched.email&&errors.email?"#ef4444":touched.email&&!errors.email?"#22c55e":"#e2e8f0" }} />
                {touched.email && !errors.email && form.email && <span className="check-anim" style={s.checkMark}>✓</span>}
              </div>
              {touched.email && errors.email && <p style={s.errTxt}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom:10 }}>
              <div style={{ position:"relative" }}>
                <span style={s.icoWrap}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input className="sc-input" type={showPassword?"text":"password"} name="password" value={form.password}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Password"
                  style={{ ...s.inp, borderColor: touched.password&&errors.password?"#ef4444":touched.password&&!errors.password?"#22c55e":"#e2e8f0" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                  {showPassword
                    ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/></svg>
                    : <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {touched.password && errors.password && <p style={s.errTxt}>{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <label style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"#475569", cursor:"pointer", userSelect:"none" }}>
                <input type="checkbox" style={{ accentColor:"#1e3a8a", width:14, height:14, cursor:"pointer" }} />
                Remember me
              </label>
              <span style={{ fontSize:13, color:"#1e40af", fontWeight:600, cursor:"pointer" }}>Forgot Password?</span>
            </div>

            <button type="submit" disabled={loading} className="sc-btn" style={s.submitBtn}>
              {loading
                ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><span style={s.spinner} /> Signing in...</span>
                : "Log in"
              }
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop:16, padding:"10px 14px", background:"#f0f9ff", borderRadius:10, border:"1px solid #bae6fd" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#0369a1", marginBottom:6 }}>🔑 Demo Accounts (password: 123456)</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 12px" }}>
              {[
                { role:"👨‍🎓 Student",   email:"student@sliit.lk" },
                { role:"👨‍🏫 Lecturer",  email:"lecturer@sliit.lk" },
                { role:"🛡️ Admin",      email:"admin@sliit.lk" },
                { role:"🔧 Technician", email:"technician@sliit.lk" },
              ].map(a => (
                <div key={a.email}
                  onClick={() => { setForm({ email: a.email, password:"123456" }); setTouched({}); setErrors({}); }}
                  style={{ fontSize:11, color:"#0369a1", cursor:"pointer", padding:"3px 0" }}>
                  <span style={{ fontWeight:600 }}>{a.role}:</span> {a.email}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"center", gap:18, marginTop:14 }}>
            {["🔒 Secure","🎓 SLIIT Official","✅ Verified"].map(b => (
              <span key={b} style={{ fontSize:11, color:"#94a3b8", fontWeight:500 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Plus Jakarta Sans', sans-serif", padding:"20px", position:"relative" },
  pageBg: { position:"fixed", inset:0, background:"linear-gradient(135deg, #dbeafe 0%, #eff6ff 45%, #e0f2fe 100%)", zIndex:0 },
  card: { display:"flex", width:"100%", maxWidth:940, minHeight:580, borderRadius:22, overflow:"hidden", boxShadow:"0 32px 80px rgba(30,58,138,0.18), 0 8px 24px rgba(30,58,138,0.1)", position:"relative", zIndex:1 },
  illustSide: { flex:1, background:"linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between", padding:"28px 24px", position:"relative", overflow:"hidden" },
  formSide: { flex:"0 0 440px", background:"#fff", padding:"36px 44px", display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"auto" },
  formTitle: { fontSize:24, fontWeight:800, color:"#0f172a", lineHeight:1.3, marginBottom:6 },
  formSub: { fontSize:13, color:"#64748b", marginBottom:18 },
  errBox: { background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", padding:"9px 13px", borderRadius:9, fontSize:13, marginBottom:12 },
  googleBtn: {
    width:"100%", padding:"11px 16px", border:"1.5px solid #e2e8f0",
    borderRadius:10, background:"white",
    display:"flex", alignItems:"center", justifyContent:"center",
    gap:10, fontSize:14, fontWeight:600, cursor:"pointer",
    marginBottom:16, color:"#1a1a2e",
    fontFamily:"'Plus Jakarta Sans', sans-serif",
  },
  icoWrap: { position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#94a3b8", display:"flex" },
  inp: { width:"100%", padding:"11px 12px 11px 37px", fontSize:14, border:"1.5px solid #e2e8f0", borderRadius:10, background:"#f8fafc", color:"#0f172a", fontFamily:"'Plus Jakarta Sans', sans-serif" },
  checkMark: { position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#22c55e", fontWeight:700 },
  eyeBtn: { position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", padding:0 },
  errTxt: { fontSize:12, color:"#ef4444", marginTop:4 },
  submitBtn: { width:"100%", padding:"13px", background:"linear-gradient(135deg, #1e3a8a, #2563eb)", color:"#fff", border:"none", borderRadius:11, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans', sans-serif", boxShadow:"0 4px 18px rgba(30,58,138,0.38)" },
  spinner: { width:15, height:15, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" },
};