// All SVG icon components
const i = (d, sw = '2') => ({ fill:'none', stroke:'currentColor', strokeWidth:sw, viewBox:'0 0 24 24', children:d })

export const IconShield   = ({s=16,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2.1" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
export const IconBarChart = ({s=16,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
export const IconRefresh  = ({s=16,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
export const IconPlus     = ({s=14,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
export const IconCheck    = ({s=13,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
export const IconSend     = ({s=14,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2.2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
export const IconTrash    = ({s=11,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
export const IconEdit     = ({s=11,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
export const IconDots     = ({s=14,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
export const IconClose    = ({s=13,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
export const IconUsers    = ({s=12,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
export const IconWarning  = ({s=12,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
export const IconInfo     = ({s=13,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
export const IconBolt     = ({s=13,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="2"   viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
export const IconBell     = ({s=17,c='currentColor'}) => <svg width={s} height={s} fill="none" stroke={c} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>

export function getRuleIcon(type, color) {
  const p = { fill:'none', stroke:color, strokeWidth:'1.9' }
  if (type==='clock') return <svg width="19" height="19" viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  if (type==='cal')   return <svg width="19" height="19" viewBox="0 0 24 24" {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  if (type==='block') return <svg width="19" height="19" viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
  if (type==='chat')  return <svg width="19" height="19" viewBox="0 0 24 24" {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  return <svg width="19" height="19" viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}
