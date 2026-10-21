import {useEffect,useState} from 'react'
import {sb} from './supabase'
import Auth from './Auth'
import Dashboard from './Dashboard'
import Topics from './Topics'
import Quiz from './Quiz'

export default function App(){
  const [session,setSession]=useState(null),[ready,setReady]=useState(false)
  const [view,setView]=useState('dashboard'),[topic,setTopic]=useState(null)
  useEffect(()=>{
    sb.auth.getSession().then(({data})=>{setSession(data.session);setReady(true)})
    const {data}=sb.auth.onAuthStateChange((_e,s)=>setSession(s))
    return ()=>data.subscription.unsubscribe()
  },[])
  const go=(v,t=null)=>{setView(v);setTopic(t);window.scrollTo(0,0)}
  if(!ready)return null
  return(<>
    <div className="ban">Unofficial practice tool. Not affiliated with or endorsed by Microsoft.</div>
    {!session?<Auth/>:<>
      <header className="nav">
        <b>Smart Quiz Builder <span className="badge">Unofficial</span></b>
        <nav>
          <button className={view==='dashboard'?'on':''} onClick={()=>go('dashboard')}>Dashboard</button>
          <button className={view==='topics'?'on':''} onClick={()=>go('topics')}>Topics</button>
          <button onClick={()=>sb.auth.signOut()}>Sign out</button>
        </nav>
      </header>
      <main>
        {view==='dashboard'&&<Dashboard go={go}/>}
        {view==='topics'&&<Topics go={go}/>}
        {view==='quiz'&&<Quiz topic={topic} go={go}/>}
      </main></>}
    <footer>Unofficial student project with original questions. “Azure” is a trademark of Microsoft, used only to name the subject.</footer>
  </>)
}
