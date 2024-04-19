import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import {useCookies} from 'react-cookie'

function App() {
  const [cookies, setCookie, removeCookie]=useCookies(null)
  const authToken=cookies.AuthToken
  const userEmail=cookies.Email
  const [tasks,setTasks]=useState([])

  const getData=async()=>{
      
      try{
        const res=await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail }`)
        const result=await res.json()
        setTasks(result)
      }catch(e){
        console.log(e)
      }
  }

  const sortedTasks=tasks?.sort((a,b)=>new Date(a.date)-new Date(b.date))

  useEffect(()=>{
    if(authToken){
      getData()
    }
  },[])

  

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&<>
        <ListHeader listName={'Holiday List'} getData={getData}/>
        <p className="user-email">Welcome back, {userEmail}</p>
        {sortedTasks?.map((task)=><ListItem key={task.id} task={task} getData={getData} />)}
      </>}
     
    </div>
  );
}

export default App;
