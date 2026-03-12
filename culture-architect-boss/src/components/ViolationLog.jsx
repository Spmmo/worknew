import { IconCheck, IconDots, IconSend, IconWarning } from './Icons'

function LogRow({ log, onNotify }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:14,padding:'14px 20px',borderBottom:'1px solid var(--border)',transition:'.15s' }}>
      <div style={{ width:36,height:36,borderRadius:'50%',background:log.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',flexShrink:0 }}>{log.av}</div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:13.5,fontWeight:700,color:'var(--navy)' }}>
          <b>{log.name}</b> <span style={{ fontWeight:400,color:'var(--text-mid)' }}>· {log.rule}</span>
        </div>
        <div style={{ fontSize:11.5,color:'var(--text-soft)',marginTop:2 }}>{log.time}</div>
      </div>
      <div style={{ display:'flex',alignItems:'center',gap:8,flexShrink:0 }}>
        {log.sent ? (
          <button disabled style={{ display:'flex',alignItems:'center',gap:6,background:'var(--green-pale)',color:'var(--green)',border:'none',borderRadius:20,padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'default' }}>
            <IconCheck s={12}/> แจ้งแล้ว
          </button>
        ) : (
          <>
            <button style={{ width:30,height:30,borderRadius:8,border:'1px solid var(--border)',background:'transparent',color:'var(--text-soft)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <IconDots/>
            </button>
            <button onClick={()=>onNotify(log.id)} style={{ display:'flex',alignItems:'center',gap:6,background:'var(--purple)',color:'#fff',border:'none',borderRadius:20,padding:'6px 14px',fontSize:12,fontWeight:700,whiteSpace:'nowrap' }}>
              <IconSend s={12}/> แจ้งเตือน
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ViolationLog({ logs, onNotify }) {
  return (
    <div style={{ background:'var(--white)',border:'1.5px solid var(--border)',borderRadius:'var(--r)',overflow:'hidden',marginBottom:28 }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:15,fontWeight:900,color:'var(--navy)',display:'flex',alignItems:'center',gap:8 }}>
          <IconWarning s={16} c="var(--red)"/> Log เดือน มี.ค.
        </div>
        <span style={{ fontSize:12,fontWeight:700,color:'var(--text-soft)',background:'var(--bg)',padding:'3px 12px',borderRadius:20,border:'1px solid var(--border)' }}>
          {logs.length} รายการ
        </span>
      </div>
      {logs.map(l => <LogRow key={l.id} log={l} onNotify={onNotify}/>)}
    </div>
  )
}
