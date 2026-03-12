/**
 * Navbar
 * วางไฟล์โลโก้ที่ต้องการไว้ใน /public/logo.png
 * Vite จะ serve ให้อัตโนมัติผ่าน src="/logo.png"
 * ถ้าไม่มีไฟล์ จะ fallback เป็นชื่อ text แทน
 */
import { useState } from 'react'

export default function Navbar() {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 24px', height: 58,
      background: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>

      {/* ── Logo ─────────────────────────────────────── */}
      <a href="#" style={{ display:'flex', alignItems:'center', textDecoration:'none' }}>
        {!logoFailed ? (
          <img
            src="/logo.png"
            alt="ThamKapPhuean"
            style={{ height: 34, width: 'auto', display: 'block' }}
            onError={() => setLogoFailed(true)}
          />
        ) : (
          /* text fallback */
          <span style={{
            fontFamily: "'Nunito',sans-serif", fontWeight: 900,
            fontSize: 20, letterSpacing: '-.5px',
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            <span style={{ color: 'var(--navy)' }}>Tham</span>
            <span style={{ color:'var(--text-soft)', fontWeight:500, fontSize:15 }}>Kap</span>
            <span style={{ color: 'var(--purple)' }}>Phuean</span>
          </span>
        )}
      </a>

      {/* divider */}
      <div style={{ width:1, height:22, background:'var(--border)' }} />

      {/* page label */}
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: 'var(--purple)', background: 'var(--purple-pale)',
        padding: '4px 12px', borderRadius: 20, letterSpacing: '.3px',
      }}>
        LEADER DASHBOARD
      </span>
    </nav>
  )
}
