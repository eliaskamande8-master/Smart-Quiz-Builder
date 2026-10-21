import {useState} from 'react'
import {sb} from './supabase'

export default function Auth(){
  const [mode,setMode]=useState('in'),[email,setEmail]=useState(''),[pw,setPw]=useState('')
  const [msg,setMsg]=useState(''),[busy,setBusy]=useState(false)
  async function submit(e){
    e.preventDefault();setBusy(true);setMsg('')
    const {error}=mode==='in'?await sb.auth.signInWithPassword({email,password:pw}):await sb.auth.signUp({email,password:pw})
    setBusy(false)
    if(error)setMsg(error.message)
    else if(mode==='up')setMsg('Account created. If email confirmation is enabled, check your inbox, then sign in.')
  }
  return(
    <div className="auth">
      <div className="hero"><h1>Smart Quiz Builder</h1>
        <p>Practice Azure fundamentals concepts with original questions, instant explanations, and a dashboard that shows your strengths and weak spots.</p></div>
      <form className="card" onSubmit={submit}>
        <h2>{mode==='in'?'Welcome back':'Create your account'}</h2>
        <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></label>
        <label>Password<input type="password" required minLength={6} value={pw} onChange={e=>setPw(e.target.value)} autoComplete={mode==='in'?'current-password':'new-password'}/></label>
        {msg&&<p className="msg" role="alert">{msg}</p>}
        <button className="btn" disabled={busy}>{busy?'Please wait…':mode==='in'?'Sign in':'Sign up'}</button>
        <button type="button" className="link" onClick={()=>{setMode(mode==='in'?'up':'in');setMsg('')}}>
          {mode==='in'?'New here? Create an account':'Already registered? Sign in'}</button>
      </form>
    </div>)
}
