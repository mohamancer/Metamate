import React, { useEffect, useRef, useState } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

type Message = {
  role: string;
  content: string;
};

function Chatbot() {
  const [context, setContext] = useState<Message[]>([
    {
      role: 'system',
      content:
        'إحرص على أن تكون إجابتك تحت ال20 كلمة إذا استطعت، أما إذا أجبرت على قول المزيد فحافظ عليها تحت ال40 كلمة. أنت مساعد لطيف خبير في مجال الاعلانات والدعاية.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const mainElementRef = useRef<HTMLDivElement | null>(null);

  const send = async () => {
    if (inputValue.trim() !== '') {
      const newContext = [...context, { role: 'user', content: inputValue }];
      setContext(newContext);
      setInputValue('');
      setIsInputDisabled(true);
      try {
        const response =
          await window.electron.sendChatAndGetResponse(newContext);
        if (response !== null) {
          setContext([...newContext, { role: 'assistant', content: response }]);
        }
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error('Error sending chat and getting response:', error);
      }
      setIsInputDisabled(false);
    }
  };
  // Scroll to the bottom whenever the context changes
  useEffect(() => {
    if (mainElementRef.current) {
      mainElementRef.current.scrollTop = mainElementRef.current.scrollHeight;
    }
  }, [context]);

  return (
    <div className="h-96 w-96 p-4" id="outer">
      <div
        ref={mainElementRef}
        className="main h-96 overflow-y-auto overflow-x-hidden rounded-t-lg bg-[url('https://img.freepik.com/premium-vector/chatbot-icon-concept-chat-bot-chatterbot-robot-virtual-assistance-website_123447-1615.jpg?w=2000')] bg-cover bg-center bg-no-repeat opacity-70"
      >
        {context
          .filter((message) => message.role !== 'system')
          .map((message) => (
            <div
              dir="rtl"
              key={message.content.length}
              className={`${
                message.role === 'user'
                  ? 'ml-auto bg-[#bcf388]'
                  : 'mr-auto bg-[#fff]'
              }  z-10 mb-2 mr-1 mt-5 w-fit max-w-[75%] rounded-lg p-3 text-right text-black shadow-[2px_2px_10px_-6px_rgba(1,1,1,1)]`}
            >
              {message.content}
            </div>
          ))}
      </div>
      <div className="input-group flex items-center justify-center" dir="rtl">
        <input
          type="text"
          value={inputValue}
          className="form-control h-16 w-96 rounded-br-lg pr-3 text-black"
          id="inp_text"
          placeholder="اسألني أي شيء!"
          onKeyDown={(e) => e.key === 'Enter' && send()}
          disabled={isInputDisabled}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="input-group-append flex h-16 w-16 cursor-pointer items-center justify-center
                 rounded-bl-lg bg-gray-800 text-green-500 shadow-lg
                 transition-all duration-300 ease-linear hover:rounded-xl hover:bg-green-600 hover:text-white"
          onClick={send}
        >
          <FaTelegramPlane size={28} />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
