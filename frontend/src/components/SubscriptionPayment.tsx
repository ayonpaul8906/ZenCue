'use client';

import { useSendTransaction, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';
import { sepolia } from 'viem/chains';
import toast, { Toaster } from 'react-hot-toast';
import { Address } from 'viem';

const ethPriceInUsd = 3000;

export default function SubscriptionPayment() {
  const [selectedPlan, setSelectedPlan] = useState(15);
  const [isSent, setIsSent] = useState(false);
  const currentChainId = useChainId();

  const { data, sendTransaction, isPending, isSuccess, error, isError } = useSendTransaction();

  const ethValue = (selectedPlan / ethPriceInUsd).toFixed(6);

  const receiverAddress = import.meta.env.VITE_RECEIVER_ADDRESS as Address;

  const handleClick = () => {
    if (currentChainId !== sepolia.id) {
      toast('Please switch to Sepolia network in your wallet...', {
        icon: '⚠️',
        duration: 5000,
      });
      return;
    }

    toast.loading('Sending payment...');
    sendTransaction({
      to: receiverAddress,
      value: parseEther(ethValue),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss();
      toast.success('Payment successful 🎉');
      setIsSent(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error?.message.toLowerCase().includes('user rejected')) {
      toast.dismiss();
      toast('Payment cancelled by user ❌');
    }
  }, [isError, error]);

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg">
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'bg-zinc-800 text-white px-4 py-3 rounded-xl shadow-lg',
        }}
      />

      <h2 className="text-lg font-semibold text-white mb-2">Choose Your Plan</h2>

      <select
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(Number(e.target.value))}
        className="w-full mb-4 p-2 rounded-md bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
      >
        <option value={15}>Basic - $15/month</option>
        <option value={25}>Pro - $25/month</option>
        <option value={40}>Premium - $40/month</option>
      </select>

      <p className="mb-4 text-sm text-zinc-400">
        You'll be charged <span className="text-blue-400">{ethValue} Sepolia ETH</span> to activate the selected plan.
      </p>

      <button
        onClick={handleClick}
        disabled={isPending || isSent}
        className="w-full px-4 py-2 rounded-lg transition-all text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg"
      >
        {isPending ? 'Processing...' : isSuccess ? 'Paid!' : `Pay ${ethValue} ETH`}
      </button>

      {data?.hash && (
        <p className="mt-3 text-sm text-green-400">
          Transaction submitted.{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${data.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-300 transition"
          >
            View on SepoliaScan
          </a>
        </p>
      )}
    </div>
  );
}
