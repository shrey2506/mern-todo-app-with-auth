const PORT=process.env.PORT || 8000;
const express=require('express');
const cors=require('cors')
const {v4: uuid}=require('uuid')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const pool=require('./db')
const app=express();

app.use(cors())
app.use(express.json())

//get all todos
app.get("/todos/:userEmail", async(req,res)=>{
    const {userEmail}=req.params
    try{
        const todos=await pool.query('SELECT * from todos WHERE user_email=$1', [userEmail])
        res.json(todos.rows)
    }catch(e){
        console.log(e)
    }
})

//create todos
app.post("/todos", async(req,res)=>{
    const {user_email, title, progress, date} =req.body
    const id=uuid()
    try{
      const newTodo=await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`, 
      [id, user_email, title, progress, date])
      return res.json(newTodo)
    }catch(e){
        console.log(e)
    }
})

//edit todo
app.put("/todos/:id", async(req,res)=>{
    const {id}=req.params
    const {user_email, title, progress, date}=req.body
    console.log(user_email, title, progress, date, id)
    try{
      const updatedTodo=await pool.query(`UPDATE todos SET user_email=$1, title=$2, progress=$3, date=$4 WHERE id=$5`, [user_email, title, progress, date, id])
      return res.json(updatedTodo)
    }catch(e){
        console.log(e)
    }
})

//delete a todo
app.delete("/todos/:id", async(req,res)=>{
   const {id}=req.params;
   try{
      const deleteTodo=await pool.query(`DELETE from todos WHERE id=$1`,[id])
      return res.json(deleteTodo)
   }catch(e){
    console.log(e)
   }
})

//signup

app.post("/signup", async(req,res)=>{
    const {email, password}=req.body
    const salt=bcrypt.genSaltSync(10)
    const hashed_password=bcrypt.hashSync(password,salt)
    try{
        const createuser=await pool.query(`INSERT INTO users(email, hashed_password) VALUES($1, $2)`, 
      [email, hashed_password])
      const token=jwt.sign({email}, 'secret', {expiresIn: '1hr'})
      return res.json({email, token})
     }catch(e){
      console.log(e)
      if(e){
        return res.json({detail: e.detail})
      }
     }

})

app.post("/login", async(req,res)=>{
    const {email, password}=req.body
    try{
        const users=await pool.query(`SELECT * from users WHERE email=$1`,[email])
        if(!users.rows.length){
            return res.json({detail: 'User does not exist'})
        }
        const check=await bcrypt.compare(password,users.rows[0].hashed_password)
        const token=jwt.sign({email}, 'secret', {expiresIn: '1hr'})
        if(check){
            return res.json({'email': users.rows[0].email, token})
        }else{
            return res.json({detail: 'Login Failed! Please try again'})
        }
        return res.json(deleteTodo)
     }catch(e){
      console.log(e)
     }

})

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));