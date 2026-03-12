import { IconCheck, IconWarning, IconInfo, IconPlus, IconClose } from './Icons'

const BG   = { sent:'linear-gradient(135deg,#00b894,#00d2b4)', warn:'linear-gradient(135deg,#e17055,#fd79a8)', info:'linear-gradient(135deg,#6c5ce7,#a29bfe)', add:'linear-gradient(135deg,#6c5ce7,#4a25c7)' }
const ICON = { sent:<IconCheck s={16} c="#fff"/>, warn:<IconWarning s={16} c="#fff"/>, info:<IconInfo s={16} c="#fff"/>, add:<IconPlus s={16} c="#fff"/> }

function Toast({ t, onRemove }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:12,background:'var(--navy)',color:'#fff',borderRadius:14,padding:'13px 17px',boxShadow:'0 8px 32px rgba(26,15,79,.25)',fontSize:13,fontWeight:600,minWidth:290,maxWidth:370,animation:t.removing?'toastOut .3s ease both':'toastIn .3s ease both' }}>
      <div style={{ width:32,height:32,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,background:BG[t.type]||BG.info }}>
        {ICON[t.type]||ICON.info}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:800,fontSize:13 }}>{t.title}</div>
        {t.sub && <div style={{ fontSize:11,opacity:.55,marginTop:2 }}>{t.sub}</div>}
      </div>
      <button onClick={()=>onRemove(t.id)} style={{ cursor:'pointer',opacity:.35,flexShrink:0,background:'none',border:'none',color:'#fff',display:'flex',alignItems:'center' }}><IconClose/></button>
    </div>
  )
}

export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div style={{ position:'fixed',bottom:26,right:26,display:'flex',flexDirection:'column',gap:10,zIndex:9999 }}>
      {toasts.map(t => <Toast key={t.id} t={t} onRemove={onRemove}/>)}
    </div>
  )
}
