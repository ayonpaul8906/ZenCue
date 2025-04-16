// components/ClientWrapper.tsx
'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { sepolia } from 'viem/chains';
import { ReactNode } from 'react';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider chain={sepolia}>
      {children}
    </OnchainKitProvider>
  );
}
