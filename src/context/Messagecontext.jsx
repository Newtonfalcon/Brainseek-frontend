import axios from 'axios';


const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const Messagecontext = createContext()

export const MessageProvider = ({children})=> {

      const [messages, setMessages] = useState([])

      const [chatId, setChatId] = useState(null)

      const addMessage = async (message, threadId)=>{
        setMessages((prev)=> [...prev, message])
        api.post(`/message/${chatId}`, {message, thread_id: threadId})


        try {
          
        } catch (error) {
          
        }
      }

    }


