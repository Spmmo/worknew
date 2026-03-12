import { useState } from 'react'

// ── components ──────────────────────────────────────────────────────────────
import Navbar          from './components/Navbar'
import ScoreBanner     from './components/ScoreBanner'
import MemberRow       from './components/MemberRow'
import RuleGrid        from './components/RuleGrid'
import { DailyChart, MonthlyChart } from './components/Charts'
import ViolationLog    from './components/ViolationLog'
import ComplianceTable from './components/ComplianceTable'
import AlertModal      from './components/AlertModal'
import RuleModal       from './components/RuleModal'
import ToastContainer  from './components/ToastContainer'

// ── data ─────────────────────────────────────────────────────────────────────
import { MEMBERS, INITIAL_RULES, DAILY_DATA, MONTHLY_DATA, INITIAL_LOGS } from './data/initialData'

// ── hook ──────────────────────────────────────────────────────────────────────
import { useToast } from './hooks/useToast'

// ── helpers ──────────────────────────────────────────────────────────────────
const calcScore = rules => {
  const a = rules.filter(r => r.active)
  return a.length ? Math.round(a.reduce((s,r) => s+r.pct, 0) / a.length) : 0
}
const bannerTitle = s => s>=80 ? 'ทีมมีสุขภาพวัฒนธรรมที่ดี' : s>=60 ? 'ทีมต้องปรับปรุงเพิ่มเติม' : 'ทีมมีปัญหาที่ต้องแก้ไขด่วน'

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [rules, setRules]           = useState(INITIAL_RULES)
  const [logs,  setLogs]            = useState(INITIAL_LOGS)
  const [alertOpen, setAlertOpen]   = useState(false)
  const [alertPre,  setAlertPre]    = useState(null)
  const [ruleOpen,  setRuleOpen]    = useState(false)
  const [editRule,  setEditRule]    = useState(null)
  const { toasts, showToast, removeToast } = useToast()

  const score       = calcScore(rules)
  const activeCount = rules.filter(r => r.active).length

  // ── rule handlers ────────────────────────────────────────────────────────
  const toggleRule = id => {
    const r = rules.find(x => x.id===id)
    setRules(p => p.map(x => x.id===id ? {...x,active:!x.active} : x))
    showToast(r.active?'warn':'info', r.active?'ปิดกติกาแล้ว':'เปิดกติกาแล้ว', r.name)
  }
  const deleteRule = id => {
    const r = rules.find(x => x.id===id)
    setRules(p => p.filter(x => x.id!==id))
    showToast('warn','ลบกติกาแล้ว', r.name)
  }
  const openEdit = id => { setEditRule(rules.find(x=>x.id===id)); setRuleOpen(true) }
  const saveRule = rule => {
    setRules(p => p.find(x=>x.id===rule.id) ? p.map(x=>x.id===rule.id?rule:x) : [...p,rule])
    showToast('add', editRule?'อัปเดตกติกาแล้ว':'เพิ่มกติกาใหม่แล้ว', rule.name)
    setEditRule(null)
  }

  // ── alert handlers ───────────────────────────────────────────────────────
  const openAlert = (id=null) => { setAlertPre(id); setAlertOpen(true) }
  const sendAlert = (targets,urg,msg) => {
    const lbl = {normal:'ปกติ',warn:'เตือน',urgent:'ด่วนมาก'}[urg]
    showToast('sent',`ส่งแจ้งเตือนถึง ${targets.join(', ')}`,`ระดับ: ${lbl} · "${msg.slice(0,40)}${msg.length>40?'…':''}"`)
  }

  // ── log notify ───────────────────────────────────────────────────────────
  const logNotify = id => {
    const l = logs.find(x=>x.id===id)
    setLogs(p => p.map(x=>x.id===id?{...x,sent:true}:x))
    showToast('sent',`ส่งแจ้งเตือนถึง ${l.name}`,`เรื่อง: ${l.rule}`)
  }

  return (
    <>
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main content ── */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'26px 28px 60px' }}>

        {/* Page header */}
        <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,marginBottom:24,animation:'slideUp .25s ease both' }}>
          <div>
            <h1 style={{ fontFamily:"'Nunito',sans-serif",fontSize:29,fontWeight:900,color:'var(--navy)',letterSpacing:'-.5px' }}>Culture Architect</h1>
            <p style={{ fontSize:13,color:'var(--text-soft)',marginTop:4,lineHeight:1.5 }}>ออกแบบกติกาทีม · ติดตาม Compliance · สร้างวัฒนธรรมการทำงานที่ดี</p>
          </div>
          <button
            onClick={() => { setEditRule(null); setRuleOpen(true) }}
            style={{ display:'flex',alignItems:'center',gap:8,background:'var(--purple)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',padding:'11px 20px',fontSize:13.5,fontWeight:700,boxShadow:'0 6px 18px rgba(108,92,231,.35)',transition:'.15s',whiteSpace:'nowrap' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            เพิ่มกติกา
          </button>
        </div>

        <ScoreBanner score={score} activeCount={activeCount} title={bannerTitle(score)} />

        <MemberRow members={MEMBERS} onAlert={openAlert} />

        <RuleGrid rules={rules} onToggle={toggleRule} onEdit={openEdit} onDelete={deleteRule} onAdd={()=>{ setEditRule(null); setRuleOpen(true) }} />

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:28 }}>
          <DailyChart   data={DAILY_DATA}   />
          <MonthlyChart data={MONTHLY_DATA} />
        </div>

        <ViolationLog logs={logs} onNotify={logNotify} />

        <ComplianceTable members={MEMBERS} onAlert={openAlert} />
      </div>

      {/* ── Modals ── */}
      <AlertModal open={alertOpen} preselect={alertPre} onClose={()=>setAlertOpen(false)} onSend={sendAlert} />
      <RuleModal  open={ruleOpen}  editRule={editRule}  onClose={()=>setRuleOpen(false)}  onSave={saveRule}  />

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
