import { IconShield, IconWarning, IconUsers } from './Icons'

export default function ScoreBanner({ score, activeCount, title }) {
  return (
    <div style={{
      background: 'linear-gradient(130deg,var(--navy) 0%,var(--navy2) 55%,#4a25c7 100%)',
      borderRadius: 20, padding: '28px 32px',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 32,
      alignItems: 'center', color: '#fff',
      position: 'relative', overflow: 'hidden',
      marginBottom: 24, animation: 'slideUp .3s ease both',
    }}>
      {/* glow */}
      <div style={{ position:'absolute',right:-60,top:-60,width:280,height:280,background:'radial-gradient(circle,rgba(162,155,254,.25),transparent 65%)',borderRadius:'50%',pointerEvents:'none' }}/>
      <div style={{ position:'absolute',left:180,bottom:-80,width:220,height:220,background:'radial-gradient(circle,rgba(108,92,231,.3),transparent 65%)',borderRadius:'50%',pointerEvents:'none' }}/>

      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ fontSize:11,fontWeight:700,letterSpacing:'1.2px',textTransform:'uppercase',opacity:.5,marginBottom:8 }}>
          Team Culture Score — สัปดาห์นี้
        </div>
        <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:21,fontWeight:900,marginBottom:18 }}>{title}</div>

        <div style={{ height:12,background:'rgba(255,255,255,.15)',borderRadius:6,overflow:'hidden',marginBottom:16 }}>
          <div style={{ height:'100%',borderRadius:6,background:'linear-gradient(90deg,var(--purple2),#c4b5fd)',width:`${score}%`,transition:'width 1s' }}/>
        </div>

        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {[
            [<IconShield s={12}/>, `${activeCount} กติกา Active`],
            [<IconWarning s={12}/>, '3 ฝ่าฝืนวันนี้'],
            [<IconUsers s={12}/>, '3 สมาชิก'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.12)',borderRadius:20,padding:'5px 13px',fontSize:12,fontWeight:600 }}>
              {icon}{text}
            </div>
          ))}
        </div>
      </div>

      {/* big number */}
      <div style={{ textAlign:'center', position:'relative', zIndex:1, flexShrink:0 }}>
        <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:72,fontWeight:900,lineHeight:1,background:'linear-gradient(135deg,#fff 30%,var(--purple2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>
          {score}%
        </div>
        <div style={{ fontSize:12,opacity:.4,marginTop:4,letterSpacing:'.5px' }}>Compliance รวม</div>
      </div>
    </div>
  )
}
