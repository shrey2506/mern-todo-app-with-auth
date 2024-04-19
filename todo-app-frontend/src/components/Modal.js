import React, { useState } from 'react'
import {useCookies} from 'react-cookie'

const Modal = ({mode, setShowModal, getData, task}) => {
  const [cookies, setCookie, removeCookie]=useCookies(null)
  const editMode=mode==='edit'? true: false
  const [data,setData]=useState({
    user_email: editMode ? task.user_email: cookies.Email,
    title: editMode ? task.title: '',
    progress:  editMode ? task.progress: 50,
    date: editMode ? task.date : new Date()
  })
 

  const handleChange=(e)=>{
    const {name,value}=e.target
    console.log(name,value)
    setData({
        ...data,
        [name]: value
    })
  }

  const postData=async(e)=>{
    e.preventDefault()
    try{
        const response=await fetch(`${process.env.REACT_APP_SERVERURL}/todos`,{
           method: 'POST',
           headers: {"content-type": "application/json"},
           body: JSON.stringify(data)
        })
        if(response.status===200){
            console.log("Worked")
            setShowModal(false)
            getData()
        }
       
    }catch(e){
        console.log(e)
    }
  }

  const editData=async(e)=>{
    e.preventDefault()
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`,{
        method: 'PUT',
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data)
     })
     if(response.status===200){
        console.log("Worked")
        setShowModal(false)
        getData()
    }
    }catch(e){
        console.log(e)
    }
  }

  console.log(data)
  return (
    <div className='overlay'>
        <div className='modal'>
            <div className='form-title-container'>
                <h2>{mode==='create'? 'Create': 'Edit'} task</h2>
                <button onClick={()=>setShowModal(false)}>X</button>
            </div>

            <form>
                <input 
                    required
                    maxLength={30}
                    placeholder='Enter task name'
                    name='title'
                    value={data.title}
                    onChange={handleChange}
                />
                <br />
                <label for='range'>Drag to select your current progress</label>
                <input 
                    id='range'
                    required
                    type='range'
                    min={0}
                    max={100}
                    name='progress'
                    value={data.progress}
                    onChange={handleChange}
                />
                <br />

                <input className={mode} type='submit' onClick={editMode? editData : postData}/>
            </form>
        </div>
    </div>
  )
}

export default Modal