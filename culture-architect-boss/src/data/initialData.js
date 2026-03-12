export const MEMBERS = [
  { id:'TK',    av:'TK', pct:98, viol:0, label:'ดีเยี่ยม',       cls:'green',  grad:'linear-gradient(135deg,#6c5ce7,#a29bfe)' },
  { id:'Anna',  av:'An', pct:74, viol:2, label:'ต้องปรับปรุง',   cls:'yellow', grad:'linear-gradient(135deg,#f97316,#fdcb6e)' },
  { id:'Macus', av:'Ma', pct:61, viol:3, label:'ต้องแก้ไขด่วน', cls:'red',    grad:'linear-gradient(135deg,#e17055,#f97316)' },
]

export const INITIAL_RULES = [
  { id:1, name:'ห้ามส่งงานหลัง 19:00',       desc:'ส่งหลังเวลาที่กำหนดถือว่าฝ่าฝืน ล็อกถึง 08:00 วันถัดไป',      cat:'เวลา',    pct:92, active:true, icon:'clock', color:'#6c5ce7', iconBg:'#eee9ff' },
  { id:2, name:'ประชุมไม่เกิน 45 นาที',        desc:'ทุก Meeting ต้องมี Agenda และจบตามเวลาที่กำหนด',                cat:'ประชุม',  pct:71, active:true, icon:'cal',   color:'#9a7c00', iconBg:'#fff5dc' },
  { id:3, name:'ห้าม Ping ช่วง Deep Work',     desc:'09:00–11:00 และ 14:00–16:00 ห้าม Tag หรือ Ping โดยไม่จำเป็น', cat:'สื่อสาร', pct:54, active:true, icon:'block', color:'#e17055', iconBg:'#fde8e3' },
  { id:4, name:'ตอบ Message ภายใน 4 ชั่วโมง', desc:'วันทำงานต้องตอบกลับ Message ทีมภายใน 4 ชั่วโมง',             cat:'สื่อสาร', pct:96, active:true, icon:'chat',  color:'#f97316', iconBg:'#fff0e5' },
]

export const DAILY_DATA = [
  {day:'จ',pct:92},{day:'อ',pct:78},{day:'พ',pct:85},
  {day:'พฤ',pct:65},{day:'ศ',pct:90},{day:'ส',pct:95},{day:'อา',pct:88},
]

export const MONTHLY_DATA = [
  {name:'ม.ค.',  pct:70, viol:7, active:false},
  {name:'ก.พ.',  pct:80, viol:5, active:false},
  {name:'มี.ค.', pct:88, viol:3, active:true },
]

export const INITIAL_LOGS = [
  {id:'l1',av:'ส',name:'สมชาย',  rule:'ห้าม ping หลัง 22:00 น.',time:'เมื่อวาน 23:10 น.',    grad:'linear-gradient(135deg,#6c5ce7,#a29bfe)',sent:false},
  {id:'l2',av:'อ',name:'อรอนงค์',rule:'ประชุมไม่เกิน 45 นาที',  time:'วันจันทร์ 14:30 น.',   grad:'linear-gradient(135deg,#f97316,#fdcb6e)',sent:true },
  {id:'l3',av:'ก',name:'กานดา',  rule:'ห้าม ping หลัง 22:00 น.',time:'วันอาทิตย์ 23:45 น.', grad:'linear-gradient(135deg,#00b894,#00d2b4)',sent:false},
]

export const CAT_META = {
  เวลา:    {icon:'clock',color:'#6c5ce7',iconBg:'#eee9ff'},
  ประชุม:  {icon:'cal',  color:'#9a7c00',iconBg:'#fff5dc'},
  สื่อสาร: {icon:'chat', color:'#f97316',iconBg:'#fff0e5'},
}
