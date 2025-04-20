// hooks/useSubscriptionPayment.ts
import { useSendTransaction, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { sepolia } from 'viem/chains';
import { useEffect } from 'react';
import { storeSubscription } from '../lib/subscriptions'; // Import the function

interface PlanDetails {
  id: number;
  title: string;
  price: string;
  ethValue: string;
}

export function useSubscriptionPayment(plan: PlanDetails) {
  const currentChainId = useChainId();

  const {
    data,
    sendTransaction,
    isPending,
    isSuccess,
    isError,
    error,
  } = useSendTransaction();

  const receiverAddress = import.meta.env.VITE_RECEIVER_ADDRESS as `0x${string}`;

  const initiatePayment = () => {
    if (currentChainId !== sepolia.id) {
      toast.error('Please switch to Sepolia network in your wallet...');
      return;
    }

    toast.loading('Sending payment...');
    sendTransaction({
      to: receiverAddress,
      value: parseEther(plan.ethValue),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss();
      toast.success('Payment successful 🎉');
      // Store subscription details in Firestore
      storeSubscription({
        planId: plan.id,
        planTitle: plan.title,
        price: plan.price,
        ethValue: plan.ethValue,
      });
    }
  }, [isSuccess, plan]); // Make sure to include 'plan' in the dependency array

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
  };
}