
import { useSendTransaction, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { sepolia } from 'viem/chains';
import { useEffect } from 'react';
import { storeSubscription } from '../lib/subscriptions';

interface PlanLimits {
  textexplanations: number;
  imageexplanations: number;
  chats: number;
  mindzone: boolean;
}

export interface PlanDetails {
  id: number;
  title: string;
  price: string;
  ethValue: string;
}

export interface SubscriptionPlan {
  id: number;
  title: string;
  emoji: string;
  color: string;
  borderColor: string;
  buttonColor: string;
  description: string;
  features: string[];
  price: string;
  ethValue: string;
  limits: PlanLimits;
}

export function useSubscriptionPayment(plan: PlanDetails | SubscriptionPlan) {
  const currentChainId = useChainId();

  const {
    data: txHash,
    sendTransaction,
    isPending,
    isSuccess,
    isError,
    error,
  } = useSendTransaction();

  const receiverAddress = import.meta.env.VITE_RECEIVER_ADDRESS as `0x${string}`;

  const initiatePayment = async (): Promise<boolean> => {
    if (currentChainId !== sepolia.id) {
      toast.error('Please switch to Sepolia network in your wallet...');
      return false;
    }
  
    try {
      toast.loading('Sending payment...');
      await sendTransaction({
        to: receiverAddress,
        value: parseEther(plan.ethValue),
      });
      return true;
    } catch (err) {
      toast.dismiss();
      toast.error('Payment failed or cancelled.');
      return false;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss();
      toast.success('Payment successful 🎉');

      storeSubscription({
        planId: plan.id,
        planTitle: plan.title,
        price: plan.price,
        ethValue: plan.ethValue,
      });
    }
  }, [isSuccess, plan]);

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
    transactionHash: txHash, 
  };
}
