import { useState } from 'react'; export default function useMessages(){ const [messages,setMessages]=useState([]); return {messages,setMessages}; }
