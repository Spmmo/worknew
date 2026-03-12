import { IconSend, IconBarChart } from './Icons'

const clr = m => m.pct>=85?'var(--green)':m.pct>=65?'var(--yellow)':'var(--red)'

function Row({ m, onAlert }) {
  const c = clr(m)
  return (
    <div style={{ display:'flex',alignItems:'center',gap:14,padding:'13px 20px',borderBottom:'1px solid var(--border)' }}>
      <div style={{ width:36,height:36,borderRadius:'50%',background:m.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#fff',flexShrink:0 }}>{m.av}</div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:13.5,fontWeight:800,color:'var(--navy)' }}>{m.id}</div>
        <div style={{ fontSize:11.5,color:'var(--text-soft)',marginTop:2 }}>ฝ่าฝืน {m.viol} ครั้ง · {m.label}</div>
      </div>
      <div style={{ width:80,flexShrink:0 }}>
        <div style={{ height:7,background:'var(--bg)',borderRadius:4,overflow:'hidden' }}>
          <div style={{ height:'100%',borderRadius:4,background:c,width:`${m.pct}%` }}/>
        </div>
      </div>
      <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:17,fontWeight:900,width:44,textAlign:'right',flexShrink:0,color:c }}>{m.pct}%</div>
      <button onClick={()=>onAlert(m.id)} style={{ display:'flex',alignItems:'center',gap:5,background:'var(--purple-pale)',color:'var(--purple)',border:'1px solid var(--purple2)',borderRadius:20,padding:'5px 12px',fontSize:11,fontWeight:700,whiteSpace:'nowrap' }}>
        <IconSend s={11}/> แจ้งเตือน
      </button>
    </div>
  )
}

export default function ComplianceTable({ members, onAlert }) {
  return (
    <div style={{ background:'var(--white)',border:'1.5px solid var(--border)',borderRadius:'var(--r)',overflow:'hidden' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:15,fontWeight:900,color:'var(--navy)',display:'flex',alignItems:'center',gap:8 }}>
          <IconBarChart s={16} c="var(--purple)"/> Compliance รายคน
        </div>
        <span style={{ fontSize:12,color:'var(--text-soft)',background:'var(--bg)',padding:'3px 12px',borderRadius:20,border:'1px solid var(--border)',fontWeight:600 }}>สัปดาห์นี้</span>
      </div>
      {members.map(m => <Row key={m.id} m={m} onAlert={onAlert}/>)}
    </div>
  )
}
