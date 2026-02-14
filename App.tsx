
import React, { useState, useRef, useEffect } from 'react';
import { Message, Product, BotAction } from './types';
import { chatWithAssistant } from './services/geminiService';
import { ChatBubble } from './components/ChatBubble';
import { BUSINESS_INFO } from './constants';

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'স্বাগতম IT Gallery Shop-এ! আমি আপনাকে কীভাবে সাহায্য করতে পারি? আমাদের কাছে পাবেন সেরা মানের ব্যবহৃত ল্যাপটপ।',
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await chatWithAssistant(messages, text);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse.content,
        products: aiResponse.products,
        type: aiResponse.type as any
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'দুঃখিত, কোনো একটি সমস্যা হয়েছে। দয়া করে সরাসরি আমাদের কল দিন: ' + BUSINESS_INFO.phone
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: BotAction) => {
    switch (action) {
      case BotAction.SEARCH_BUDGET:
        handleSend("৫০ হাজার টাকার মধ্যে ভালো ব্যবহৃত ল্যাপটপ দেখান।");
        break;
      case BotAction.CHECK_EMI:
        handleSend("EMI সুবিধা সম্পর্কে জানতে চাই।");
        break;
      case BotAction.WARRANTY:
        handleSend("ওয়ারেন্টি এবং গ্যারান্টি পলিসি কী?");
        break;
      case BotAction.STORE_LOCATOR:
        handleSend("আপনাদের শোরুমের ঠিকানা কী?");
        break;
      case BotAction.COMPARE:
        if (comparisonList.length < 2) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'তুলনা করার জন্য অন্তত ২টি ল্যাপটপ সিলেক্ট করুন।'
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `আপনার পছন্দের ল্যাপটপগুলোর তুলনা:`,
            comparison: comparisonList,
            type: 'comparison'
          }]);
          setComparisonList([]);
        }
        break;
    }
  };

  const addToCompare = (product: Product) => {
    setComparisonList(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-[350px] sm:w-[400px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <header className="px-5 py-4 bg-black text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-[#FED700] rounded-lg flex items-center justify-center font-bold text-black shadow-inner">
                ITG
              </div>
              <div>
                <h1 className="font-bold text-sm leading-none">IT Gallery Assistant</h1>
                <p className="text-[10px] text-[#FED700] mt-1.5 flex items-center font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Active Now
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </header>

          {/* Messages Area */}
          <main 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar"
          >
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} message={msg} onCompare={addToCompare} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-400 text-[10px] ml-12 mb-4">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="font-medium">IT Gallery টাইপ করছে...</span>
              </div>
            )}
          </main>

          {/* Footer with Input */}
          <footer className="p-4 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
            <div className="flex space-x-2 overflow-x-auto pb-3 no-scrollbar mb-2">
              <button onClick={() => handleAction(BotAction.SEARCH_BUDGET)} className="whitespace-nowrap px-4 py-1.5 bg-gray-100 rounded-full text-[11px] font-bold text-gray-700 hover:bg-[#FED700] hover:text-black transition-all border border-gray-200">বাজেট ল্যাপটপ</button>
              <button onClick={() => handleAction(BotAction.WARRANTY)} className="whitespace-nowrap px-4 py-1.5 bg-gray-100 rounded-full text-[11px] font-bold text-gray-700 hover:bg-[#FED700] hover:text-black transition-all border border-gray-200">গ্যারান্টি পলিসি</button>
              <button onClick={() => handleAction(BotAction.STORE_LOCATOR)} className="whitespace-nowrap px-4 py-1.5 bg-gray-100 rounded-full text-[11px] font-bold text-gray-700 hover:bg-[#FED700] hover:text-black transition-all border border-gray-200">লোকেশন</button>
            </div>
            <div className="relative flex items-center">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="আপনার ল্যাপটপটি খুঁজুন..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-xs focus:ring-2 focus:ring-[#FED700]/50 outline-none transition-all"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-1.5 p-2 bg-[#FED700] text-black rounded-lg hover:bg-[#FFE552] disabled:opacity-50 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-black rotate-90' : 'bg-[#FED700]'
        }`}
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <div className="flex flex-col items-center">
             <img src="https://itgalleryshop.com/wp-content/uploads/2026/02/itg-logo-black.png" alt="ITG" className="w-10 h-10 object-contain" />
          </div>
        )}
      </button>
    </div>
  );
};

export default App;
