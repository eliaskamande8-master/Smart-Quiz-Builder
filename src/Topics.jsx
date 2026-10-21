import {useEffect,useState} from 'react'
import {sb} from './supabase'

export default function Topics({go}){
  const [t,setT]=useState(null),[err,setErr]=useState('')
  useEffect(()=>{sb.from('topics').select('*').order('id').then(({data,error})=>error?setErr(error.message):setT(data))},[])
  if(err)return <p className="msg">{err}</p>
  if(!t)return <p className="mute">Loading topics…</p>
  return(<>
    <h1>Choose a topic to revise</h1>
    <p className="mute">Pick one area and practise its questions. Your result feeds your dashboard.</p>
    <div className="grid">{t.map(x=>(
      <div className="card" key={x.id}><h2>{x.name}</h2><p className="mute">{x.description}</p>
        <button className="btn" onClick={()=>go('quiz',x)}>Start revision</button></div>))}</div>
  </>)
}
