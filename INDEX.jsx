import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════
const CATS = {
  friends:{ emoji:"👬", label:"الصحاب",     color:"#f39c12", grad:"linear-gradient(135deg,#f39c12,#e67e22)" },
  family: { emoji:"👨‍👩‍👧‍👦", label:"العايلة",    color:"#2ecc71", grad:"linear-gradient(135deg,#2ecc71,#27ae60)" },
  couples:{ emoji:"💑",  label:"الكوبل",     color:"#e84393", grad:"linear-gradient(135deg,#e84393,#c0392b)" },
  lovers: { emoji:"💕",  label:"الحبايب",    color:"#9b59b6", grad:"linear-gradient(135deg,#9b59b6,#6c3483)" },
  work:   { emoji:"💼",  label:"العمل",      color:"#3498db", grad:"linear-gradient(135deg,#3498db,#2980b9)" },
  ramadan:{ emoji:"🌙",  label:"رمضان",      color:"#1abc9c", grad:"linear-gradient(135deg,#1abc9c,#16a085)" },
  eid:    { emoji:"🎉",  label:"العيد",      color:"#e67e22", grad:"linear-gradient(135deg,#e67e22,#d35400)" },
  bac:    { emoji:"🎓",  label:"باكالوريا",  color:"#8e44ad", grad:"linear-gradient(135deg,#8e44ad,#6c3483)" },
  spicy:  { emoji:"🔥",  label:"جريء 🔞",    color:"#e74c3c", grad:"linear-gradient(135deg,#e74c3c,#c0392b)" },
};
const CAT_ORDER = ["friends","family","couples","lovers","work","ramadan","eid","bac","spicy"];
const VOTE_TIMER = 30;

