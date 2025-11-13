'use client'
import {useEffect,useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabase} from '../../lib/supabaseClient'
export default function L({children}){const r=useRouter();const[u,sU]=useState(null);const[p,sP]=useState(null);useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return r.push('/login');sU(user);const {data}=await supabase.from('profiles').select('*').eq('id',user.id).single();sP(data);})();},[]);if(!p)return 'loading';return(<div>{children}</div>) }