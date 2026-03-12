import { IconBarChart, IconRefresh } from './Icons'

export function DailyChart({ data }) {
  return (
    <div style={{ background:'var(--dark)',borderRadius:'var(--r)',overflow:'hidden',color:'#fff' }}>
      <div style={{ display:'flex',alignItems:'center',gap:8,padding:'18px 20px 14px',fontFamily:"'Nunito',sans-serif",fontSize:15,fontWeight:900 }}>
        <IconBarChart s={16}/> Compliance รายวัน
      </div>
      <div style={{ display:'flex',alignItems:'flex-end',gap:10,padding:'0 20px 20px',height:160 }}>
        {data.map(({ day, pct }) => (
          <div key={day} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}>
            <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:800,color:pct<70?'#fdcb6e':'var(--green)' }}>{pct}%</div>
            <div style={{ flex:1,width:'100%',display:'flex',alignItems:'flex-end' }}>
              <div style={{ width:'100%',borderRadius:'8px 8px 0 0',minHeight:20,height:`${pct}%`,background:pct<70?'#fdcb6e':'linear-gradient(180deg,#00d2b4,#00b894)',transition:'height .6s' }}/>
            </div>
            <div style={{ fontSize:11,opacity:.4 }}>{day}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MonthlyChart({ data }) {
  return (
    <div style={{ background:'var(--dark)',borderRadius:'var(--r)',overflow:'hidden',color:'#fff' }}>
      <div style={{ display:'flex',alignItems:'center',gap:8,padding:'18px 20px 14px',fontFamily:"'Nunito',sans-serif",fontSize:15,fontWeight:900 }}>
        <IconRefresh s={16}/> Compliance รายเดือน
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,padding:'0 18px 18px' }}>
        {data.map(m => (
          <div key={m.name} style={{ borderRadius:12,padding:'16px 14px',textAlign:'center',background:m.active?'linear-gradient(135deg,#6c5ce7,#a29bfe)':'var(--dark2)',boxShadow:m.active?'0 6px 20px rgba(108,92,231,.4)':'none' }}>
            <div style={{ fontSize:12,opacity:.5,marginBottom:8 }}>{m.name}</div>
            <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:28,fontWeight:900,lineHeight:1,color:m.active?'#fff':'var(--yellow)' }}>{m.pct}%</div>
            <div style={{ fontSize:11,marginTop:5,opacity:.55,color:m.active?'rgba(255,255,255,.7)':'var(--red)' }}>ละเมิด {m.viol}x</div>
          </div>
        ))}
      </div>
    </div>
  )
}