const Q = {
  friends:["شكون أكثر واحد يڨول 'أنا جاي' وهو مازال في الدار؟ 😂","شكون أكثر واحد يصرف فلوسو في القهوة؟ ☕","شكون اللي يضحك وحدو؟ 😅","شكون اللي يكذب أكثر في المجموعة؟ 🤥","شكون اللي دايمن يتأخر؟ ⏰","شكون اللي ياكل ماكلة الغير بدون ما يطلب؟ 🍕","شكون اللي عندو أكثر تصاور غريبة في التليفون؟ 📸","شكون اللي يكون أول واحد يخرج من كوه لانتا؟ 🏝️","شكون اللي يقعد أطول وقت في الحمام؟ 🚽","شكون اللي يكون أسوء سواق في المجموعة؟ 🚗","شكون اللي يخاف أكثر من الحشرات؟ 🕷️","شكون اللي ما يحفظش سر أطول وقت؟ 🤫","شكون اللي يكثر يعمل سيلفي؟ 🤳","شكون اللي ينسى أعياد ميلاد الآخرين؟ 🎁","شكون اللي يبكي أكثر في الأفلام الكرتونية؟ 🎬","شكون اللي أضعف واحد في الجغرافيا؟ 🌍","شكون مدمن أكثر على وسائل التواصل؟ 📱","شكون اللي عندو أضحوكات أضعف شيء؟ 😅","شكون اللي يكون أول واحد يستسلم في تحدي؟ 🏳️","شكون اللي يكثر يكسر حاجة بالغلط؟ 💥","شكون اللي يكثر يطلب البيتزا كلها لروحو؟ 🍕","شكون اللي أحسن ممثل باش يمّرض روحو؟ 🤒","شكون اللي يغني أزكى في الكاريوكي؟ 🎤","شكون اللي يرقص أغرب شيء في الليالي؟ 💃","شكون اللي عندو أكثر لباس ما يلبسوش؟ 👗"],
  family:["شكون أكثر واحد يسرق من الثلاجة بالليل؟ 😂","شكون اللي دايمن يسبّت الضو وقت يخرج؟ 💡","شكون اللي يستعمل كل الماء الساخن في الدوش؟ 🚿","شكون اللي أصعب واحد يفيق في الصباح؟ ⏰","شكون اللي يكثر يغفى في الكنبة؟ 🛋️","شكون اللي يكثر يحكي نفس القصة 10 مرات؟ 🔄","شكون اللي ما يرتبش في غرفتو؟ 🛏️","شكون اللي مدمن أكثر على تليفونو وقت المايدة؟ 📵","شكون اللي يكثر يتخانق على التلفار؟ 📺","شكون اللي لازم دايمن يكون آخر كلمة؟ 💬","شكون اللي عندو أحرج تصاور من الطفولة؟ 👶","شكون اللي أول واحد يمشي من تجمع عائلي؟ 🚪","شكون اللي يستعير حوايج الغير بدون ما يطلب؟ 👕","شكون اللي أدرامي أكثر وقت يكون مريض؟ 🤒","شكون اللي يعطي نصائح قديمة ما عادش تنفع؟ 📚","شكون اللي يكثر يشارك كل حاجة على الفايسبوك؟ 👍","شكون اللي أحسن واحد يحاكي أعضاء العائلة؟ 🎭","شكون اللي أول واحد يقوم في نهار العطلة؟ ☀️","شكون اللي يجيب أغرب الهدايا؟ 🎁","شكون اللي يكثر يتذمر من الرستوران المختار؟ 🍽️","شكون اللي يكثر يدعو ناس بدون ما يشاور؟ 🚪","شكون اللي دايمن يخرب المفاجأة؟ 🎉","شكون اللي يحضر أحسن بوفي من بقايا الأكل؟ 🥡"],
  couples:["شكون اللي يأخذ أكثر مكان في القاعدة؟ 🛏️","شكون اللي دايمن يختار الرستوران؟ 🍽️","شكون اللي ينسى أعياد الميلاد؟ 📅","شكون اللي يأخذ أطول وقت باش يجهز روحو؟ 💆","شكون اللي يصرف أكثر فلوس بلا فايدة؟ 💸","شكون اللي دايمن عندو الحق في الخناقات؟ 🤔","شكون اللي أرومانسي أكثر في الحياة اليومية؟ 💕","شكون اللي يكثر يزعل بصمت؟ 😤","شكون اللي أكثر واحد متردد في اختيار فلم؟ 🎥","شكون اللي يكثر يتذكر خناقة صارت قبل 3 سنين؟ 🧠","شكون اللي يكثر يبدل الخطط في اللخر؟ 🔄","شكون اللي يكثر يبكي في الأفلام الرومانسية؟ 🎬","شكون اللي أول واحد يغفى؟ 😴","شكون اللي يكثر يختار هدية ما تنفعش؟ 🎁","شكون اللي يكثر يطلب من الآخر ياكل أقل؟ 😏","شكون اللي يكثر ينام مع أكثر مخدة؟ 🛏️","شكون اللي يكثر يفضح سر قدام الناس؟ 🤫","شكون اللي دايمن يبدل الخطط في اللخر؟ 🔄","شكون اللي يكثر يغني تحت الدوش؟ 🎶","شكون اللي أرومانسي أكثر في الليل؟ 🌙"],
  lovers:["شكون أكثر واحد يعمل flirt؟ 😏","شكون أرومانسي أكثر فيكم الاثنين؟ 💑","شكون اللي يبعت أكثر رسايل حبّ؟ 💌","شكون اللي أعجب بالتاني أول مرة؟ ⚡","شكون اللي يقول 'نحبك' أول واحد في الصباح؟ 🌅","شكون اللي يحفظ أكثر هدايا وتفاصيل صغيرة؟ 🎀","شكون اللي يكثر يبكي وقت العرس؟ 💒","شكون أكثر واحد متحمس لأعياد الميلاد؟ 🎂","شكون اللي يكثر يختار الأغاني في السيارة؟ 🎵","شكون اللي أرومانسي أكثر وقت السفر؟ 🌍","شكون اللي يكثر يحضر عشاء بالشموع؟ 🕯️","شكون اللي يكثر يحس بالوحشة وقت الآخر مسافر؟ 😢","شكون أحسن واحد يواسي الآخر في الأوقات الصعبة؟ 🫂","شكون اللي يكثر يعمل مفاجأة في عيد الحب؟ 💝","شكون اللي يكثر يحب يتفرج على النجوم مع بعض؟ ⭐","شكون اللي يكثر يبكي وقت يسمع 'أغانيتكم'؟ 🎵","شكون اللي يكثر يحمر وجهو في موعد غرامي؟ 😳","شكون اللي يكثر يتصوّر الآخر دون ما يحس؟ 📸","شكون اللي يكثر يخترع أسماء تدليل؟ 🐥","شكون اللي يكثر يطبخ الأكلة المفضلة دون ما يطلب؟ 🍝"],
  work:["شكون أكثر واحد يتأخر كل نهار؟ ⏰","شكون أكثر واحد يشرب قهوة أكثر من المطلوب؟ ☕","شكون اللي يكثر ياخذ بريك؟ 🚬","شكون اللي ينام في المكتب وقت المدير ماكش؟ 😴","شكون اللي يتغيب أكثر بحجة المرض؟ 🤒","شكون اللي دايمن ياخذ كريدي على خدمة غيرو؟ 🎭","شكون اللي يكثر يمدح روحو قدام الرئيس؟ 🗣️","شكون اللي يكثر يعمل روحو مشغول باش ما يساعدش؟ 🙈","شكون اللي دايمن يكتب إيميلات طويلة بلا معنى؟ ✉️","شكون اللي يكثر ينسى يرد على الإيميلات؟ 📧","شكون اللي دايمن يتأخر من الغداء؟ 🍽️","شكون اللي يكثر يتفرج في فيديوات وقت الخدمة؟ 🎥","شكون أحسن واحد يغطي على زملاءه؟ 🦸","شكون اللي يكثر يبرر أخطاءه ب 'الضغط'؟ 😩","شكون أحسن واحد يتفادى المسؤولية؟ 🏃‍♂️","شكون اللي دايمن يسبقو العيد في طلب العيدية؟ 💶","شكون اللي دايمن يجيب حلويات للمكتب؟ 🍰","شكون اللي ينجز أقل حاجة في اليوم؟ 📉","شكون اللي يكثر يشكي من الحر ولا البرد؟ 🌡️","شكون اللي يكثر يطلب مساعدة في حاجات بسيطة؟ 🙋"],
  ramadan:["شكون أكثر واحد ياكل في السحور؟ 🌙","شكون أكثر واحد ينعس بعد الفطور؟ 😴","شكون اللي دايمن ينسى يصوم أول يوم؟ 🤭","شكون اللي يكثر يتفرج في المسلسلات التركية؟ 📺","شكون اللي دايمن يشرب الماء قدام الصايمين؟ 🚰","شكون اللي يكثر يقول 'نعمل رياضة بعد الفطار' ويموت على الكنبة؟ 🛋️","شكون اللي يكثر يصور الأكل وينزله على الأنستغرام؟ 📸","شكون اللي دايمن يزيد في الحلويات؟ 🍰","شكون اللي يكثر ياكل بجعة باش يعوض النهار؟ 🐪","شكون اللي دايمن يتقهو بعد الفطار ويسهر؟ ☕","شكون اللي دايمن يشك في أذان المغرب؟ 🕌","شكون اللي يكثر يحب الزلابية؟ 🥨","شكون اللي دايمن ينعس في التراويح؟ 😵","شكون اللي يكثر يحضر مائدة رمضان؟ 🍽️","شكون اللي دايمن يسرق لقمة قبل الأذان؟ 🤫","شكون اللي يكثر يشكي من العطش؟ 🥵","شكون أحسن واحد في تجهيز مائدة رمضان؟ 🍽️","شكون اللي يكثر يقرا دعاء الإفطار بصوت عالي؟ 🕌","شكون اللي يكثر يخاف من زيادة الوزن؟ ⚖️","شكون اللي دايمن يطلب فريكاسي في الليل؟ 🥪"],
  eid:["شكون أكثر واحد يحب لبسة العيد؟ 👗","شكون أكثر واحد يطلب العيدية؟ 💰","شكون اللي دايمن ينسى يعطيك العيدية؟ 😅","شكون اللي يصرف العيدية في نفس النهار؟ 💸","شكون اللي أكثر واحد يزور العائلة كلها في نهار واحد؟ 🏃‍♂️","شكون اللي يكثر يجيب هدايا غالية باش يبان كريم؟ 🎁","شكون اللي دايمن يروح للمسجد ويرقد؟ 😴","شكون اللي دايمن يسرق العيدية من الصغار؟ 😈","شكون اللي يكثر يحضر حلويات وياكل قبل الضيوف؟ 🍰","شكون اللي دايمن يخاف من الذبايح؟ 😨","شكون اللي يكثر يتصالح مع الناس في العيد؟ 🤝","شكون اللي دايمن يلبس نفس اللبسة متاع العام اللي فات؟ 👕","شكون اللي يكثر يشتري لعب نارية ويخوف الصغار؟ 🎆","شكون أول واحد يكبر العيد بعد منتصف الليل؟ 🌅","شكون اللي دايمن يزور المقابر في العيد؟ 🪦","شكون أحسن واحد يوزع العيدية على الكل؟ 👐","شكون اللي يكثر يصرف على روحو ويقول 'هدية مني لنفسي'؟ 🛍️","شكون اللي دايمن يضبط الميزانية للعيد ويصرف أكثر؟ 📉","شكون اللي يكثر يتقهوي عند الحومة كلهم؟ ☕","شكون اللي يكثر يحب العيدية من غير ما يكون كبير ولا صغير؟ 🧒👴"],
  bac:["شكون أكثر واحد يخاف من الباك؟ 😰","شكون أكثر واحد يراجع آخر ليلة؟ 📚","شكون اللي يكثر يقول 'باش نبدا من غدوة' وما يبداش؟ ⏳","شكون اللي دايمن يطلب الحظ أكثر من المراجعة؟ 🍀","شكون اللي دايمن يتفائل ب 'ربّي يسهل' ويرقد؟ 😴","شكون اللي يكثر يحفظ في آخر ساعة وينسى كل شيء؟ 😵","شكون اللي دايمن يخاف من مادة الفلسفة؟ 🤯","شكون اللي دايمن يلوم على الأستاذ وقت ما ينجحش؟ 👨‍🏫","شكون اللي يكثر يكتب دعاء على الورقة؟ 📝","شكون اللي دايمن يخرج من قاعة الباك باكي؟ 😭","شكون اللي يكثر يضيع وقتو في التلفون قبل الباك؟ 📱","شكون اللي دايمن يصيب في المواضيع بالصدفة؟ 🍀","شكون اللي يكثر يبرمج روحو على 'باش نعاود العام'؟ 🔁","شكون اللي دايمن يراجع مع صحابو وينتهي بالحكايات؟ 🗣️","شكون اللي يكثر يطلب دعاء الأمهات؟ 🤲","شكون اللي دايمن يشتري كتب وما يقراش فيهم؟ 📚","شكون اللي يكثر يشرب ميرمية باش يركّز؟ 🍵","شكون اللي دايمن ينام على الطاولة في الباك؟ 😴","شكون اللي دايمن يخرج أول واحد من القاعة؟ 🏃‍♂️","شكون أحسن واحد ينسا كل شيء بعد الباك؟ 🎉"],
  spicy:["شكون أكثر واحد عنده خبرة؟ 🔥","شكون اللي يكثر يخطط للقاءات سرية؟ 🤫","شكون اللي دايمن يدي المبادرة؟ 👑","شكون اللي يكثر يفتح المواضيع الساخنة؟ 🗣️","شكون اللي دايمن يموت على القبل؟ 😘","شكون اللي يكثر يكتب رسائل جريئة؟ 💌","شكون اللي دايمن يخبي هاتفو؟ 📱","شكون اللي يكثر يعمل سوربرايز ليلي؟ 🌙","شكون اللي دايمن يستعمل الكلام الموحي؟ 😏","شكون اللي يكثر يستعمل العطور المثيرة؟ 🌹","شكون اللي دايمن يحب يكسر الروتين؟ 🔨","شكون اللي دايمن يحب يكون مسيطر؟ 👑","شكون اللي يكثر يبحث على علاقة سريعة؟ ⏩","شكون اللي دايمن يرجع للعلاقة حتى بعد الفراق؟ 🔁","شكون اللي يكثر يحب يتبادل الأدوار؟ 🎭","شكون اللي يكثر يخاف من الفضيحة؟ 😨","شكون اللي دايمن يطلب المغفرة بعد كل خطيئة؟ 😇","شكون اللي يكثر يحس بالغيرة؟ ⚡","شكون اللي دايمن يحب يتفرج على الأضواء الخافتة؟ 🕯️","شكون اللي يكثر يلبس ملابس مثيرة في الدار؟ 👙"],
};

