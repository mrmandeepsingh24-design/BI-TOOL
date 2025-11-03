import React, { useState, useRef, useEffect } from 'react';
import { askAIAboutData } from '../services/api';
import { UserIcon } from '../components/Icons';
import { PharmaIQLogo } from '../components/Icons';

interface Message {
    sender: 'user' | 'ai';
    text: string;
    isError?: boolean;
}

const suggestedQuestions = [
    "Which medicines are low on stock?",
    "What is my top selling medicine?",
    "What is the total value of my inventory?",
    "Which items are completely out of stock?",
];

const AIChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm your AI Data Assistant. Ask me anything about your pharmacy data." }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (question: string) => {
        if (!question.trim()) return;

        setMessages(prev => [...prev, { sender: 'user', text: question }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await askAIAboutData(question);
            setMessages(prev => [...prev, { sender: 'ai', text: response.answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error and couldn't process your request. Please try again.", isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };

    const handleSuggestionClick = (question: string) => {
        handleSendMessage(question);
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-xl shadow-subtle border border-neutral-200/80">
            <header className="p-4 border-b border-neutral-200">
                <h1 className="text-xl font-bold text-neutral-800">AI Data Assistant</h1>
                <p className="text-sm text-neutral-500">Ask questions about your data in plain language.</p>
            </header>

            <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && (
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.isError ? 'bg-danger-500' : 'bg-primary-600'}`}>
                                <PharmaIQLogo className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                            msg.sender === 'user' 
                                ? 'bg-primary-600 text-white rounded-br-none' 
                                : msg.isError
                                ? 'bg-danger-50 text-danger-800 rounded-bl-none'
                                : 'bg-neutral-100 text-neutral-800 rounded-bl-none'
                        }`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                         {msg.sender === 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-primary-600" />
                            </div>
                        )}
                    </div>
                ))}
                
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                            <PharmaIQLogo className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-xs px-4 py-3 rounded-2xl bg-neutral-100 text-neutral-800 rounded-bl-none">
                           <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
                <div className="mb-3 flex flex-wrap gap-2">
                    {suggestedQuestions.map((q, i) => (
                         <button 
                            key={i} 
                            onClick={() => handleSuggestionClick(q)}
                            className="px-3 py-1 text-xs text-primary-700 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors"
                         >
                            {q}
                         </button>
                    ))}
                </div>
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your question here..."
                        className="flex-1 w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="Chat input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:bg-primary-300 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                       Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;