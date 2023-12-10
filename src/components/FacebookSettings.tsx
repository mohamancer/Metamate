// FacebookSettings.tsx
import React, { useRef } from 'react';
import { FaUserSecret } from 'react-icons/fa';

type FacebookSettingsProps = {
  setFacebookData: (appId: string, secret: string, accessToken: string) => void;
  facebookAppID: string;
  setFacebookAppID: (appId: string) => void;
  facebookSecret: string;
  setFacebookSecret: (secret: string) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
};

function FacebookSettings({
  setFacebookData,
  facebookAppID,
  setFacebookAppID,
  facebookSecret,
  setFacebookSecret,
  accessToken,
  setAccessToken,
}: FacebookSettingsProps) {
  const facebookAppIDRef = useRef<HTMLInputElement>(null);
  const facebookSecretRef = useRef<HTMLInputElement>(null);
  const accessTokenRef = useRef<HTMLInputElement>(null);

  return (
    <div className="absolute bottom-24 ml-16 flex h-16 w-auto items-center">
      <div className="flex flex-col">
        <input
          ref={accessTokenRef}
          type="text"
          defaultValue={accessToken || ''}
          placeholder="Enter Access Token here"
          className="translate-all w-auto min-w-max scale-100 rounded-md bg-gray-900 p-2 text-sm font-bold text-white shadow-md"
        />
        <input
          ref={facebookAppIDRef}
          type="text"
          defaultValue={facebookAppID || ''}
          placeholder="Enter AppID here"
          className="translate-all w-auto min-w-max scale-100 rounded-md bg-gray-900 p-2 text-sm font-bold text-white shadow-md"
        />
        <input
          ref={facebookSecretRef}
          type="text"
          defaultValue={facebookSecret || ''}
          placeholder="Enter Secret here"
          className="translate-all mt-2 w-auto min-w-max scale-100 rounded-md bg-gray-900 p-2 text-sm font-bold text-white shadow-md"
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
            facebookSecretRef.current.value.trim() !== '' &&
            accessTokenRef.current &&
            accessTokenRef.current.value.trim() !== ''
          ) {
            setFacebookData(
              facebookAppIDRef.current.value,
              facebookSecretRef.current.value,
              accessTokenRef.current.value,
            );
            setFacebookAppID(facebookAppIDRef.current.value);
            setFacebookSecret(facebookSecretRef.current.value);
            setAccessToken(accessTokenRef.current.value);

            // toast.success('API key set successfully!');
          }
        }}
      >
        <FaUserSecret size="24" />
      </button>
    </div>
  );
}

export default FacebookSettings;
