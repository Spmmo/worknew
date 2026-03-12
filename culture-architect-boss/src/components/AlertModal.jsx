import { useState, useEffect } from 'react'
import { IconSend, IconClose, IconBolt, IconWarning, IconInfo } from './Icons'

const MEMBERS_LIST = [
  { id:'TK',    av:'TK', grad:'linear-gradient(135deg,#6c5ce7,#a29bfe)' },
  { id:'Anna',  av:'An', grad:'linear-gradient(135deg,#f97316,#fdcb6e)' },
  { id:'Macus', av:'Ma', grad:'linear-gradient(135deg,#e17055,#f97316)' },
]
const TEMPLATES = [
  { label:'📋 ฝ่าฝืนกติกา', msg:'กรุณาตรวจสอบกติกาทีมที่คุณฝ่าฝืน และปรับปรุงให้ดีขึ้น' },
  { label:'⏰ เรื่องเวลา',   msg:'เตือน: ห้ามส่งงานหลัง 19:00 น. กรุณาวางแผนเวลาให้ดีขึ้น' },
  { label:'⭐ ชมเชย',        msg:'ขอชื่นชม! คุณทำผลงานได้ดีมากในสัปดาห์นี้ ขอบคุณมาก' },
]
const URG = [
  { key:'normal', label:'ปกติ',    icon:<IconInfo  s={13}/>, ac:'var(--purple)', ab:'var(--purple-pale)' },
  { key:'warn',   label:'เตือน',  icon:<IconWarning s={13}/>, ac:'#9a7c00',       ab:'var(--yellow-pale)' },
  { key:'urgent', label:'ด่วนมาก',icon:<IconBolt  s={13}/>, ac:'var(--red)',    ab:'var(--red-pale)'    },
]
const INP = { width:'100%',padding:'10px 13px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13.5,color:'var(--text)',background:'var(--white)',outline:'none' }

export default function AlertModal({ open, preselect, onClose, onSend }) {
  const [sel,  setSel]  = useState([])
  const [urg,  setUrg]  = useState('warn')
  const [msg,  setMsg]  = useState('')

  useEffect(() => {
    if (!open) return
    setSel(preselect ? [preselect] : [])
    setUrg('warn')
    setMsg(preselect==='TK' ? TEMPLATES[2].msg : '')
  }, [open, preselect])

  const toggle = id => {
    if (id==='ทั้งทีม') { setSel(s => s.includes('ทั้งทีม') ? [] : ['ทั้งทีม']); return }
    setSel(s => { const w=s.filter(x=>x!=='ทั้งทีม'); return w.includes(id)?w.filter(x=>x!==id):[...w,id] })
  }

  if (!open) return null

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(26,15,79,.28)',backdropFilter:'blur(6px)',zIndex:500 }}/>
      <div style={{ position:'fixed',inset:0,zIndex:501,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
        <div style={{ background:'var(--white)',borderRadius:20,width:500,maxWidth:'95vw',padding:28,boxShadow:'0 20px 60px rgba(108,92,231,.2)',border:'1.5px solid var(--border)',animation:'slideUp .25s ease both' }}>

          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22 }}>
            <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:19,fontWeight:900,color:'var(--navy)',display:'flex',alignItems:'center',gap:10 }}>
              <IconSend s={20} c="var(--purple)"/> ส่งแจ้งเตือนสมาชิก
            </div>
            <button onClick={onClose} style={{ width:30,height:30,borderRadius:8,border:'1px solid var(--border)',background:'transparent',color:'var(--text-soft)',display:'flex',alignItems:'center',justifyContent:'center' }}><IconClose/></button>
          </div>

          {/* recipients */}
          <div style={{ marginBottom:15 }}>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:8 }}>เลือกผู้รับ</div>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              {MEMBERS_LIST.map(m => {
                const on = sel.includes(m.id)
                return (
                  <button key={m.id} onClick={()=>toggle(m.id)} style={{ display:'flex',alignItems:'center',gap:7,padding:'7px 14px',borderRadius:20,border:`1.5px solid ${on?'var(--purple)':'var(--border)'}`,background:on?'var(--purple)':'var(--white)',color:on?'#fff':'var(--text-mid)',fontSize:13,fontWeight:600,transition:'.15s' }}>
                    <div style={{ width:22,height:22,borderRadius:'50%',background:on?'rgba(255,255,255,.25)':m.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,color:'#fff' }}>{m.av}</div>
                    {m.id}
                  </button>
                )
              })}
              {(() => { const on=sel.includes('ทั้งทีม'); return (
                <button onClick={()=>toggle('ทั้งทีม')} style={{ display:'flex',alignItems:'center',gap:7,padding:'7px 14px',borderRadius:20,border:`1.5px solid ${on?'var(--purple)':'var(--border)'}`,background:on?'var(--purple)':'var(--white)',color:on?'#fff':'var(--text-mid)',fontSize:13,fontWeight:600,transition:'.15s' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  ทั้งทีม
                </button>
              )})()}
            </div>
          </div>

          {/* urgency */}
          <div style={{ marginBottom:15 }}>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:8 }}>ระดับความเร่งด่วน</div>
            <div style={{ display:'flex',gap:8 }}>
              {URG.map(u => {
                const on=urg===u.key
                return <button key={u.key} onClick={()=>setUrg(u.key)} style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:9,borderRadius:10,border:`1.5px solid ${on?u.ac:'var(--border)'}`,background:on?u.ab:'var(--white)',color:on?u.ac:'var(--text-mid)',fontSize:12,fontWeight:700,transition:'.15s' }}>{u.icon}{u.label}</button>
              })}
            </div>
          </div>

          {/* message */}
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:8 }}>ข้อความ</div>
            <div style={{ display:'flex',gap:7,flexWrap:'wrap',marginBottom:9 }}>
              {TEMPLATES.map(t => <button key={t.label} onClick={()=>setMsg(t.msg)} style={{ fontSize:11.5,fontWeight:600,padding:'4px 11px',borderRadius:20,border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text-mid)' }}>{t.label}</button>)}
            </div>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="พิมพ์ข้อความแจ้งเตือน..."
              style={{ ...INP,minHeight:88,resize:'none',lineHeight:1.6 }}/>
          </div>

          <div style={{ display:'flex',gap:10,justifyContent:'flex-end' }}>
            <button onClick={onClose} style={{ padding:'10px 18px',borderRadius:'var(--r-sm)',border:'1.5px solid var(--border)',background:'transparent',color:'var(--text-mid)',fontSize:13,fontWeight:700 }}>ยกเลิก</button>
            <button onClick={()=>{ if(!sel.length||!msg.trim())return; onSend(sel,urg,msg); onClose() }}
              style={{ display:'flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,var(--purple),var(--purple2))',color:'#fff',border:'none',borderRadius:'var(--r-sm)',padding:'11px 20px',fontSize:13.5,fontWeight:700,boxShadow:'0 6px 18px rgba(108,92,231,.35)' }}>
              <IconSend s={14}/> ส่งแจ้งเตือน
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
