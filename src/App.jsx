import { useState } from 'react'
import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowRight, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from "./ToggleSwitch";
import { runGemini } from './api';
import './App.css'

function App() {
  const chatContainerRef = useRef(null);
  const [IsDark, setIsDark] = useState(false);
  const [Text, setText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [CopiedIndex, setCopiedIndex] = useState(null);
  const [HoveredIndex, setHoveredIndex] = useState(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, IsLoading]);

  const formatResponse = (text) => {
    if (!text) return text;

    const paragraphs = text.split('\n\n');

    return paragraphs.map((paragraph, index) => {
      if (paragraph.includes('```') || paragraph.includes('`')) {
        return (
          <div key={index} className="mb-4">
            <pre className={`p-4 rounded-lg overflow-x-auto text-sm ${IsDark ? 'bg-[#2D2D2D] text-green-400' : 'bg-gray-100 text-gray-800'
              }`}>
              <code>{paragraph.replace(/```/g, '').trim()}</code>
            </pre>
          </div>
        );
      }

      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className={`text-xl font-bold mb-3 ${IsDark ? 'text-blue-300' : 'text-blue-600'
            }`}>
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }

      if (paragraph.includes('•') || paragraph.includes('-') || /^\d+\./.test(paragraph.trim())) {
        const lines = paragraph.split('\n');
        return (
          <div key={index} className="mb-4">
            {lines.map((line, lineIndex) => (
              <div key={lineIndex} className={`mb-2 ${line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim())
                ? 'ml-4 flex items-start'
                : ''
                }`}>
                {line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim()) ? (
                  <>
                    <span className={`mr-2 ${IsDark ? 'text-yellow-400' : 'text-blue-500'}`}>
                      {(() => {
                        const trimmedLine = line.trim();
                        if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                          return trimmedLine.charAt(0);
                        } else {
                          const match = trimmedLine.match(/^\d+\./);
                          return match ? match[0] : trimmedLine.charAt(0);
                        }
                      })()}
                    </span>
                    <span>
                      {(() => {
                        const trimmedLine = line.trim();
                        if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                          return trimmedLine.substring(1).trim();
                        } else {
                          return trimmedLine.replace(/^\d+\.\s*/, '');
                        }
                      })()}
                    </span>
                  </>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            ))}
          </div>
        );
      }

      return (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Text.trim()) return;

    const userMessage = Text.trim();
    setText("");

    // Add user message to chat history
    setChatHistory(prev => [...prev, { type: 'user', text: userMessage, timestamp: new Date() }]);

    setIsLoading(true);

    try {
      const output = await runGemini(userMessage);
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { type: 'ai', text: output, timestamp: new Date() }]);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        text: "Sorry, there was an error processing your request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col transition-all duration-500 ease-in-out
      ${IsDark ? 'bg-[#121212]' : 'bg-[#F5F5F5]'}
    `}>
      {/* Header */}
      <div className='w-full h-[60px] flex justify-between items-center py-3 px-4 md:px-6 border-b border-opacity-20 border-gray-500'>
        <FontAwesomeIcon
          icon={faBars}
          className={`text-xl md:text-2xl cursor-pointer hover:opacity-70 transition-opacity
            ${IsDark ? 'text-white' : 'text-black'}
          `}
        />
        <h1 className={`text-lg md:text-xl font-semibold ${IsDark ? 'text-white' : 'text-black'}`}>
          AI Assistant
        </h1>
        <ToggleSwitch onToggle={(val) => setIsDark(val)} />
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 py-6"
      >
        <div className="max-w-4xl mx-auto">
          {chatHistory.length === 0 ? (
            <div className={`text-center mt-20 ${IsDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome to AI Assistant
              </h2>
              <p className="text-lg opacity-80">
                Ask me anything! I can help with coding, writing, explanations, and much more.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((message, index) => (
                <div key={index}>
                  {message.type === 'user' ? (
                    // User Message - Right aligned
                    <div className="flex justify-end mb-4">
                      <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${IsDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                        }`}>
                        <p className="text-base md:text-lg leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  ) : (
                    // AI Message - Full width with box
                    <div 
                      className="w-full mb-4"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Show "AI Assistant" label only for first AI message or after user message */}
                      {/* {(index === 0 || chatHistory[index - 1]?.type === 'user') && (
                        <div className={`text-sm font-semibold mb-2 ${IsDark ? 'text-blue-300' : 'text-blue-600'}`}>
                          AI Assistant
                        </div>
                      )} */}
                      
                      {/* Response Box */}
                      <div className={`relative inline-block max-w-[95%] min-w-[300px] rounded-xl px-6 py-4 transition-all ${IsDark
                        ? 'bg-[#1E1E1E]'
                        : 'bg-white'
                        }`}>
                        {/* Copy button - shows on hover */}
                        {HoveredIndex === index && (
                          <button
                            onClick={() => copyToClipboard(message.text, index)}
                            className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${IsDark
                              ? 'bg-gray-700 hover:bg-gray-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                          >
                            <FontAwesomeIcon 
                              icon={CopiedIndex === index ? faCheck : faCopy} 
                              className="text-xs" 
                            />
                            <span className="text-xs">{CopiedIndex === index ? 'Copied!' : 'Copy'}</span>
                          </button>
                        )}
                        
                        {/* Response Content */}
                        <div className={`text-sm md:text-base pr-20 ${IsDark ? 'text-gray-100' : 'text-gray-800'}`}>
                          {formatResponse(message.text)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {IsLoading && (
                <div className="w-full">
                  <div className={`text-sm font-semibold mb-2 ${IsDark ? 'text-blue-300' : 'text-blue-600'}`}>
                    AI Assistant
                  </div>
                  <div className={`w-full rounded-xl px-6 py-4 ${IsDark
                    ? 'bg-[#1E1E1E]'
                    : 'bg-white'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${IsDark ? 'border-blue-400' : 'border-blue-600'
                        }`}></div>
                      <span className={`text-sm ${IsDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Container - Fixed at bottom */}
      <div className={`w-full px-4 md:px-6 py-4`}>
        <div className="max-w-4xl mx-auto">
          <div className={`w-full rounded-2xl md:rounded-3xl transition-all duration-500 ease-in-out
            ${IsDark ? 'bg-[#444444]' : 'bg-[#D9D9D9]'}
          `}>
            <form onSubmit={handleSubmit} className="flex items-center p-2 md:p-3">
              <input
                type="text"
                placeholder='Ask anything...'
                className={`flex-1 bg-transparent text-base md:text-lg outline-none px-3 py-2 md:py-3
                  ${IsDark ? 'text-white placeholder-gray-300' : 'text-black placeholder-gray-600'}
                `}
                value={Text}
                onChange={(e) => setText(e.target.value)}
                disabled={IsLoading}
              />
              {Text.trim() && (
                <button
                  type="submit"
                  disabled={IsLoading}
                  className={`p-2 md:p-3 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50
                    ${IsDark
                      ? 'text-white hover:bg-gray-600'
                      : 'text-black hover:bg-gray-400'
                    }
                  `}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={`text-lg md:text-xl ${IsLoading ? 'animate-pulse' : ''}`}
                  />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App