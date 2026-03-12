import { useState, useRef, useEffect } from "react";
import { BellIcon, SearchIcon, UserIcon } from "./Icons";
import logo from "../assets/logo.png";
import styles from "../styles";

const searchData = [
  { id: 1, name: "Dashboard and reporting", subtitle: "Recently visited" },
  { id: 2, name: "My Team", subtitle: "Recently visited" },
  { id: 3, name: "Main workspace", subtitle: "Workspace" },
];

const NavIconBtn = ({ children, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{ ...styles.iconBtn, background: hovered ? "#f4f4f4" : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setSearchOpen(false); setQuery(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = query.trim()
    ? searchData.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <nav style={{ ...styles.navbar, overflow: "visible" }}>
      <div style={styles.logo}>
        <img src={logo} alt="ThamKapPhuean" style={styles.logoImg} />
      </div>

      <div style={styles.navActions}>
        <NavIconBtn><BellIcon /></NavIconBtn>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <div style={{
            display: "flex", alignItems: "center",
            background: searchOpen ? "#f7f7f7" : "none",
            borderRadius: 8, transition: "all 0.2s ease",
            border: searchOpen ? "1.5px solid #e0e0e0" : "1.5px solid transparent",
          }}>
            <button
              style={{ ...styles.iconBtn }}
              onClick={() => { setSearchOpen(o => !o); if (searchOpen) setQuery(""); }}
            >
              <SearchIcon />
            </button>
            <div style={{ width: searchOpen ? 200 : 0, overflow: "hidden", transition: "width 0.2s ease" }}>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 14, color: "#1a1a1a", fontFamily: "inherit",
                  width: 180, padding: "0 8px 0 0",
                }}
              />
            </div>
          </div>

          {searchOpen && query.trim() && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0,
              background: "#fff", borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid #ebebeb",
              minWidth: 260, zIndex: 200, overflow: "hidden",
            }}>
              {results.length > 0 ? results.map(item => (
                <DropResult key={item.id} item={item} />
              )) : (
                <div style={{ padding: "14px 16px", fontSize: 13, color: "#bbb", textAlign: "center" }}>
                  ไม่พบผลลัพธ์
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.divider} />
        <span style={styles.accountLabel}>Account</span>
        <div style={styles.avatarCircle}><UserIcon /></div>
      </div>
    </nav>
  );
};

const DropResult = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "10px 14px",
        background: hovered ? "#f7f7f7" : "#fff",
        border: "none", cursor: "pointer", textAlign: "left",
        transition: "background 0.12s",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{item.name}</div>
        <div style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>{item.subtitle}</div>
      </div>
    </button>
  );
};

export default Navbar;