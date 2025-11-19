import axios from 'axios';
import {createContext, useContext, useState, useEffect} from 'react'


const api = axios.create({
  baseURL: 'https://brainseekapi.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const Chatcontext = createContext()

export const ChatProvider = ({children})=> {

      const [titles, setTitles] = useState([])
      const [currentId, setCurrentId] = useState(null)


      useEffect(()=>{

           async function fetchChats(){


  
    try {
      const res = await api.get('/chat')
            setTitles([...res?.data])
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }
      fetchChats()


      
      },[])


  const createChat = async (title)=>{
    try {
      const res = await api.post('/chat', {
        title
      })



      setCurrentId(res?.data._id)
      

    } catch (error) {
      throw new Error(error.response?.data?.message || error.message)
    }
  }


  return (
    <Chatcontext.Provider value={{createChat,  titles, currentId }}>
      {children}
    </Chatcontext.Provider>
  )
}

export const useChat = ()=> useContext(Chatcontext)