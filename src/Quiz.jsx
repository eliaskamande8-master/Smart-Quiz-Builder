import {useEffect,useState} from 'react'
import {sb} from './supabase'
const L='ABCD'
const mix=a=>[...a].sort(()=>Math.random()-.5)

export default function Quiz({topic,go}){
  const [qs,setQs]=useState(null),[i,setI]=useState(0),[a,setA]=useState({}),[done,setDone]=useState(false),[err,setErr]=useState('')
  useEffect(()=>{sb.from('questions').select('*').eq('topic_id',topic.id).then(({data,error})=>error?setErr(error.message):setQs(mix(data)))},[topic.id])
  if(err)return <p className="msg">{err}</p>
  if(!qs)return <p className="mute">Loading questions…</p>
  if(!qs.length)return <p className="mute">No questions for this topic yet.</p>
  const score=qs.filter((q,k)=>a[k]===q.correct_index).length
  const pct=Math.round(score/qs.length*100)
  async function finish(){
    const {error}=await sb.from('attempts').insert({topic_id:topic.id,score,total:qs.length})
    if(error)setErr(error.message);else setDone(true)
  }
  const reset=()=>{setQs(mix(qs));setI(0);setA({});setDone(false)}

  if(done)return(<>
    <h1>Results: {topic.name}</h1>
    <div className="card"><div className="score">{score}/{qs.length}</div>
      <p className="mute">{pct}% correct. {pct>=75?'Strength: you are well prepared on this topic.':pct>=60?'Developing: review the explanations below and try again.':'Needs work: study the explanations below, then retry.'}</p>
      <div className="row"><button className="btn" onClick={reset}>Retry topic</button>
        <button className="btn alt" onClick={()=>go('dashboard')}>View dashboard</button>
        <button className="btn alt" onClick={()=>go('topics')}>Other topics</button></div></div>
    {qs.map((q,k)=>a[k]!==q.correct_index&&(
      <div className="card" key={q.id}><h3>{q.question_text}</h3>
        <p><b>Your answer:</b> {q.options[a[k]]}<br/><b>Correct answer:</b> {q.options[q.correct_index]}</p>
        <p className="why ok"><b>Why it is correct: </b>{q.explanation}</p>
        <p className="why bad"><b>What your choice is about: </b>{q.distractor_notes[a[k]]}</p></div>))}
  </>)

  const q=qs[i],sel=a[i],answered=sel!==undefined
  return(
    <div className="card">
      <div className="bar"><i style={{width:`${(i+1)/qs.length*100}%`}}/></div>
      <p className="mute">{topic.name} · Question {i+1} of {qs.length} · {q.difficulty}</p>
      <h2>{q.question_text}</h2>
      <ul className="opts">{q.options.map((o,k)=>{
        const c=!answered?'':k===q.correct_index?'ok':k===sel?'bad':''
        return(<li key={k}>
          <button className={'opt '+c} disabled={answered} onClick={()=>setA({...a,[i]:k})}>
            <span className="k">{c==='ok'?'✔':c==='bad'?'✘':L[k]}</span>{o}</button>
          {answered&&<p className={'why '+c}>{k===q.correct_index
            ?<><b>Why this is correct: </b>{q.explanation}</>
            :<><b>What this option is about: </b>{q.distractor_notes[k]}</>}</p>}
        </li>)})}</ul>
      {answered&&<p className={'st '+(sel===q.correct_index?'ok':'bad')}>{sel===q.correct_index?'✔ Correct':'✘ Incorrect. The correct answer is '+L[q.correct_index]}</p>}
      <div className="row">
        <button className="btn alt" disabled={i===0} onClick={()=>setI(i-1)}>Previous</button>
        {i<qs.length-1
          ?<button className="btn" disabled={!answered} onClick={()=>setI(i+1)}>Next</button>
          :<button className="btn" disabled={Object.keys(a).length<qs.length} onClick={finish}>Finish and see results</button>}
      </div>
    </div>)
}
