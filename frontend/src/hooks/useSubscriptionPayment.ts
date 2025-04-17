'use client'

import { useSendTransaction, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { sepolia } from 'viem/chains';
import { useEffect } from 'react';

const ethPriceInUsd = 3000;

export function useSubscriptionPayment(planUSD: number) {
  const currentChainId = useChainId();

  const {
    data,
    sendTransaction,
    isPending,
    isSuccess,
    isError,
    error,
  } = useSendTransaction();

  const ethValue = (planUSD / ethPriceInUsd).toFixed(6);
  const receiverAddress = import.meta.env.VITE_RECEIVER_ADDRESS;

  const initiatePayment = () => {
    if (currentChainId !== sepolia.id) {
      toast.error('Please switch to Sepolia network in your wallet...');
      return;
    }

    toast.loading('Sending payment...');
    sendTransaction({
      to: receiverAddress as `0x${string}`,
      value: parseEther(ethValue),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss();
      toast.success('Payment successful 🎉');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error?.message.toLowerCase().includes('user rejected')) {
      toast.dismiss();
      toast('Payment cancelled by user ❌');
    }
  }, [isError, error]);

  return {
    initiatePayment,
    isPending,
    isSuccess,
    transactionHash: data?.hash,
    ethValue,
  };
}
