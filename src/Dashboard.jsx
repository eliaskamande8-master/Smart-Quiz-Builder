import {useEffect,useState} from 'react'
import {sb} from './supabase'

const status=p=>p===null?['Not started','idle']:p>=75?['Strength','ok']:p>=60?['Developing','mid']:['Needs work','bad']

export default function Dashboard({go}){
  const [d,setD]=useState(null),[err,setErr]=useState('')
  useEffect(()=>{
    Promise.all([sb.from('topics').select('*').order('id'),sb.from('attempts').select('*').order('created_at',{ascending:false})])
      .then(([t,a])=>t.error||a.error?setErr((t.error||a.error).message):setD({t:t.data,a:a.data}))
  },[])
  if(err)return <p className="msg">{err}</p>
  if(!d)return <p className="mute">Loading your dashboard…</p>
  const rows=d.t.map(t=>{
    const at=d.a.filter(x=>x.topic_id===t.id),s=at.reduce((n,x)=>n+x.score,0),n=at.reduce((n,x)=>n+x.total,0)
    return{...t,tries:at.length,pct:n?Math.round(s/n*100):null}
  })
  const tried=rows.filter(r=>r.pct!==null)
  const strong=tried.filter(r=>r.pct>=75),weak=tried.filter(r=>r.pct<60)
  const next=[...tried].sort((x,y)=>x.pct-y.pct)[0]||rows.find(r=>r.pct===null)||rows[0]
  const S=d.a.reduce((n,x)=>n+x.score,0),T=d.a.reduce((n,x)=>n+x.total,0)
  const name=id=>d.t.find(t=>t.id===id)?.name||'Topic'
  return(<>
    <h1>Your progress</h1>
    <div className="grid3">
      <div className="card stat"><span>{d.a.length}</span>Quizzes taken</div>
      <div className="card stat"><span>{T?Math.round(S/T*100)+'%':'–'}</span>Overall accuracy</div>
      <div className="card stat"><span>{strong.length}/{rows.length}</span>Topics mastered</div>
    </div>
    {next&&<div className="card focus"><div><h2>{tried.length?'Focus next on: ':'Start with: '}{next.name}</h2>
      <p>{tried.length?`Your accuracy here is ${next.pct}%. A short session will help most.`:'Take your first quiz to unlock strengths and weaknesses.'}</p></div>
      <button className="btn" onClick={()=>go('quiz',next)}>Revise now</button></div>}
    <div className="grid">
      <div className="card"><h2>Strengths</h2>{strong.length?strong.map(r=><p key={r.id}><span className="pill ok">✔</span> {r.name} ({r.pct}%)</p>):<p className="mute">No strengths yet. Reach 75% on a topic to earn one.</p>}</div>
      <div className="card"><h2>Weaknesses</h2>{weak.length?weak.map(r=><p key={r.id}><span className="pill bad">!</span> {r.name} ({r.pct}%)</p>):<p className="mute">{tried.length?'No weak topics. Keep practising.':'Take a quiz to find out.'}</p>}</div>
    </div>
    <div className="card"><h2>Topic mastery</h2>
      {rows.map(r=>{const [lbl,c]=status(r.pct);return(
        <div className="tb" key={r.id}>
          <div className="l"><span>{r.name}</span><span className={'pill '+c}>{lbl}{r.pct!==null&&` · ${r.pct}%`}</span></div>
          <div className="bar"><i className={c} style={{width:`${r.pct||0}%`}}/></div>
          <div className="l"><span className="mute">{r.tries} attempt{r.tries===1?'':'s'}</span><button className="link" onClick={()=>go('quiz',r)}>Revise</button></div>
        </div>)})}</div>
    {d.a.length>0&&<div className="card"><h2>Recent quizzes</h2>
      {d.a.slice(0,5).map(x=><p key={x.id} className="rowp"><span>{name(x.topic_id)}</span><span>{x.score}/{x.total} · {new Date(x.created_at).toLocaleDateString()}</span></p>)}</div>}
  </>)
}
