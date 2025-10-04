import { useState } from 'react';

export default function ToggleSwitch({ onToggle }) {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => {
    setIsOn(!isOn);
    if (onToggle) onToggle(!isOn); 
  };

  return (
    <button
      onClick={toggle}
      className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out 
        ${isOn ? 'bg-white' : 'bg-black'}`}
    >
      <div
        className={`w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out
            ${isOn ? 'bg-black' : 'bg-white'}
          ${isOn ? 'translate-x-7' : 'translate-x-0'}`}
      />
    </button>
  );
}
