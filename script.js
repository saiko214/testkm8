const app=document.getElementById('app');
const L=['A','B','C','D','E'];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const parts=[[0,50],[50,100],[100,150]];
let S=null;

function home(){
  S=null;
  app.innerHTML=`<h1>C# ООП тест</h1><p class="sub">Емтиханға дайындық · ${Q.length} сұрақ</p>
  <button class="card mode" onclick="start('all')"><span class="ic">📚</span><b>Барлық сұраққа жауап беру</b><span>Барлық ${Q.length} сұрақ бір тестте</span></button>
  <button class="card mode" onclick="partsMenu()"><span class="ic">🧩</span><b>Бөліктер бойынша</b><span>3 бөлік: 50 + 50 + 50 сұрақ</span></button>
  <button class="card mode" onclick="start('rand')"><span class="ic">🎲</span><b>Кездейсоқ 50 сұрақ</b><span>Әр жолы жаңа сұрақтар жиынтығы</span></button>`;
}
function partsMenu(){
  app.innerHTML=`<div class="top"><button onclick="home()">← Артқа</button></div><h2>Бөлікті таңдаңыз</h2><p class="sub">Сұрақтар 3 бөлікке бөлінген</p>`+
  parts.map((p,i)=>`<button class="card mode" onclick="start('part',${i})"><span class="ic">${i+1}</span><b>${i+1}-бөлік</b><span>${Q[p[0]].n}–${Q[p[1]-1].n} сұрақтар (${p[1]-p[0]} сұрақ)</span></button>`).join('');
}
function start(m,i){
  let ids;
  if(m==='all')ids=Q.map((_,k)=>k);
  else if(m==='part')ids=Array.from({length:parts[i][1]-parts[i][0]},(_,k)=>parts[i][0]+k);
  else{ids=Q.map((_,k)=>k);for(let k=ids.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[ids[k],ids[j]]=[ids[j],ids[k]]}ids=ids.slice(0,50)}
  S={ids,ans:{},cur:0};quiz();scrollTo(0,0);
}
function quiz(){
  const n=S.ids.length,k=S.cur,q=Q[S.ids[k]],a=S.ans[k];
  const done=Object.keys(S.ans).length;
  app.innerHTML=`<div class="top"><button onclick="if(confirm('Тесттен шығасыз ба? Нәтиже сақталмайды.'))home()">✕ Шығу</button><span>${k+1} / ${n} · жауап: ${done}</span></div>
  <div class="bar"><i style="width:${done/n*100}%"></i></div>
  <div class="card"><div class="q">${k+1}. ${esc(q.q)}</div>${q.c?`<pre>${esc(q.c)}</pre>`:''}
  ${q.o.map((o,j)=>`<button class="opt ${a===j?'s':''}" onclick="pick(${j})"><span class="l">${L[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>
  <div class="row"><button class="btn g" ${k?'':'disabled'} onclick="go(-1)">← Алдыңғы</button>${k<n-1?`<button class="btn" onclick="go(1)">Келесі →</button>`:`<button class="btn" onclick="finish()">Аяқтау ✓</button>`}</div>
  <div class="nav">${S.ids.map((_,i)=>`<button class="${S.ans[i]!==undefined?'d':''} ${i===k?'c':''}" onclick="S.cur=${i};quiz()">${i+1}</button>`).join('')}</div>
  ${k<n-1?`<div class="row" style="margin-top:14px"><button class="btn g" onclick="finish()">Тестті аяқтау</button></div>`:''}`;
}
function pick(j){S.ans[S.cur]=j;quiz()}
function go(d){S.cur+=d;quiz();scrollTo(0,0)}
function finish(){
  const n=S.ids.length,done=Object.keys(S.ans).length;
  if(done<n&&!confirm(`Сіз ${n-done} сұраққа жауап берген жоқсыз. Аяқтайсыз ба?`))return;
  let ok=0;const bad=[];
  S.ids.forEach((id,k)=>{if(S.ans[k]===Q[id].a)ok++;else bad.push(k)});
  const p=Math.round(ok/n*100),col=p>=70?'var(--ok)':p>=50?'var(--pr)':'var(--er)';
  const msg=p>=90?'Тамаша нәтиже! 🎉':p>=70?'Жақсы нәтиже! 👍':p>=50?'Орташа, тағы дайындалыңыз 📖':'Қайталау қажет 💪';
  app.innerHTML=`<div class="card c"><h2>Тест нәтижесі</h2><div class="ring" style="--p:${p};--c:${col}"><div>${p}%</div></div>
  <p style="font-size:18px;margin:6px 0"><b>${n} сұрақтың ${ok}-ына</b> дұрыс жауап бердіңіз</p>
  <p class="sub" style="margin:0 0 6px">Дұрыс: ${p}% · Қате: ${100-p}%</p><p style="margin:0">${msg}</p></div>
  <div class="row"><button class="btn" onclick="home()">Басты мәзір</button></div>
  ${bad.length?`<h2 style="margin-top:24px">Қателескен сұрақтар (${bad.length})</h2>`+bad.map(k=>{
    const q=Q[S.ids[k]],u=S.ans[k];
    return `<div class="card"><span class="tag e">${u===undefined?'Жауап берілмеген':'Қате'}</span><div class="q">${q.n}. ${esc(q.q)}</div>${q.c?`<pre>${esc(q.c)}</pre>`:''}
    ${q.o.map((o,j)=>`<div class="opt ${j===q.a?'ok':j===u?'er':''}"><span class="l">${L[j]}</span><span>${esc(o)}</span></div>`).join('')}
    <div class="ans o">✓ Дұрыс жауап: ${L[q.a]}</div>${q.e?`<div class="ans" style="color:var(--mu)">💡 ${esc(q.e)}</div>`:''}${u!==undefined?`<div class="ans x">✗ Сіздің жауабыңыз: ${L[u]}</div>`:''}</div>`}).join(''):`<div class="card c"><b>Барлық жауап дұрыс! Қате жоқ 🏆</b></div>`}`;
  scrollTo(0,0);
}
home();
