'use client';

import { useEffect, useState } from 'react';

interface Tx {
  hash: string;
  to: string;
  from: string;
  value: string;
  timeStamp: string;
}

export default function Transactions({ address }: { address: string }) {
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const receiver = import.meta.env.VITE_RECEIVER_ADDRESS?.toLowerCase();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY}`
        );        
        
        const data = await response.json();

        if (!data || !data.result || !Array.isArray(data.result)) {
          throw new Error('Invalid response from Etherscan API');
        }

        const filtered = data.result.filter(
          (tx: Tx) => tx.to?.toLowerCase() === receiver
        );

        setTransactions(filtered);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  const getPlan = (ethValue: number) => {
    if (ethValue === 0.005000) return 'Weekly';
    if (ethValue === 0.008333) return 'Monthly';
    if (ethValue === 0.013333) return 'Yearly';
    return 'Custom';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (!address) {
    return (
      <div className="p-4 mt-6 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-xl shadow-md">
        <p>Please connect your wallet to view transactions.</p>
      </div>
    );
  }

  return (
    <div className="p-4 mt-6 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-white mb-4">Your Subscriptions</h2>

      {loading && <p className="text-sm text-zinc-400">Loading transactions...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && transactions.length === 0 && (
        <p className="text-sm text-zinc-400">No transactions found.</p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar">
          {transactions.map((tx) => {
            const ethValue = parseFloat(tx.value) / 1e18;
            return (
              <li
                key={tx.hash}
                className="list-none p-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-blue-600 transition duration-200"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">Plan:</span>
                  <span className="text-blue-400">{getPlan(ethValue)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">Price:</span>
                  <span>{ethValue.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">Date:</span>
                  <span>{formatDate(tx.timeStamp)}</span>
                </div>
               
              </li>
            );
          })}
        </div>
      )}
    </div>
  );
}
