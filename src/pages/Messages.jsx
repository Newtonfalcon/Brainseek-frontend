import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import { Menu, Copy, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import { useChat } from "../context/Chatcontext";
import { v4 as uuidv4 } from 'uuid';
const [thread_id] = useState(() => uuidv4()); // ✅ Only generate onceconst thread_id = uuidv4();

// ✅ Create axios instance with credentials
const api = axios.create({
  baseURL: 'https://brainseekapi.onrender.com/api',  
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function ChatPage() {
  const {createChat, currentId} = useChat()
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null); // ✅ Local state for chatId
  
  const chatEndRef = useRef(null);

  // ✅ Update chatId when currentId changes
  useEffect(() => {
    if (currentId) {
      setChatId(currentId);
    }
  }, [currentId]);

  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const copyText = (text) => navigator.clipboard.writeText(text);

 const sendMessage = async () => {
  if (!input.trim()) return;
  
  const userMsg = { role: "user", content: input };
  const newMessages = [...messages, userMsg];
  setMessages(newMessages);
  
  // Create chat first if needed
 let activeChatId = chatId || currentId;
if (!activeChatId && messages.length === 0) {
  const title = input.slice(0, 30) || "New Chat";
  activeChatId = await createChat(title); // ✅ Get ID immediately
  setChatId(activeChatId);
}
  
  setInput("");
  setLoading(true);

  try {
    const res = await api.post("/", {  
      prompt: input,
      thread_id
    });

    const assistantMsg = { role: "assistant", content: res.data || "⚠️ No response received." };
    const updatedMessages = [...newMessages, assistantMsg];
    setMessages(updatedMessages);

    // Save messages with the active chat ID
    if (activeChatId) {
      if (updatedMessages.length <= 2) {
        await api.post("/message", {
          messages: updatedMessages,
          thread_id,
          chatId: activeChatId
        });
      } else {
        await api.patch("/message", {
          messages: updatedMessages,
          thread_id,
          chatId: activeChatId
        });
      }
    }
  } catch (err) {
    console.error("API Error:", err);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: err.response?.data?.error || "❌ Internal server error." }
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-white text-black overflow-x-hidden">
      {/* HEADER */}
      <Navbar/>

      {/* CHAT BODY */}
      <main className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-3xl mx-auto pt-20 pb-36 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative rounded-2xl overflow-x-hidden px-4 py-3 max-w-[85%] md:max-w-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                  msg.role === "assistant"
                    ? "bg-white border border-gray-200 text-black"
                    : "bg-gray-100 text-black"
                }`}
              >
                <div className="break-words whitespace-pre-wrap overflow-hidden prose prose-sm max-w-none text-black [&_a]:break-all [&_code]:break-words [&_pre]:overflow-x-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyText(msg.content)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-5"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm text-gray-500 italic shadow-sm">
                BrainSeek is thinking…
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* FOOTER INPUT AREA */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-gray-50 border border-gray-300 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-400">
            <textarea
              className="flex-1 resize-none rounded-xl bg-transparent px-4 py-2 text-sm text-black focus:outline-none min-h-[48px] max-h-[200px]"
              placeholder="Message BrainSeek..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey
                  ? (e.preventDefault(), sendMessage())
                  : null
              }
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="p-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            BrainSeek may display educational resources and links.
          </p>
        </div>
      </footer>
    </div>
  );
}