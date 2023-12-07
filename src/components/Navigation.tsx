import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaKey,
  FaBuysellads,
  FaHome,
  FaFacebook,
  FaUserSecret,
} from 'react-icons/fa';
import { MdPostAdd } from 'react-icons/md';
import { TbBrandOpenai } from 'react-icons/tb';

type Props = {
  icon: React.JSX.Element;
  text: string;
};
function SidebarIcon({ icon, text }: Props) {
  return (
    <div
      className="group relative mx-auto mb-2 mt-2 flex h-12 w-12 cursor-pointer items-center
                 justify-center rounded-3xl bg-gray-800 text-green-500
                 shadow-lg transition-all duration-300 ease-linear hover:rounded-xl hover:bg-green-600 hover:text-white"
    >
      {icon}
      <span className="shaow-md translate-all absolute left-14 m-2 w-auto min-w-max origin-left scale-0 rounded-md bg-gray-900 p-2 text-xs font-bold text-white duration-100 group-hover:scale-100">
        {text}
      </span>
    </div>
  );
}
function Navigation() {
  const [isOpenAi, setIsOpenAi] = useState(false);
  const [isFacebook, setIsFacebook] = useState(false);
  const [openAiKey, setOpenAiKey] = useState('');
  const [facebookAppID, setFacebookAppID] = useState('');
  const [facebookSecret, setFacebookSecret] = useState('');
  const facebookAppIDRef = useRef<HTMLInputElement>(null);
  const facebookSecretRef = useRef<HTMLInputElement>(null);
  const openAiRef = useRef<HTMLInputElement>(null);

  async function fetchData() {
    const [apiKey, appID, secret] = await window.electron.getData();
    if (apiKey) {
      setOpenAiKey(apiKey);
    }
    if (appID) {
      setFacebookAppID(appID);
    }
    if (secret) {
      setFacebookSecret(secret);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <nav
      className="left-0 top-0 m-0 flex h-screen
                 w-16 flex-col
                 bg-gray-900 text-white shadow"
    >
      <Link to="/" className="">
        <SidebarIcon icon={<FaHome size="32" />} text="الرئيسية" />
      </Link>
      <Link to="/Post" className="">
        <SidebarIcon icon={<MdPostAdd size="28" />} text="اضافة منشور" />
      </Link>
      <Link to="/Ads" className="">
        <SidebarIcon icon={<FaBuysellads size="28" />} text="اعلانات" />
      </Link>

      <div className="mt-auto">
        <button type="button" onClick={() => setIsFacebook(!isFacebook)}>
          <SidebarIcon
            icon={<FaFacebook size="28" />}
            text="Click to enter AppID key."
          />
        </button>
        <button type="button" onClick={() => setIsOpenAi(!isOpenAi)}>
          <SidebarIcon
            icon={<TbBrandOpenai size="28" />}
            text="Click to enter API key."
          />
        </button>
      </div>
      {isFacebook ? (
        <div className="absolute bottom-20 ml-16 flex h-16 w-auto items-center">
          <div className="flex flex-col">
            <input
              ref={facebookAppIDRef}
              type="text"
              defaultValue={facebookAppID || ''}
              placeholder="Enter AppID here"
              className="shaow-md translate-all w-auto min-w-max scale-100 rounded-md bg-gray-900 p-2 text-sm font-bold text-white"
            />
            <input
              ref={facebookSecretRef}
              type="text"
              defaultValue={facebookSecret || ''}
              placeholder="Enter Secret here"
              className="shaow-md translate-all mt-2 w-auto min-w-max scale-100 rounded-md bg-gray-900 p-2 text-sm font-bold text-white"
            />
          </div>
          <button
            type="button"
            className="ml-2 flex h-12 w-12 cursor-pointer  items-center justify-center
                 rounded-3xl border-white bg-gray-800 text-green-500
                 shadow-lg transition-all duration-300 ease-linear hover:rounded-xl hover:bg-green-600 hover:text-white"
            onClick={() => {
              if (
                facebookAppIDRef.current &&
                facebookAppIDRef.current.value.trim() !== '' &&
                facebookSecretRef.current &&
                facebookSecretRef.current.value.trim() !== ''
              ) {
                window.electron.setFacebookData(
                  facebookAppIDRef.current.value,
                  facebookSecretRef.current.value,
                );
                setFacebookAppID(facebookAppIDRef.current.value);
                setFacebookSecret(facebookSecretRef.current.value);
                console.log('here');
                // toast.success('API key set successfully!');
              }
            }}
          >
            <FaUserSecret size="24" />
          </button>
        </div>
      ) : null}
      {isOpenAi ? (
        <div className="absolute bottom-0 ml-16 flex h-16 w-auto items-center">
          <input
            ref={openAiRef}
            type="text"
            defaultValue={openAiKey || ''}
            placeholder="Enter API key here"
            className="shaow-md translate-all w-auto min-w-max scale-100 rounded-md bg-gray-900 p-2 text-sm font-bold text-white"
          />
          <button
            type="button"
            className="ml-2 flex h-12 w-12 cursor-pointer items-center justify-center
                 rounded-3xl border-white bg-gray-800 text-green-500
                 shadow-lg transition-all duration-300 ease-linear hover:rounded-xl hover:bg-green-600 hover:text-white"
            onClick={() => {
              if (openAiRef.current && openAiRef.current.value.trim() !== '') {
                window.electron.setOpenAiKey(openAiRef.current.value);
                setOpenAiKey(openAiRef.current.value);
                // toast.success('API key set successfully!');
              }
            }}
          >
            <FaKey size="24" />
          </button>
        </div>
      ) : null}
    </nav>
  );
}

export default Navigation;
