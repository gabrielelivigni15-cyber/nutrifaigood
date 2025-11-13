'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabase} from '../../lib/supabaseClient'
export default function Login(){const r=useRouter();const[e,se]=useState('');const[p,sp]=useState('');const go=async(x)=>{x.preventDefault();await supabase.auth.signInWithPassword({email:e,password:p});r.push('/dashboard')};return(<form onSubmit={go}><input value={e} onChange={v=>se(v.target.value)}/><input type='password' value={p} onChange={v=>sp(v.target.value)}/><button>Login</button></form>) }