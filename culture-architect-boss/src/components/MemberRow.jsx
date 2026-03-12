import { useState } from 'react'
import { IconBell, IconSend } from './Icons'

const CLR = { green:'var(--green)', yellow:'var(--yellow)', red:'var(--red)' }

function MemberCard({ m, onAlert }) {
  const [hov, setHov] = useState(false)
  const good = m.cls === 'green'

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex:1, background:'var(--white)', borderRadius:'var(--r)',
        border:`1.5px solid ${hov?'var(--purple2)':'var(--border)'}`,
        padding:'15px 17px', display:'flex', alignItems:'center', gap:12,
        position:'relative', overflow:'hidden', transition:'.2s',
        ...(hov?{transform:'translateY(-2px)',boxShadow:'0 6px 20px rgba(108,92,231,.12)'}:{}),
      }}
    >
      {/* accent bar */}
      <div style={{ position:'absolute',left:0,top:0,bottom:0,width:4,borderRadius:'4px 0 0 4px',background:CLR[m.cls] }}/>

      <div style={{ width:42,height:42,borderRadius:'50%',background:m.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',flexShrink:0 }}>{m.av}</div>

      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontWeight:800,fontSize:14,color:'var(--navy)' }}>{m.id}</div>
        <div style={{ fontSize:11.5,color:'var(--text-soft)',marginTop:2 }}>ฝ่าฝืน {m.viol} ครั้ง · {m.label}</div>
      </div>

      <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6 }}>
        <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:22,fontWeight:900,lineHeight:1,color:CLR[m.cls] }}>{m.pct}%</div>
        <button
          onClick={() => onAlert(m.id)}
          style={{ display:'flex',alignItems:'center',gap:5,borderRadius:20,padding:'4px 10px',fontSize:11,fontWeight:700,border:'1px solid',whiteSpace:'nowrap',transition:'.15s',
            background:good?'var(--green-pale)':'var(--red-pale)',
            color:     good?'var(--green)':'var(--red)',
            borderColor:good?'#a8e6d4':'#f5b8a8' }}
        >
          {good ? <IconSend s={11}/> : <IconBell s={11}/>}
          {good ? 'ชมเชย' : m.cls==='red' ? 'แจ้งด่วน' : 'แจ้งเตือน'}
        </button>
      </div>
    </div>
  )
}

export default function MemberRow({ members, onAlert }) {
  return (
    <div style={{ display:'flex', gap:13, marginBottom:24 }}>
      {members.map(m => <MemberCard key={m.id} m={m} onAlert={onAlert}/>)}
    </div>
  )
}
