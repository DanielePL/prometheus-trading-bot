
import React from 'react';

interface Trade {
  id: number;
  time: string;
  action: string;
  amount: number;
  price: number;
}

interface RecentTradesProps {
  trades: Trade[];
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ trades }) => {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold">Recent Trades</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {trades.length > 0 ? (
              trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.time}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                    {trade.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.amount} BTC</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${trade.price.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No trades yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
