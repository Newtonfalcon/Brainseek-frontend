import { Menu, X, LogOut, MessageCircle } from 'lucide-react'
import {motion} from 'framer-motion'
import { useChat } from '../context/Chatcontext';
import { useAuth } from '../context/Authcontext';
import { useState } from 'react';




function Navbar() {
      const {titles} = useChat();



      const {user, logout} = useAuth();
      function shortUsername(name){
            if(!name) return "Us";
            if(name.length <=2) return name;
            return name.slice(0,2)
      }
      
      function handleLogout() {
            logout();
           
            window.location.href = '/login';

      }


      const [isOpen, setIsOpen] = useState(false);

      

  return (
      <>
       <header className="fixed  top-0 w-full bg-white/5 backdrop-blur-2xl z-30 flex items-center justify-between px-4 py-2 shadow-sm">
            <motion.button className="p-2 rounded-md hover:bg-gray-100" 
            onClick={() => setIsOpen(!isOpen)}
            animate={{ rotate: isOpen ? 90 : 0 }}
            >
             {!isOpen? <Menu size={22} />: <X size={22} />}
            </motion.button>
            <h1 className="text-lg text-slate-700 font-semibold tracking-tight">BrainSeek</h1>
            <div className='text-green-700'><a href="/message"> <MessageCircle size={24}/> </a></div>

            
          </header>
      {isOpen && <motion.div className='w-[80%] bg-gray-50 p-3 h-screen fixed top-12 left-0 z-20 shadow-lg '
            animate={{ x: 0 }}
            initial={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
            
            <ul className='mt-5 flex overflow-y-auto flex-col h-[90%] pb-10 '>
                  <div className='flex flex-row  gap-4 justify-between px-4   mb-7 text-gray-900 text-center items-center'
                   ><p className='animate-pulse text-white bg-black rounded-full p-2'>{shortUsername(user.name)}</p> <div/> <LogOut size={24} onClick={handleLogout} /></div>
                  {titles && titles.map((title, index) => (
                        <a key={index} className='flex flex-row text-gray-800 font-poppin font-bold py-2 px-3 bg-gray-100  rounded-md mb-2 text-sm hover:bg-gray-100 cursor-pointer'
                        href={`/chat/${title?._id}`}
                        >
                             {index + 1}. {title?.title}
                        
                        </a>
                  ))}
            </ul>
                  
            </motion.div>}
           
      </>
  )
}

export default Navbar