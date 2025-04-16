'use client';

import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount, useDisconnect } from 'wagmi';
import { useEffect } from 'react';

export default function WalletInfo() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Path to local image in /public folder
  const localAvatar = '../../public/avatar.png';

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const walletEl = document.querySelector('[class*=connect-wallet]');
      if (!walletEl) return;

      const avatarImg = walletEl.querySelector('img');
      if (avatarImg) {
        (avatarImg as HTMLImageElement).src = localAvatar;
        (avatarImg as HTMLImageElement).style.objectFit = 'cover';
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 border border-zinc-700 p-5 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div className="cursor-pointer transition hover:scale-105 hover:drop-shadow-lg text-white">
          <ConnectWallet />
        </div>

        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="bg-red-600 hover:bg-red-500 transition px-3 py-1 text-sm rounded-md text-white shadow-md"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
