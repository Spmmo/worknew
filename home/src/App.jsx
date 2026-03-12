import { useState } from "react";
import Navbar from "./components/Navbar";
import RecentlyVisited from "./components/RecentlyVisited";
import MyWorkspaces from "./components/MyWorkspaces";
import Favorites from "./components/Favorites";
import styles from "./styles";

// ── Welcome Banner ────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
  </svg>
);

const WelcomeBanner = () => {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;
  const greeting =
    hour >= 6 && hour < 12 ? "Good morning" :
    hour >= 12 && hour < 18 ? "Good afternoon" :
    "Good evening";

  return (
    <div style={{
      background: "linear-gradient(135deg, #2bbdcc 0%, #1a9aaa 100%)",
      borderRadius: 12,
      padding: "12px 18px",
      marginBottom: 24,
      display: "flex",
      alignItems: "center",
      gap: 10,
      boxShadow: "0 2px 10px rgba(43,189,204,0.2)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: "rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff",
      }}>
        {isNight ? <MoonIcon /> : <SunIcon />}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>
          {greeting}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 1 }}>
          Here's what's happening in your workspaces today.
        </div>
      </div>
    </div>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [pinnedItems, setPinnedItems] = useState([]);

  const handlePin = (item) => {
    setPinnedItems(prev =>
      prev.find(p => p.id === item.id)
        ? prev.filter(p => p.id !== item.id)
        : [...prev, item]
    );
  };

  const isPinned = (id) => pinnedItems.some(p => p.id === id);

  return (
    <div style={styles.app}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.contentCard}>
          <WelcomeBanner />
          <Favorites pinnedItems={pinnedItems} onUnpin={(id) => setPinnedItems(prev => prev.filter(p => p.id !== id))} />
          <RecentlyVisited onPin={handlePin} isPinned={isPinned} />
          <MyWorkspaces />
        </div>
      </main>
    </div>
  );
}

export default App;