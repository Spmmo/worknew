import { useState, useEffect } from 'react'
import { IconShield, IconCheck, IconClose } from './Icons'
import { CAT_META } from '../data/initialData'

const CATS = ['เวลา','ประชุม','สื่อสาร']
const INP = { width:'100%',padding:'10px 13px',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:13.5,color:'var(--text)',background:'var(--white)',outline:'none' }

export default function RuleModal({ open, editRule, onClose, onSave }) {
  const [name, setName] = useState('')
  const [cat,  setCat]  = useState('เวลา')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    if (editRule) { setName(editRule.name); setCat(editRule.cat); setDesc(editRule.desc) }
    else          { setName(''); setCat('เวลา'); setDesc('') }
  }, [editRule, open])

  const save = () => {
    if (!name.trim()) return
    const meta = CAT_META[cat] || CAT_META['สื่อสาร']
    onSave({ id:editRule?.id||Date.now(), name:name.trim(), cat, desc:desc.trim()||'กติกาใหม่สำหรับทีม',
             pct:editRule?.pct||Math.floor(Math.random()*25+70), active:editRule?.active??true, ...meta })
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(26,15,79,.28)',backdropFilter:'blur(6px)',zIndex:500 }}/>
      <div style={{ position:'fixed',inset:0,zIndex:501,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
        <div style={{ background:'var(--white)',borderRadius:20,width:500,maxWidth:'95vw',padding:28,boxShadow:'0 20px 60px rgba(108,92,231,.2)',border:'1.5px solid var(--border)',animation:'slideUp .25s ease both' }}>

          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22 }}>
            <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:19,fontWeight:900,color:'var(--navy)',display:'flex',alignItems:'center',gap:10 }}>
              <IconShield s={20} c="var(--purple)"/> {editRule?'แก้ไขกติกา':'เพิ่มกติกาใหม่'}
            </div>
            <button onClick={onClose} style={{ width:30,height:30,borderRadius:8,border:'1px solid var(--border)',background:'transparent',color:'var(--text-soft)',display:'flex',alignItems:'center',justifyContent:'center' }}><IconClose/></button>
          </div>

          {[['ชื่อกติกา', <input style={INP} value={name} onChange={e=>setName(e.target.value)} placeholder="เช่น ห้ามส่งงานหลัง 19:00"/>]].map(([lbl,el])=>(
            <div key={lbl} style={{ marginBottom:15 }}>
              <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:7 }}>{lbl}</div>
              {el}
            </div>
          ))}

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:15 }}>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:7 }}>ประเภท</div>
              <select style={INP} value={cat} onChange={e=>setCat(e.target.value)}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:7 }}>ความรุนแรง</div>
              <select style={INP}>
                {['แจ้งเตือน','เตือนสาธารณะ','รายงานพิเศษ'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:15 }}>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:7 }}>เวลาที่กำหนด</div>
              <input style={INP} type="time" defaultValue="19:00"/>
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:7 }}>วันที่บังคับใช้</div>
              <select style={INP}>{['ทุกวัน','วันทำงาน (จ–ศ)','ทุกศุกร์'].map(d=><option key={d}>{d}</option>)}</select>
            </div>
          </div>

          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--text-soft)',textTransform:'uppercase',letterSpacing:1,marginBottom:7 }}>คำอธิบาย</div>
            <input style={INP} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="รายละเอียดกติกา"/>
          </div>

          <div style={{ display:'flex',gap:10,justifyContent:'flex-end' }}>
            <button onClick={onClose} style={{ padding:'10px 18px',borderRadius:'var(--r-sm)',border:'1.5px solid var(--border)',background:'transparent',color:'var(--text-mid)',fontSize:13,fontWeight:700 }}>ยกเลิก</button>
            <button onClick={save} style={{ display:'flex',alignItems:'center',gap:8,background:'var(--purple)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',padding:'11px 20px',fontSize:13.5,fontWeight:700,boxShadow:'0 6px 18px rgba(108,92,231,.35)' }}>
              <IconCheck s={13}/> บันทึกกติกา
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
