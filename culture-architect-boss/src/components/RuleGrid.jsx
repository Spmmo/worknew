import { useState } from 'react'
import { getRuleIcon, IconEdit, IconTrash, IconPlus } from './Icons'

const CATS = ['ทั้งหมด','เวลา','ประชุม','สื่อสาร']

function bdg(pct) {
  if (pct >= 85) return { label:'Active',       bg:'var(--green-pale)',  color:'var(--green)',  border:'var(--green)'  }
  if (pct >= 65) return { label:'ต้องปรับปรุง', bg:'var(--yellow-pale)', color:'#9a7c00',       border:'var(--yellow)' }
  return               { label:'ฝ่าฝืนบ่อย',   bg:'var(--red-pale)',    color:'var(--red)',    border:'var(--red)'    }
}
const pc = pct => pct>=85?'var(--green)':pct>=65?'var(--yellow)':'var(--red)'

function RuleCard({ rule, onToggle, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const b = bdg(rule.pct)
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:'var(--white)', borderRadius:'var(--r)',
        border:`1.5px solid ${hov?'var(--purple2)':'var(--border)'}`,
        borderTop:`3px solid ${b.border}`,
        display:'flex', flexDirection:'column', overflow:'hidden',
        opacity:rule.active?1:.5, transition:'.2s', position:'relative',
        ...(hov?{transform:'translateY(-3px)',boxShadow:'0 8px 28px rgba(108,92,231,.13)'}:{}),
      }}
    >
      {hov && (
        <div style={{ position:'absolute',top:10,right:10,display:'flex',gap:4,zIndex:2 }}>
          <button onClick={()=>onEdit(rule.id)} style={{ width:28,height:28,borderRadius:8,border:'none',background:'var(--purple-pale)',color:'var(--purple)',display:'flex',alignItems:'center',justifyContent:'center' }}><IconEdit/></button>
          <button onClick={()=>onDelete(rule.id)} style={{ width:28,height:28,borderRadius:8,border:'none',background:'var(--red-pale)',color:'var(--red)',display:'flex',alignItems:'center',justifyContent:'center' }}><IconTrash/></button>
        </div>
      )}
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',padding:'17px 17px 11px' }}>
        <div style={{ width:40,height:40,borderRadius:11,background:rule.iconBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          {getRuleIcon(rule.icon, rule.color)}
        </div>
        <span style={{ fontSize:10,fontWeight:800,padding:'3px 9px',borderRadius:20,background:b.bg,color:b.color }}>{b.label}</span>
      </div>
      <div style={{ padding:'0 17px 13px',flex:1 }}>
        <div style={{ fontWeight:800,fontSize:13.5,color:'var(--navy)',marginBottom:4,lineHeight:1.35 }}>{rule.name}</div>
        <div style={{ fontSize:12,color:'var(--text-soft)',lineHeight:1.55 }}>{rule.desc}</div>
      </div>
      <div style={{ display:'flex',alignItems:'center',gap:10,padding:'11px 17px',borderTop:'1px solid var(--border)',background:'#fafafe' }}>
        <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:17,fontWeight:900,minWidth:42,color:pc(rule.pct) }}>{rule.pct}%</div>
        <div style={{ flex:1,height:6,background:'var(--bg)',borderRadius:3,overflow:'hidden' }}>
          <div style={{ height:'100%',borderRadius:3,background:pc(rule.pct),width:`${rule.pct}%` }}/>
        </div>
        <button onClick={()=>onToggle(rule.id)} style={{ width:36,height:20,borderRadius:10,border:'none',position:'relative',transition:'.2s',flexShrink:0,background:rule.active?'var(--purple)':'var(--border)' }}>
          <span style={{ position:'absolute',width:14,height:14,borderRadius:'50%',background:'#fff',top:3,transition:'.2s',boxShadow:'0 1px 4px rgba(0,0,0,.2)',left:rule.active?19:3 }}/>
        </button>
      </div>
    </div>
  )
}

function AddCard({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}
      style={{ background:hov?'#e5ddff':'var(--purple-pale)',border:`2px dashed ${hov?'var(--purple)':'var(--purple2)'}`,borderRadius:'var(--r)',display:'flex',alignItems:'center',justifyContent:'center',minHeight:195,cursor:'pointer',transition:'.2s' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48,height:48,borderRadius:'50%',background:'var(--white)',border:'2px dashed var(--purple2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 11px' }}>
          <IconPlus s={19} c="var(--purple)"/>
        </div>
        <p style={{ fontSize:13,fontWeight:800,color:'var(--purple)' }}>เพิ่มกติกาใหม่</p>
        <span style={{ fontSize:11.5,color:'var(--purple2)',marginTop:3,display:'block' }}>คลิกเพื่อสร้างกติกา</span>
      </div>
    </div>
  )
}

export default function RuleGrid({ rules, onToggle, onEdit, onDelete, onAdd }) {
  const [filter, setFilter] = useState('ทั้งหมด')
  const visible = rules.filter(r => filter==='ทั้งหมด' || r.cat===filter)

  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:13 }}>
        <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:16,fontWeight:900,color:'var(--navy)',display:'flex',alignItems:'center',gap:8 }}>
          <svg width="16" height="16" fill="none" stroke="var(--purple)" strokeWidth="2.1" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          กติกาทีม
        </div>
        <div style={{ display:'flex',gap:6 }}>
          {CATS.map(c => (
            <button key={c} onClick={()=>setFilter(c)} style={{ fontSize:12,fontWeight:600,padding:'5px 13px',borderRadius:20,transition:'.15s',border:`1.5px solid ${filter===c?'var(--purple)':'var(--border)'}`,background:filter===c?'var(--purple)':'var(--white)',color:filter===c?'#fff':'var(--text-soft)' }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:13 }}>
        {visible.map(r => <RuleCard key={r.id} rule={r} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete}/>)}
        <AddCard onClick={onAdd}/>
      </div>
    </div>
  )
}
