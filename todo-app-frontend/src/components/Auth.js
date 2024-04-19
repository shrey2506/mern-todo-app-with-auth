import React, { useState } from 'react'
import {useCookies} from 'react-cookie'

const Auth = () => {
  const [cookies, setCookie, removeCookie]=useCookies(null)
  const [isLogin, setIsLogin]=useState(true)
  const [email, setEmail]=useState(null)
  const [password, setPassword]=useState(null)
  const [confirmPassword, setConfirmPassword]=useState(null)
  const [error,setError]=useState('')

  const viewLogin=(status)=>{
    setError('')
    setIsLogin(status)
  }

  console.log(cookies)

  const handleSubmit=async(e, endpoint)=>{
    e.preventDefault()
    if(!isLogin && password!==confirmPassword){
        setError('Make sure that the passwords match')
        return
    }

    const res=await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`,{
        method: 'POST',
        headers: {"content-type": "application/json"},
        body: JSON.stringify({email, password})
     })

     const data=await res.json()
     console.log(data)
     if(data.detail){
        setError(data.detail)
     }else{
        setCookie('Email', data.email)
        setCookie('AuthToken', data.token)
        window.location.reload()
     }
  }

  console.log(email, password, confirmPassword)
 
  return (
    <div className='auth-container'>
        <div className='auth-container-box'>
           <form>
              <h2>{isLogin? 'Please Login': 'Please Signup'}</h2>
              <input required type='email' placeholder='enter email' onChange={(e)=>setEmail(e.target.value)}/>
              <input required type='password' placeholder='enter password' onChange={(e)=>setPassword(e.target.value)}/>
              {!isLogin && <input required type='password' placeholder='confirm password' onChange={(e)=>setConfirmPassword(e.target.value)}/>}
              <input type='submit' className='create' onClick={(e)=>handleSubmit(e, isLogin ? 'login' : 'signup')} />
              {error && <p>{error}</p>}
           </form>
           <div className='auth-options'>
              <button onClick={()=>viewLogin(false)} style={{backgroundColor: !isLogin ? 'rgb(255,255,255)': 'rgb(188, 188, 188)'} }>Sign Up</button>
              <button onClick={()=>viewLogin(true)} style={{backgroundColor: isLogin ? 'rgb(255,255,255)': 'rgb(188, 188, 188)'} }>Login</button>
           </div>
        </div>
    </div>
  )
}

export default Auth