import { useState } from 'react'
import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowRight, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from "./ToggleSwitch";
import { runGemini } from './api';
import './App.css'

function App() {
  const responseRef = useRef(null);
  const [IsDark, setIsDark] = useState(false);
  const [Text, setText] = useState('');
  const [Click, setClick] = useState(false);
  const [ResponseText, setResponseText] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const [CopiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (Click && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [Click]);


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


  const copyToClipboard = () => {
    navigator.clipboard.writeText(ResponseText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Text.trim()) return;

    setClick(true);
    setIsLoading(true);
    setResponseText("");

    try {
      const output = await runGemini(Text);
      setResponseText(output);
    } catch (error) {
      setResponseText("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
      setText("");
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col transition-all duration-500 ease-in-out px-4 md:px-6 lg:px-8
      ${IsDark ? 'bg-[#121212]' : 'bg-[#F5F5F5]'}
    `}>
      <div className='w-full h-[60px] flex justify-between items-center py-3 px-2 md:px-4'>
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


      <div className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">


        {Click && (
          <div
            ref={responseRef}
            className={`w-full max-w-4xl min-h-[300px] md:min-h-[400px] lg:min-h-[500px] 
              rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 mb-6 transition-all duration-500 ease-in-out
              ${IsDark ? 'bg-[#1E1E1E] shadow-2xl' : 'bg-white shadow-xl'}
            `}
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-opacity-20 border-gray-500">
              <h2 className={`text-lg md:text-xl font-semibold ${IsDark ? 'text-blue-300' : 'text-blue-600'}`}>
                AI Response
              </h2>
              {ResponseText && !IsLoading && (
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors text-sm
                    ${IsDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }
                  `}
                >
                  <FontAwesomeIcon icon={CopiedText ? faCheck : faCopy} />
                  {CopiedText ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>

            <div className={`text-sm md:text-base lg:text-lg ${IsDark ? 'text-gray-100' : 'text-gray-800'}`}>
              {IsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${IsDark ? 'border-blue-400' : 'border-blue-600'
                    }`}></div>
                  <span className="ml-3 text-lg">Processing your request...</span>
                </div>
              ) : ResponseText ? (
                <div className="response-content">
                  {formatResponse(ResponseText)}
                </div>
              ) : (
                <p className="text-center py-8 opacity-70">
                  Waiting for response...
                </p>
              )}
            </div>
          </div>
        )}


        <div className={`w-full max-w-4xl rounded-2xl md:rounded-3xl transition-all duration-500 ease-in-out
          ${IsDark ? 'bg-[#444444]' : 'bg-[#D9D9D9]'}
          ${Click ? 'mb-8' : 'mb-16'}
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


        {!Click && (
          <div className={`text-center max-w-2xl mx-auto mb-8 ${IsDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Welcome to AI Assistant
            </h2>
            <p className="text-base md:text-lg opacity-80">
              Ask me anything! I can help with coding, writing, explanations, and much more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App