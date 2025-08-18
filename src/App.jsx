import { useState } from 'react'
import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from "./ToggleSwitch";
import { runGemini } from './api';

import './App.css'

function App() {
  const responseRef = useRef(null);
  const [IsDark, setIsDark] = useState(false)
  const [Text, setText] = useState('');
  const [Click, setClick] = useState(false)
  const [ResponseText, setResponseText] = useState("");



  useEffect(() => {
    if (Click && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [Click]);


  return (
    <>
      <div className={` min-h-screen w-full flex flex-col justify-center items-center transition-all duration-500 ease-in-out
        ${IsDark ? 'bg-[#121212]' : 'bg-[#F5F5F5]'}
         `}>
        <div className='w-full h-[55px] fixed top-0 flex justify-between p-[10px]'>
          <FontAwesomeIcon icon={faBars} className={`text-4xl size-5 
          ${IsDark ? 'text-white' : 'text-black'}`} />
          <ToggleSwitch onToggle={(val) => setIsDark(val)} />
        </div>
        {Click && (
          <div
            ref={responseRef}
            className={`w-[1166px] min-h-[700px] mt-[60px] rounded-[57px] p-6 transition-all duration-500 ease-in-out
      ${IsDark ? 'bg-[#1E1E1E]' : 'bg-[#FFFFFF]'}`}
          >
            <p className={`${IsDark ? 'text-white' : 'text-black'}`}>
              {ResponseText
                ? <p className={`whitespace-pre-line leading-relaxed text-lg ${IsDark ? 'text-white' : 'text-black'}`}>
                  {ResponseText}
                </p>
                : <p className={`${IsDark ? 'text-white' : 'text-black'}`}>Loading...</p>}
            </p>
          </div>
        )}
        <div className={`w-[1166px] min-h-[70px] rounded-[25px] mt-6 mb-7 flex justify-between transition-all duration-500 ease-in-out
          ${IsDark ? 'bg-[#444444]' : 'bg-[#D9D9D9]'} 
          `}>
          <input type="text"
            placeholder='Ask anything..'
            className={`m-3 w-full text-lg outline-none`}
            value={Text}
            onChange={(e) => setText(e.target.value)} />
          {Text && (<button
            onClick={async () => {
              setClick(true);
              const output = await runGemini(Text);
              setResponseText(output);
              setText("")
            }}
          >
            <FontAwesomeIcon icon={faArrowRight}
              className={`text-4xl m-3 mt-4 mr-5 ${IsDark ? 'text-white' : 'text-black'}`}
            />
          </button>)}
        </div>
      </div>
    </>
  );
}

export default App