const LEGENDARY = [
  "👑 LEGENDARY: شكون لو دخل السياسة يصلح بلادنا؟",
  "🌟 LEGENDARY: شكون يستحق لقب 'ملك تونس'؟",
  "🔥 LEGENDARY: شكون لو حذفتو العالم ما يوقفش؟",
  "💎 LEGENDARY: شكون أندر واحد في المجموعة؟",
  "💀 LEGENDARY: شكون سري من أسراره يهز حبس؟",
];

const RANKS = {1:"😴 مبتدئ",3:"😎 أصيل",7:"🔥 زعيم",12:"👑 ملك",20:"☠️ أسطورة"};
function getRank(lvl){const ks=Object.keys(RANKS).map(Number).sort((a,b)=>b-a);for(const k of ks)if(lvl>=k)return RANKS[k];return RANKS[1];}

// ═══════════════════════════════════════════════════════════
//  STORAGE
// ═══════════════════════════════════════════════════════════
const RK = c => `chkoun2025_${c}`;

async function readRoom(code) {
  try { const r = await window.storage.get(RK(code), true); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function writeRoom(room) {
  try { await window.storage.set(RK(room.code), JSON.stringify({...room, lastUpdate: Date.now()}), true); return true; }
  catch { return false; }
}
async function deleteRoom(code) {
  try { await window.storage.delete(RK(code), true); } catch {}
}

// ═══════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════
function genCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let c = '';
  for(let i=0;i<5;i++) c += chars[Math.floor(Math.random()*chars.length)];
  return c;
}
function genId() { return Math.random().toString(36).substr(2,10); }

function pickQuestion(category, usedIdxs) {
  if(Math.random() < 0.05) return { text: LEGENDARY[Math.floor(Math.random()*LEGENDARY.length)], idx:-1, rarity:'legendary' };
  const pool = Q[category] || Q.friends;
  const avail = pool.map((t,i)=>({t,i})).filter(({i})=>!usedIdxs.includes(i));
  if(!avail.length) { const i=Math.floor(Math.random()*pool.length); return {text:pool[i],idx:i,rarity:'common'}; }
  const pick = avail[Math.floor(Math.random()*avail.length)];
  return { text: pick.t, idx: pick.i, rarity:'common' };
}

function computeVoteResult(votes, players) {
  // votes = { targetId: [voterId, ...] }
  const counts = {};
  for(const [tid, voterIds] of Object.entries(votes)) {
    counts[tid] = (counts[tid]||0) + voterIds.length;
  }
  let winnerId = null, maxV = 0;
  for(const [tid, cnt] of Object.entries(counts)) {
    if(cnt > maxV) { maxV = cnt; winnerId = tid; }
  }
  const winner = players.find(p=>p.id===winnerId);
  return { winnerId, winnerName: winner?.name||'', voteCount: maxV, counts };
}

// ═══════════════════════════════════════════════════════════
//  CSS
// ═══════════════════════════════════════════════════════════
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;overflow-x:hidden;}
body{background:#050510;color:#fff;font-family:'Tajawal',sans-serif;min-height:100vh;direction:rtl;}
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,245,255,.025)1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,.025)1px,transparent 1px);background-size:40px 40px;animation:gridMove 20s linear infinite;pointer-events:none;z-index:0;}
@keyframes gridMove{from{background-position:0 0}to{background-position:40px 40px}}
#root{position:relative;z-index:1;max-width:520px;width:100%;margin:0 auto;padding:1rem .8rem 5rem;min-height:100vh;}
.card{background:#0d0d20;border-radius:1.2rem;padding:1rem;margin-bottom:.8rem;border:1px solid rgba(255,255,255,.07);position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.03)0%,transparent 60%);pointer-events:none;}
.card-accent{border-color:rgba(255,45,85,.35);box-shadow:0 0 20px rgba(255,45,85,.2);}
.card-gold{border-color:rgba(255,215,0,.35);box-shadow:0 0 20px rgba(255,215,0,.15);}
.card-cyan{border-color:rgba(0,245,255,.35);box-shadow:0 0 20px rgba(0,245,255,.15);}
.card-green{border-color:rgba(0,255,135,.35);box-shadow:0 0 20px rgba(0,255,135,.15);}
input{background:#0d0d20;border:1px solid rgba(255,255,255,.12);border-radius:3rem;padding:.7rem 1.2rem;color:white;font-family:'Tajawal',sans-serif;font-size:1rem;font-weight:700;text-align:center;width:100%;outline:none;transition:border-color .2s;}
input:focus{border-color:rgba(0,245,255,.5);box-shadow:0 0 15px rgba(0,245,255,.1);}
input::placeholder{color:#333;}
button{font-family:'Tajawal',sans-serif;cursor:pointer;border:none;font-weight:700;transition:all .15s;}
button:active{transform:scale(.95);}
button:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.btn-primary{background:linear-gradient(135deg,#ff2d55,#c0002a);color:white;padding:.8rem 1rem;border-radius:3rem;width:100%;font-size:1rem;font-weight:900;box-shadow:0 0 20px rgba(255,45,85,.4);margin-bottom:.6rem;}
.btn-primary:hover:not(:disabled){box-shadow:0 0 35px rgba(255,45,85,.6);}
.btn-purple{background:linear-gradient(135deg,#b040ff,#6000bb);box-shadow:0 0 20px rgba(176,64,255,.4);}
.btn-gold{background:linear-gradient(135deg,#ffd700,#cc9900);color:#000;box-shadow:0 0 20px rgba(255,215,0,.4);}
.btn-green{background:linear-gradient(135deg,#00ff87,#00cc66);color:#000;box-shadow:0 0 20px rgba(0,255,135,.4);}
.btn-cyan{background:linear-gradient(135deg,#00f5ff,#0099cc);color:#000;}
.btn-ghost{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:white;border-radius:3rem;padding:.7rem 1.2rem;}
.btn-ghost:hover{background:rgba(255,255,255,.1);}
.logo{font-size:1.3rem;font-weight:900;background:linear-gradient(90deg,#ff2d55,#b040ff,#00f5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:200%;animation:shimmer 3s linear infinite;}
@keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
.section-title{font-size:.72rem;font-weight:900;color:#444;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.5rem;}
.stats-strip{display:flex;gap:.5rem;margin-bottom:.8rem;}
.stat-pill{flex:1;background:#0d0d20;border:1px solid rgba(255,255,255,.06);border-radius:.8rem;padding:.4rem;text-align:center;}
.stat-pill .sv{font-size:1rem;font-weight:900;}
.stat-pill .sl{font-size:.6rem;color:#555;}
.xp-track{background:#0d0d20;border-radius:2rem;height:6px;overflow:hidden;border:1px solid rgba(255,255,255,.05);}
.xp-fill{height:100%;border-radius:2rem;background:linear-gradient(90deg,#b040ff,#00f5ff);transition:width .4s;}
.champ-banner{background:linear-gradient(135deg,#1a0020,#200010,#0a1a30);border:1px solid rgba(255,215,0,.4);border-radius:1.5rem;padding:1rem;text-align:center;box-shadow:0 0 30px rgba(255,215,0,.15);position:relative;overflow:hidden;margin-bottom:.8rem;}
.champ-banner::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:conic-gradient(transparent 0deg,rgba(255,215,0,.1)10deg,transparent 20deg);animation:spin 8s linear infinite;}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.crown{font-size:2rem;animation:float 2s ease-in-out infinite;}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.player-row{display:flex;align-items:center;gap:.7rem;padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.04);}
.player-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.dot-online{background:#00ff87;box-shadow:0 0 6px #00ff87;}
.dot-offline{background:#333;}
.lb-rank{font-size:1rem;font-weight:900;width:1.8rem;text-align:center;}
.lb-name{flex:1;font-weight:700;font-size:.9rem;}
.lb-score{font-weight:900;font-size:.9rem;background:linear-gradient(135deg,#ffd700,#ff7c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.vote-grid{display:grid;gap:.5rem;margin:.8rem 0;}
.vote-btn{padding:.8rem 1rem;border-radius:1rem;font-size:1rem;font-weight:900;color:white;cursor:pointer;border:none;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;transition:all .1s;}
.vote-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);}
.vote-btn:active{transform:scale(.96);}
.vote-btn.voted{box-shadow:0 0 20px rgba(0,255,135,.5);border:2px solid #00ff87;}
.vote-bar{position:absolute;bottom:0;left:0;height:3px;background:#00ff87;transition:width .5s;}
.q-box{background:linear-gradient(135deg,#0d0d25,#150d20);border:1px solid rgba(0,245,255,.25);border-radius:1.5rem;padding:1.2rem;text-align:center;margin-bottom:.8rem;box-shadow:0 0 25px rgba(0,245,255,.1);min-height:100px;display:flex;align-items:center;justify-content:center;}
.q-text{font-size:1.15rem;font-weight:700;line-height:1.5;animation:qFade .3s ease-out;}
@keyframes qFade{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.timer-ring{width:56px;height:56px;position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.timer-ring svg{position:absolute;top:0;left:0;transform:rotate(-90deg);}
.timer-ring .tn{font-size:1.1rem;font-weight:900;z-index:1;}
.timer-danger{color:#ff2d55;animation:pulse .5s ease-in-out infinite alternate;}
@keyframes pulse{from{transform:scale(1)}to{transform:scale(1.15)}}
.code-display{background:linear-gradient(135deg,#0d0d25,#1a0d25);border:2px solid rgba(0,245,255,.3);border-radius:1.2rem;padding:1rem;text-align:center;margin-bottom:.8rem;}
.code-big{font-size:2.8rem;font-weight:900;letter-spacing:.3em;color:#00f5ff;text-shadow:0 0 20px rgba(0,245,255,.5);}
.badge{display:inline-block;border-radius:2rem;padding:.15rem .6rem;font-size:.7rem;font-weight:900;}
.badge-gold{background:linear-gradient(135deg,#3d2a00,#5a3d00);border:1px solid rgba(255,215,0,.5);color:#ffd700;animation:glow-gold 2s ease-in-out infinite;}
@keyframes glow-gold{0%,100%{box-shadow:0 0 5px rgba(255,215,0,.5)}50%{box-shadow:0 0 20px #ffd700}}
.badge-legendary{background:linear-gradient(135deg,#3d2a00,#5a3d00);border:1px solid rgba(255,215,0,.5);color:#ffd700;}
.winner-card{background:linear-gradient(135deg,rgba(0,255,135,.12),rgba(0,245,255,.08));border:1px solid rgba(0,255,135,.3);border-radius:1.5rem;padding:1.2rem;text-align:center;margin-bottom:.8rem;animation:winnerPop .4s cubic-bezier(.34,1.56,.64,1);}
@keyframes winnerPop{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
.cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:.8rem;}
.cat-btn{background:#12122a;border:1px solid rgba(255,255,255,.08);border-radius:1rem;padding:.6rem .3rem;cursor:pointer;text-align:center;font-family:'Tajawal',sans-serif;color:white;transition:all .15s;}
.cat-btn.active{transform:translateY(-2px);}
.cat-btn:active{transform:scale(.93);}
.cat-btn .ce{font-size:1.4rem;display:block;margin-bottom:.2rem;}
.cat-btn .cl{font-size:.75rem;font-weight:700;}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem;}
.modal-box{background:linear-gradient(145deg,#0d0d20,#150d20);border-radius:1.5rem;padding:1.5rem;width:100%;max-width:360px;border:1px solid rgba(255,255,255,.1);animation:modalIn .25s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden;}
.modal-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#ff2d55,#b040ff,#00f5ff);}
@keyframes modalIn{from{opacity:0;transform:scale(.8)translateY(30px)}to{opacity:1;transform:scale(1)translateY(0)}}
.toast{position:fixed;top:1rem;left:50%;transform:translateX(-50%);border-radius:3rem;font-weight:900;z-index:999;white-space:nowrap;font-size:.9rem;padding:.6rem 1.4rem;font-family:'Tajawal',sans-serif;animation:toastIn .3s cubic-bezier(.34,1.56,.64,1);}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%)translateY(-20px)}to{opacity:1;transform:translateX(-50%)translateY(0)}}
.bottom-nav{position:fixed;bottom:0;left:0;right:0;background:rgba(5,5,16,.96);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-around;padding:.6rem 0 .8rem;z-index:10;}
.nav-item{display:flex;flex-direction:column;align-items:center;gap:.1rem;cursor:pointer;padding:.3rem .8rem;border-radius:.8rem;color:#444;font-family:'Tajawal',sans-serif;transition:color .15s;}
.nav-item.active{color:#ff2d55;}
.nav-icon{font-size:1.3rem;}
.nav-label{font-size:.6rem;font-weight:700;}
.notif-dot{position:absolute;top:-2px;right:-2px;width:8px;height:8px;background:#ff2d55;border-radius:50%;animation:pulse .8s ease-in-out infinite;}
.top-header{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0 1rem;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(255,45,85,.3);border-radius:2px;}
.flex-b{display:flex;align-items:center;justify-content:space-between;}
.text-center{text-align:center;}
.text-gold{color:#ffd700;} .text-accent{color:#ff2d55;} .text-cyan{color:#00f5ff;} .text-green{color:#00ff87;} .text-dim{color:#555;font-size:.8rem;}
.bold{font-weight:900;}
.mt1{margin-top:.4rem;}.mt2{margin-top:.8rem;}.mb1{margin-bottom:.4rem;}.mb2{margin-bottom:.8rem;}
.combo-bar{background:#0d0d20;border:1px solid rgba(255,255,255,.06);border-radius:1rem;padding:.5rem .8rem;display:flex;align-items:center;gap:.7rem;margin-bottom:.7rem;}
.combo-track{flex:1;background:#060616;border-radius:2rem;height:7px;overflow:hidden;}
.combo-fill{height:100%;border-radius:2rem;background:linear-gradient(90deg,#ff7c00,#ff2d55,#b040ff);transition:width .3s;}
.waiting-player{display:flex;align-items:center;gap:.7rem;padding:.5rem .8rem;background:#0d0d20;border-radius:.8rem;margin-bottom:.4rem;border:1px solid rgba(255,255,255,.06);}
.host-crown{font-size:.8rem;background:rgba(255,215,0,.15);border:1px solid rgba(255,215,0,.3);border-radius:2rem;padding:.1rem .5rem;color:#ffd700;}
.results-row{display:flex;align-items:center;gap:.6rem;padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.04);}
.vote-count-bar{flex:1;background:#0d0d20;border-radius:2rem;height:8px;overflow:hidden;}
.vote-count-fill{height:100%;border-radius:2rem;background:linear-gradient(90deg,#ff2d55,#ff7c00);transition:width .5s;}
`;

// ═══════════════════════════════════════════════════════════
//  TOAST MANAGER
// ═══════════════════════════════════════════════════════════
let toastQueue = [];
function showToast(msg, bg='#ff2d55', dur=2200) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  t.style.cssText = `background:${bg};top:${1 + toastQueue.length * 3.5}rem`;
  document.body.appendChild(t);
  toastQueue.push(t);
  setTimeout(() => { t.remove(); toastQueue = toastQueue.filter(x=>x!==t); }, dur);
}

// ═══════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [myId] = useState(() => {
    let id = sessionStorage.getItem('cq_id');
    if (!id) { id = genId(); sessionStorage.setItem('cq_id', id); }
    return id;
  });

  // Screens: landing | waiting | playing | roundEnd | leaderboard | finished
  const [screen, setScreen]   = useState('landing');
  const [room, setRoom]       = useState(null);

  // Form state
  const [nameInput, setNameInput] = useState(() => sessionStorage.getItem('cq_name') || '');
  const [codeInput, setCodeInput] = useState('');
  const [showJoin, setShowJoin]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [selCat, setSelCat]       = useState('friends');

  // Game UI state
  const [myVote, setMyVote]         = useState(null); // targetId I voted for
  const [timeLeft, setTimeLeft]     = useState(VOTE_TIMER);
  const [showCatModal, setShowCatModal] = useState(false);
  const [flash, setFlash]           = useState(null); // winner flash

  const pollingRef  = useRef(null);
  const timerRef    = useRef(null);
  const prevUpdateRef = useRef(0);
  const roomCodeRef = useRef('');

  const isHost = room?.hostId === myId;
  const me = room?.players?.find(p => p.id === myId);

  // ─── CSS injection ───
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);

    // Check URL hash for room code
    try {
      const hash = window.location.hash;
      const m = hash.match(/[#&?]room=([A-Z0-9]+)/i);
      if (m) { setCodeInput(m[1].toUpperCase()); setShowJoin(true); }
    } catch {}

    // Restore session
    const savedCode = sessionStorage.getItem('cq_room');
    const savedName = sessionStorage.getItem('cq_name');
    if (savedCode && savedName) {
      (async () => {
        const r = await readRoom(savedCode);
        if (r && r.players.find(p => p.id === myId)) {
          setRoom(r);
          roomCodeRef.current = savedCode;
          if (r.status === 'waiting') setScreen('waiting');
          else if (r.status === 'playing') { setMyVote(null); setScreen('playing'); }
          else if (r.status === 'roundEnd') setScreen('roundEnd');
          else if (r.status === 'finished') setScreen('finished');
        }
      })();
    }
    return () => s.remove();
  }, []);

  // ─── Polling ───
  const startPolling = useCallback((code) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      const r = await readRoom(code);
      if (!r) return;
      if (r.lastUpdate === prevUpdateRef.current) return;
      prevUpdateRef.current = r.lastUpdate;
      setRoom(prev => {
        if (prev?.status !== r.status) {
          if (r.status === 'waiting')  { setScreen('waiting');  stopTimer(); }
          if (r.status === 'playing')  { setMyVote(null); setScreen('playing'); startTimer(r.timerStart); }
          if (r.status === 'roundEnd') { setScreen('roundEnd'); stopTimer(); }
          if (r.status === 'finished') { setScreen('finished'); stopTimer(); }
        }
        return r;
      });
    }, 2500);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
  }, []);

  // ─── Timer ───
  const startTimer = useCallback((timerStart) => {
    stopTimer();
    timerRef.current = setInterval(() => {
      const left = Math.max(0, VOTE_TIMER - Math.floor((Date.now() - timerStart) / 1000));
      setTimeLeft(left);
    }, 500);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setTimeLeft(VOTE_TIMER);
  }, []);

  // ─── Create Room ───
  async function handleCreate() {
    const name = nameInput.trim();
    if (!name) { setError('اكتب اسمك أولاً!'); return; }
    setLoading(true); setError('');
    sessionStorage.setItem('cq_name', name);

    const code = genCode();
    const me = { id: myId, name, score: 0, level: 1, xp: 0, streak: 0, gems: 0, votes_received: 0 };
    const newRoom = {
      code,
      hostId: myId,
      hostName: name,
      players: [me],
      status: 'waiting',
      category: 'friends',
      question: null,
      usedQIdx: [],
      round: 0,
      votes: {},
      hasVoted: [],
      roundWinner: null,
      timerStart: null,
      comboMult: 1,
      comboOwner: null,
      lastWinnerId: null,
      lastUpdate: Date.now(),
      createdAt: Date.now(),
    };
    await writeRoom(newRoom);
    setRoom(newRoom);
    roomCodeRef.current = code;
    sessionStorage.setItem('cq_room', code);
    startPolling(code);
    setLoading(false);
    setScreen('waiting');
  }

  // ─── Join Room ───
  async function handleJoin() {
    const name = nameInput.trim();
    const code = codeInput.trim().toUpperCase();
    if (!name) { setError('اكتب اسمك أولاً!'); return; }
    if (code.length < 4) { setError('اكتب كود الغرفة!'); return; }
    setLoading(true); setError('');
    sessionStorage.setItem('cq_name', name);

    const r = await readRoom(code);
    if (!r) { setError('ما لقيناش الغرفة! تأكد من الكود 🔍'); setLoading(false); return; }
    if (r.players.length >= 10) { setError('الغرفة عامرة (10/10)!'); setLoading(false); return; }
    if (r.status !== 'waiting') { setError('اللعبة بدات بالفعل!'); setLoading(false); return; }

    // already in room?
    if (!r.players.find(p => p.id === myId)) {
      const me = { id: myId, name, score: 0, level: 1, xp: 0, streak: 0, gems: 0, votes_received: 0 };
      r.players.push(me);
      await writeRoom(r);
    }
    setRoom(r);
    roomCodeRef.current = code;
    sessionStorage.setItem('cq_room', code);
    startPolling(code);
    setLoading(false);
    setScreen('waiting');
  }

  // ─── Leave Room ───
  async function handleLeave() {
    stopPolling(); stopTimer();
    const code = roomCodeRef.current;
    if (code) {
      const r = await readRoom(code);
      if (r) {
        r.players = r.players.filter(p => p.id !== myId);
        if (r.players.length === 0) { await deleteRoom(code); }
        else {
          if (r.hostId === myId && r.players.length > 0) { r.hostId = r.players[0].id; r.hostName = r.players[0].name; }
          await writeRoom(r);
        }
      }
    }
    sessionStorage.removeItem('cq_room');
    setRoom(null); setScreen('landing'); setMyVote(null);
  }

  // ─── Start Game (host) ───
  async function handleStart() {
    const code = roomCodeRef.current;
    const r = await readRoom(code);
    if (!r) return;
    const q = pickQuestion(r.category, r.usedQIdx);
    const newRoom = {
      ...r,
      status: 'playing',
      question: { text: q.text, rarity: q.rarity },
      usedQIdx: q.idx >= 0 ? [...r.usedQIdx, q.idx] : r.usedQIdx,
      round: (r.round || 0) + 1,
      votes: {},
      hasVoted: [],
      roundWinner: null,
      timerStart: Date.now(),
    };
    await writeRoom(newRoom);
    setRoom(newRoom); setMyVote(null);
    startTimer(newRoom.timerStart);
    setScreen('playing');
  }

  // ─── Cast Vote ───
  async function handleVote(targetId) {
    if (myVote) return; // already voted
    const code = roomCodeRef.current;
    const r = await readRoom(code);
    if (!r || r.status !== 'playing') return;
    if (r.hasVoted.includes(myId)) return;

    setMyVote(targetId);

    const votes = { ...r.votes };
    if (!votes[targetId]) votes[targetId] = [];
    if (!votes[targetId].includes(myId)) votes[targetId] = [...votes[targetId], myId];

    const hasVoted = [...r.hasVoted, myId];
    const updated = { ...r, votes, hasVoted };

    // Check if all voted → auto end round
    const activePlayers = r.players.length;
    if (hasVoted.length >= activePlayers) {
      await endRound(updated);
    } else {
      await writeRoom(updated);
      setRoom(updated);
    }
  }

  // ─── End Round ───
  async function endRound(r) {
    const result = computeVoteResult(r.votes, r.players);
    const players = r.players.map(p => {
      let pts = 0; let xp = 0; let streakBonus = 0;
      // winner gets points per vote
      const voteCount = result.counts[p.id] || 0;
      if (p.id === result.winnerId) {
        pts = 10 * voteCount * r.comboMult;
        xp = pts;
        streakBonus = p.id === r.lastWinnerId ? (r.comboMult >= 3 ? 50 : 0) : 0;
      }
      // voters for winner get bonus
      const votedForWinner = (r.votes[result.winnerId] || []).includes(p.id);
      if (votedForWinner && p.id !== result.winnerId) { pts += 5 * r.comboMult; xp += 5; }
      pts += streakBonus;

      const newXp = (p.xp || 0) + xp;
      const lvl = p.level || 1;
      const newLvl = newXp >= lvl * 100 ? lvl + 1 : lvl;
      return {
        ...p,
        score: (p.score || 0) + pts,
        xp: newXp >= lvl * 100 ? newXp - lvl * 100 : newXp,
        level: newLvl,
        gems: (p.gems || 0) + Math.floor(pts / 5),
        streak: p.id === result.winnerId ? (p.streak || 0) + 1 : 0,
        votes_received: (p.votes_received || 0) + (result.counts[p.id] || 0),
      };
    });

    const comboMult = result.winnerId === r.lastWinnerId
      ? Math.min(4, (r.comboMult || 1) + 1)
      : 1;

    const updated = {
      ...r, players, status: 'roundEnd',
      roundWinner: { id: result.winnerId, name: result.winnerName, voteCount: result.voteCount, counts: result.counts },
      comboMult, comboOwner: result.winnerId,
      lastWinnerId: result.winnerId,
    };
    await writeRoom(updated);
    setRoom(updated);
    stopTimer();
    setScreen('roundEnd');
    setFlash(result.winnerName);
    setTimeout(() => setFlash(null), 2000);
  }

  // ─── Next Round (host) ───
  async function handleNextRound() {
    const code = roomCodeRef.current;
    const r = await readRoom(code);
    if (!r) return;
    const q = pickQuestion(r.category, r.usedQIdx);
    const newRoom = {
      ...r,
      status: 'playing',
      question: { text: q.text, rarity: q.rarity },
      usedQIdx: q.idx >= 0 ? [...r.usedQIdx, q.idx] : r.usedQIdx,
      round: (r.round || 0) + 1,
      votes: {}, hasVoted: [], roundWinner: null,
      timerStart: Date.now(),
    };
    await writeRoom(newRoom);
    setRoom(newRoom); setMyVote(null);
    startTimer(newRoom.timerStart);
    setScreen('playing');
  }

  // ─── End Game (host) ───
  async function handleEndGame() {
    const code = roomCodeRef.current;
    const r = await readRoom(code);
    if (!r) return;
    await writeRoom({ ...r, status: 'finished' });
    setRoom({ ...r, status: 'finished' });
    stopTimer();
    setScreen('finished');
  }

  // ─── Change Category (host) ───
  async function handleCatChange(cat) {
    const code = roomCodeRef.current;
    const r = await readRoom(code);
    if (!r) return;
    await writeRoom({ ...r, category: cat, usedQIdx: [] });
    setRoom(prev => ({ ...prev, category: cat, usedQIdx: [] }));
    setSelCat(cat);
    setShowCatModal(false);
    showToast(`✅ تغيرت الفئة: ${CATS[cat].emoji} ${CATS[cat].label}`, '#00ff87');
  }

  // ─── Copy invite ───
  async function handleCopyInvite() {
    const code = room?.code || roomCodeRef.current;
    const msg = `يلا نلعبو شكون أكثر؟! 🔥\nالكود: ${code}\n(افتح اللعبة واكتب الكود)`;
    try { await navigator.clipboard.writeText(msg); } catch { }
    setCopied(true);
    showToast('✅ تم النسخ! شارك مع الأصحاب 🔥', '#00ff87');
    setTimeout(() => setCopied(false), 3000);
  }

  // ─── Force end round (timer expired, host only) ───
  useEffect(() => {
    if (screen === 'playing' && timeLeft === 0 && isHost && room) {
      endRound(room);
    }
  }, [timeLeft, screen, isHost]);

  // ════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════
  const sorted = [...(room?.players || [])].sort((a,b) => (b.score||0) - (a.score||0));
  const medals = ['🥇','🥈','🥉'];

  // ── LANDING ──
  if (screen === 'landing') return (
    <div id="root">
      <div style={{textAlign:'center',padding:'2rem 0 1.5rem'}}>
        <div style={{fontSize:'3rem',marginBottom:'.5rem'}}>🎮</div>
        <div className="logo" style={{fontSize:'1.8rem',marginBottom:'.3rem'}}>شكون أكثر واحد؟</div>
        <div style={{color:'#555',fontSize:'.85rem'}}>العب مع الأصحاب عن بعد! 🔥</div>
      </div>

      <div className="card card-cyan" style={{marginBottom:'1rem'}}>
        <div className="section-title">اسمك في اللعبة</div>
        <input
          value={nameInput}
          onChange={e=>setNameInput(e.target.value)}
          placeholder="اكتب اسمك هنا..."
          onKeyDown={e=>e.key==='Enter'&&(!showJoin?handleCreate():handleJoin())}
          style={{marginBottom:'.8rem'}}
        />

        {!showJoin ? (
          <>
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? '⏳ جاري الإنشاء...' : '🏠 إنشاء غرفة جديدة'}
            </button>
            <button className="btn-ghost" onClick={()=>{setShowJoin(true);setError('');}}
              style={{width:'100%',fontWeight:700,padding:'.7rem'}}>
              🔑 انضم لغرفة موجودة
            </button>
          </>
        ) : (
          <>
            <input
              value={codeInput}
              onChange={e=>setCodeInput(e.target.value.toUpperCase())}
              placeholder="كود الغرفة (مثال: ABC12)"
              style={{marginBottom:'.8rem',letterSpacing:'.2em',fontSize:'1.1rem'}}
              onKeyDown={e=>e.key==='Enter'&&handleJoin()}
              maxLength={6}
            />
            <button className="btn-primary btn-purple" onClick={handleJoin} disabled={loading}>
              {loading ? '⏳ جاري الانضمام...' : '🚀 انضم للغرفة!'}
            </button>
            <button className="btn-ghost" onClick={()=>{setShowJoin(false);setError('');}}
              style={{width:'100%',fontWeight:700,padding:'.7rem'}}>
              ← رجوع
            </button>
          </>
        )}

        {error && <div style={{textAlign:'center',color:'#ff2d55',marginTop:'.5rem',fontWeight:700}}>{error}</div>}
      </div>

      <div className="card">
        <div className="section-title">🎯 كيفاش تلعب</div>
        {[
          ['1','👑','واحد يعمل غرفة ويشارك الكود للأصحاب'],
          ['2','📱','كل واحد يدخل الكود من تليفونو'],
          ['3','❓','تجيكم سؤال: "شكون أكثر واحد...؟"'],
          ['4','🗳️','كل واحد يصوت للشخص اللي يناسب السؤال'],
          ['5','🏆','اللي يتصوتلو أكثر يكسب نقاط!'],
        ].map(([n,e,t])=>(
          <div key={n} style={{display:'flex',alignItems:'center',gap:'.7rem',marginBottom:'.5rem'}}>
            <div style={{background:'rgba(0,245,255,.1)',border:'1px solid rgba(0,245,255,.2)',borderRadius:'50%',width:'28px',height:'28px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem',fontWeight:900,color:'#00f5ff',flexShrink:0}}>{n}</div>
            <span style={{fontSize:'.95rem'}}>{e} {t}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── WAITING ROOM ──
  if (screen === 'waiting') return (
    <div id="root">
      <div className="top-header">
        <div className="logo">🎮 غرفة الانتظار</div>
        <button className="btn-ghost" onClick={handleLeave} style={{padding:'.4rem .9rem',fontSize:'.8rem'}}>خروج ←</button>
      </div>

      <div className="code-display card-cyan">
        <div style={{fontSize:'.8rem',color:'#555',marginBottom:'.3rem'}}>كود الغرفة — شاركو مع الأصحاب</div>
        <div className="code-big">{room?.code}</div>
        <button onClick={handleCopyInvite} style={{marginTop:'.7rem',background: copied?'rgba(0,255,135,.15)':'rgba(0,245,255,.1)',border:`1px solid ${copied?'rgba(0,255,135,.4)':'rgba(0,245,255,.3)'}`,borderRadius:'3rem',padding:'.5rem 1.4rem',color: copied?'#00ff87':'#00f5ff',fontFamily:'Tajawal,sans-serif',fontWeight:700,fontSize:'.9rem',cursor:'pointer'}}>
          {copied ? '✅ تم النسخ!' : '📋 انسخ رابط الدعوة'}
        </button>
      </div>

      <div className="card">
        <div className="section-title">اللاعبون ({room?.players?.length || 0}/10)</div>
        {room?.players?.map(p => (
          <div className="waiting-player" key={p.id}>
            <span className={`player-dot ${true?'dot-online':'dot-offline'}`}></span>
            <span style={{flex:1,fontWeight:700}}>{p.name}</span>
            {p.id === room.hostId && <span className="host-crown">👑 أنا الكابتن</span>}
            {p.id === myId && p.id !== room.hostId && <span style={{fontSize:'.75rem',color:'#555'}}>أنت</span>}
          </div>
        ))}
        {(room?.players?.length || 0) < 2 && (
          <div style={{textAlign:'center',color:'#444',fontSize:'.85rem',padding:'.5rem'}}>⏳ في انتظار لاعب آخر...</div>
        )}
      </div>

      {isHost && (
        <div className="card">
          <div className="section-title">🗂️ اختر فئة البداية</div>
          <div className="cat-grid">
            {CAT_ORDER.map(c => {
              const cat = CATS[c];
              const active = (room?.category || 'friends') === c;
              return (
                <div key={c} className={`cat-btn ${active?'active':''}`}
                  onClick={async()=>{ const r=await readRoom(room.code);if(r){await writeRoom({...r,category:c});setRoom(prev=>({...prev,category:c}));} }}
                  style={{borderColor: active?cat.color+'80':'rgba(255,255,255,.08)',color:active?cat.color:'#aaa',background:active?cat.color+'15':'#12122a'}}>
                  <span className="ce">{cat.emoji}</span>
                  <span className="cl">{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isHost && (
        <button className="btn-primary btn-green" onClick={handleStart} disabled={(room?.players?.length||0)<2}
          style={{background:'linear-gradient(135deg,#00ff87,#00cc55)',color:'#000',boxShadow:'0 0 25px rgba(0,255,135,.5)'}}>
          {(room?.players?.length||0) < 2 ? '⏳ ننتظر لاعب آخر...' : `🚀 ابدأ اللعبة (${room?.players?.length} لاعبين)!`}
        </button>
      )}
      {!isHost && (
        <div style={{textAlign:'center',padding:'1rem',color:'#444',fontSize:'.9rem'}}>
          ⏳ ننتظر الكابتن يبدأ اللعبة...
        </div>
      )}
    </div>
  );

  // ── PLAYING ──
  if (screen === 'playing') {
    const q = room?.question;
    const cat = CATS[room?.category || 'friends'];
    const totalPlayers = room?.players?.length || 1;
    const votedCount = room?.hasVoted?.length || 0;
    const comboMult = room?.comboMult || 1;

    return (
      <div id="root">
        <div className="top-header">
          <div style={{background:cat.color+'20',border:`1px solid ${cat.color}40`,borderRadius:'2rem',padding:'.3rem .9rem',fontSize:'.9rem',fontWeight:700,color:cat.color}}>
            {cat.emoji} {cat.label}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
            <span style={{fontSize:'.75rem',color:'#444'}}>جولة {room?.round}</span>
            {comboMult > 1 && <span style={{background:'rgba(255,124,0,.2)',border:'1px solid rgba(255,124,0,.4)',borderRadius:'2rem',padding:'.1rem .6rem',fontSize:'.75rem',color:'#ff7c00',fontWeight:900}}>🔥×{comboMult}</span>}
          </div>
        </div>

        {/* Timer + vote count */}
        <div style={{display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'.8rem'}}>
          <div className="timer-ring">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#0d0d20" strokeWidth="4"/>
              <circle cx="28" cy="28" r="24" fill="none" stroke={timeLeft<=10?'#ff2d55':timeLeft<=20?'#ff7c00':'#00f5ff'}
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*24}`}
                strokeDashoffset={`${2*Math.PI*24*(1-timeLeft/VOTE_TIMER)}`}
                style={{transition:'stroke-dashoffset .5s,stroke .3s'}}/>
            </svg>
            <span className={`tn ${timeLeft<=10?'timer-danger':''}`}>{timeLeft}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'.72rem',color:'#444',marginBottom:'.3rem'}}>
              <span>صوتو 🗳️</span>
              <span>{votedCount}/{totalPlayers}</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{width:`${(votedCount/totalPlayers)*100}%`,background:'linear-gradient(90deg,#ff2d55,#ff7c00)'}}></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="q-box">
          <div>
            {q?.rarity === 'legendary' && <div style={{marginBottom:'.5rem'}}><span className="badge badge-legendary">👑 LEGENDARY</span></div>}
            <div className={`q-text ${q?.rarity==='legendary'?'text-gold':''}`}>{q?.text || '...'}</div>
          </div>
        </div>

        <div className="section-title">👇 صوت — شكون هو؟</div>
        <div className="vote-grid">
          {room?.players?.map(p => {
            const voteCount = (room.votes?.[p.id] || []).length;
            const pct = totalPlayers > 0 ? (voteCount / (totalPlayers-1)) * 100 : 0;
            const isMyVote = myVote === p.id;
            const iVoted = !!myVote;
            return (
              <button key={p.id} className={`vote-btn ${isMyVote?'voted':''}`}
                onClick={() => !iVoted && handleVote(p.id)}
                style={{background: cat.grad, opacity: iVoted&&!isMyVote?.6:1, cursor:iVoted?'default':'pointer'}}>
                <div className="vote-bar" style={{width:`${iVoted?pct:0}%`}}></div>
                <span style={{zIndex:1}}>{p.name} {p.id===room.hostId?'👑':''}</span>
                <span style={{zIndex:1,display:'flex',alignItems:'center',gap:'.4rem'}}>
                  {p.streak >= 3 && <span style={{background:'rgba(255,45,85,.3)',borderRadius:'2rem',padding:'.1rem .4rem',fontSize:'.7rem'}}>🔥{p.streak}</span>}
                  {iVoted && <span style={{background:'rgba(0,0,0,.3)',borderRadius:'2rem',padding:'.1rem .5rem',fontSize:'.75rem'}}>{voteCount} 🗳️</span>}
                  {isMyVote && <span style={{color:'#00ff87',fontSize:'.9rem'}}>✓</span>}
                </span>
              </button>
            );
          })}
        </div>

        {isHost && (
          <div style={{display:'flex',gap:'.5rem',marginTop:'.5rem'}}>
            <button className="btn-ghost" onClick={()=>setShowCatModal(true)} style={{flex:1,padding:'.6rem'}}>
              🗂️ غير الفئة
            </button>
            <button className="btn-ghost" onClick={()=>endRound(room)} style={{flex:1,padding:'.6rem',color:'#ff7c00'}}>
              ⏭️ إنهاء الجولة
            </button>
          </div>
        )}
        {!me && <div style={{textAlign:'center',color:'#ff2d55',padding:'1rem'}}>⚠️ أنت مشاهد فقط</div>}
        {myVote && !isHost && <div style={{textAlign:'center',color:'#00ff87',padding:'.7rem',fontWeight:700}}>✅ صوتك وصل! ننتظر الباقين...</div>}

        {/* Category modal */}
        {showCatModal && (
          <div className="modal" onClick={e=>e.target===e.currentTarget&&setShowCatModal(false)}>
            <div className="modal-box">
              <div style={{fontWeight:900,marginBottom:'1rem',textAlign:'center'}}>🗂️ غير فئة الأسئلة</div>
              <div className="cat-grid">
                {CAT_ORDER.map(c => {
                  const cat = CATS[c];
                  return (
                    <div key={c} className="cat-btn" onClick={()=>handleCatChange(c)}
                      style={{borderColor:cat.color+'50',color:cat.color,background:cat.color+'10'}}>
                      <span className="ce">{cat.emoji}</span><span className="cl">{cat.label}</span>
                    </div>
                  );
                })}
              </div>
              <button className="btn-ghost" onClick={()=>setShowCatModal(false)} style={{width:'100%',marginTop:'.5rem'}}>إلغاء</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── ROUND END ──
  if (screen === 'roundEnd') {
    const winner = room?.roundWinner;
    const counts = winner?.counts || {};
    const maxVotes = Math.max(...Object.values(counts), 1);
    const cat = CATS[room?.category || 'friends'];

    return (
      <div id="root">
        <div className="top-header">
          <div className="logo">🏆 نتيجة الجولة {room?.round}</div>
          <div style={{fontSize:'.8rem',color:'#444'}}>كود: {room?.code}</div>
        </div>

        {winner?.winnerId ? (
          <div className="winner-card">
            <div style={{fontSize:'1rem',color:'#555',marginBottom:'.3rem'}}>🎯 أكثر واحد</div>
            <div style={{fontSize:'2rem'}}>🎉</div>
            <div style={{fontSize:'1.8rem',fontWeight:900,color:'#00ff87',marginBottom:'.3rem'}}>{winner.winnerName}</div>
            <div style={{fontSize:.85+'rem',color:'#aaa'}}>{winner.voteCount} صوت من {room?.players?.length}</div>
            {(room?.comboMult||1) > 1 && (
              <div style={{marginTop:'.5rem'}}>
                <span className="badge" style={{background:'rgba(255,124,0,.2)',border:'1px solid rgba(255,124,0,.4)',color:'#ff7c00'}}>🔥 COMBO ×{room.comboMult}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:'2rem',marginBottom:'.3rem'}}>😐</div>
            <div style={{fontWeight:700}}>ما صوت حتى كان...</div>
          </div>
        )}

        <div className="card">
          <div className="section-title">🗳️ تفصيل الأصوات</div>
          {room?.players?.map(p => {
            const v = counts[p.id] || 0;
            const pct = (v / maxVotes) * 100;
            return (
              <div key={p.id} className="results-row">
                <div style={{width:'5rem',fontWeight:700,fontSize:'.9rem'}}>{p.name}</div>
                <div className="vote-count-bar">
                  <div className="vote-count-fill" style={{width:`${pct}%`,background:p.id===winner?.winnerId?'linear-gradient(90deg,#00ff87,#00f5ff)':'linear-gradient(90deg,#ff2d55,#ff7c00)'}}></div>
                </div>
                <div style={{width:'2.5rem',textAlign:'right',fontWeight:900,fontSize:'.9rem',color:p.id===winner?.winnerId?'#00ff87':'#ff2d55'}}>{v} 🗳️</div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="section-title">📊 الترتيب المؤقت</div>
          {sorted.slice(0,5).map((p,i) => (
            <div key={p.id} className="player-row">
              <span className="lb-rank">{medals[i]||`#${i+1}`}</span>
              <span className="lb-name">{p.name}{p.id===myId&&' (أنت)'}</span>
              <span className="lb-score">{p.score}</span>
            </div>
          ))}
        </div>

        {isHost ? (
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="btn-primary" onClick={handleNextRound} style={{flex:2}}>🎮 الجولة التالية!</button>
            <button className="btn-ghost" onClick={()=>setShowCatModal(true)} style={{flex:1,padding:'.7rem'}}>🗂️ فئة</button>
            <button className="btn-ghost" onClick={handleEndGame} style={{flex:1,padding:'.7rem',color:'#ff2d55'}}>🏁 إنهاء</button>
          </div>
        ) : (
          <div style={{textAlign:'center',color:'#444',padding:'1rem',fontSize:'.9rem'}}>⏳ ننتظر الكابتن...</div>
        )}

        {showCatModal && (
          <div className="modal" onClick={e=>e.target===e.currentTarget&&setShowCatModal(false)}>
            <div className="modal-box">
              <div style={{fontWeight:900,marginBottom:'1rem',textAlign:'center'}}>🗂️ غير الفئة</div>
              <div className="cat-grid">
                {CAT_ORDER.map(c=>{
                  const cat=CATS[c];
                  return <div key={c} className="cat-btn" onClick={()=>{handleCatChange(c);setShowCatModal(false);}} style={{borderColor:cat.color+'50',color:cat.color,background:cat.color+'10'}}><span className="ce">{cat.emoji}</span><span className="cl">{cat.label}</span></div>;
                })}
              </div>
              <button className="btn-ghost" onClick={()=>setShowCatModal(false)} style={{width:'100%',marginTop:'.5rem'}}>إلغاء</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── FINISHED ──
  if (screen === 'finished') {
    const champ = sorted[0];
    return (
      <div id="root">
        <div style={{textAlign:'center',padding:'1.5rem 0 1rem'}}>
          <div style={{fontSize:'3rem',animation:'float 2s ease-in-out infinite'}}>🏆</div>
          <div className="logo" style={{fontSize:'1.6rem',marginTop:'.5rem'}}>انتهت اللعبة!</div>
        </div>

        {champ && (
          <div className="champ-banner">
            <div className="crown">👑</div>
            <div style={{fontSize:'1.5rem',fontWeight:900,color:'#ffd700'}}>{champ.name}</div>
            <div style={{color:'#aaa',fontSize:'.9rem',marginTop:'.3rem'}}>{champ.score} نقطة | مستوى {champ.level}</div>
            <div style={{marginTop:'.4rem',fontSize:'.8rem',background:'rgba(0,0,0,.3)',borderRadius:'2rem',padding:'.2rem .8rem',display:'inline-block',color:'#ffd700'}}>{getRank(champ.level)}</div>
          </div>
        )}

        <div className="card">
          <div className="section-title">🏆 الترتيب النهائي</div>
          {sorted.map((p,i) => {
            const xpPct = ((p.xp||0)/(p.level||1)/100)*100;
            return (
              <div key={p.id} style={{padding:'.7rem 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                <div className="flex-b" style={{marginBottom:'.3rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
                    <span style={{fontSize:'1.2rem',width:'2rem'}}>{medals[i]||`#${i+1}`}</span>
                    <div>
                      <div style={{fontWeight:900}}>{p.name}{p.id===myId&&' 👤'}</div>
                      <div style={{fontSize:'.7rem',color:'#555'}}>{getRank(p.level||1)}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="lb-score">{p.score}</div>
                    <div style={{fontSize:'.7rem',color:'#555'}}>💎 {p.gems||0} | 🎯 {p.votes_received||0} أصوات</div>
                  </div>
                </div>
                <div className="xp-track"><div className="xp-fill" style={{width:`${xpPct}%`}}></div></div>
              </div>
            );
          })}
        </div>

        <button className="btn-primary btn-gold" onClick={handleLeave} style={{color:'#000'}}>🏠 الرئيسية</button>
        {isHost && (
          <button className="btn-ghost" onClick={async()=>{
            const code=roomCodeRef.current;const r=await readRoom(code);
            if(r){const reset={...r,status:'waiting',round:0,votes:{},hasVoted:[],roundWinner:null,question:null,usedQIdx:[],comboMult:1,comboOwner:null,lastWinnerId:null,players:r.players.map(p=>({...p,score:0,xp:0,level:1,streak:0,gems:0,votes_received:0}))};await writeRoom(reset);setRoom(reset);setScreen('waiting');}
          }} style={{width:'100%',fontWeight:700,padding:'.7rem',marginTop:'.3rem'}}>
            🔄 جولة جديدة مع نفس الأصحاب
          </button>
        )}
      </div>
    );
  }

  return <div id="root"><div style={{padding:'2rem',textAlign:'center',color:'#555'}}>تحميل...</div></div>;
}
