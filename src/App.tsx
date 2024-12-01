import { useState, useEffect } from 'react';
import { Asset, Liability, NetWorthEntry } from './types/finance';
import { AssetForm } from './components/AssetForm';
import { LiabilityForm } from './components/LiabilityForm';
import { NetWorthChart } from './components/NetWorthChart';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import * as db from './services/db';
import { testConnection } from './lib/supabase';

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [netWorthHistory, setNetWorthHistory] = useState<NetWorthEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test Supabase connection first
        const isConnected = await testConnection();
        setConnectionStatus(isConnected);

        if (isConnected) {
          const [loadedAssets, loadedLiabilities, loadedHistory] = await Promise.all([
            db.getAllAssets(),
            db.getAllLiabilities(),
            db.getAllHistory()
          ]);

          setAssets(loadedAssets);
          setLiabilities(loadedLiabilities);
          setNetWorthHistory(loadedHistory);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const calculateTotals = () => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
    const netWorth = totalAssets - totalLiabilities;
    return { totalAssets, totalLiabilities, netWorth };
  };

  const handleAddAsset = async (asset: Omit<Asset, 'created_at'>) => {
    try {
      const newAsset = await db.addAsset(asset);
      setAssets([newAsset, ...assets]);
      updateNetWorthHistory();
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  const handleAddLiability = async (liability: Omit<Liability, 'created_at'>) => {
    try {
      const newLiability = await db.addLiability(liability);
      setLiabilities([newLiability, ...liabilities]);
      updateNetWorthHistory();
    } catch (error) {
      console.error('Error adding liability:', error);
    }
  };

  const handleRemoveAsset = async (id: string) => {
    try {
      await db.removeAsset(id);
      setAssets(assets.filter(asset => asset.id !== id));
      updateNetWorthHistory();
    } catch (error) {
      console.error('Error removing asset:', error);
    }
  };

  const handleRemoveLiability = async (id: string) => {
    try {
      await db.removeLiability(id);
      setLiabilities(liabilities.filter(liability => liability.id !== id));
      updateNetWorthHistory();
    } catch (error) {
      console.error('Error removing liability:', error);
    }
  };

  const updateNetWorthHistory = async () => {
    const { totalAssets, totalLiabilities, netWorth } = calculateTotals();
    const newEntry = {
      date: format(new Date(), 'yyyy-MM-dd'),
      totalAssets,
      totalLiabilities,
      netWorth,
    };

    try {
      const savedEntry = await db.addHistoryEntry(newEntry);
      setNetWorthHistory([...netWorthHistory, savedEntry]);
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (connectionStatus === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
          <p className="text-gray-700">Unable to connect to Supabase. Please check your configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-center mb-8 text-indigo-900"
        >
          Net Worth Tracker
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">Add Asset</h2>
            <AssetForm onAddAsset={handleAddAsset} />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2 text-gray-700">Current Assets</h3>
              <AnimatePresence>
                {assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-center bg-green-50 p-3 rounded-md mb-2 hover:bg-green-100 transition-colors duration-200"
                  >
                    <span>{asset.description} ({asset.category})</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">${asset.value}</span>
                      <button 
                        onClick={() => handleRemoveAsset(asset.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">Add Liability</h2>
            <LiabilityForm onAddLiability={handleAddLiability} />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2 text-gray-700">Current Liabilities</h3>
              <AnimatePresence>
                {liabilities.map((liability) => (
                  <motion.div
                    key={liability.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-center bg-red-50 p-3 rounded-md mb-2 hover:bg-red-100 transition-colors duration-200"
                  >
                    <span>{liability.description} ({liability.category})</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">${liability.amount}</span>
                      <button 
                        onClick={() => handleRemoveLiability(liability.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold mb-4 text-indigo-800">Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-green-100 rounded-lg shadow transition-all duration-300"
            >
              <div className="text-lg font-medium text-green-800">Total Assets</div>
              <div className="text-2xl text-green-600">${calculateTotals().totalAssets}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-red-100 rounded-lg shadow transition-all duration-300"
            >
              <div className="text-lg font-medium text-red-800">Total Liabilities</div>
              <div className="text-2xl text-red-600">${calculateTotals().totalLiabilities}</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-blue-100 rounded-lg shadow transition-all duration-300"
            >
              <div className="text-lg font-medium text-blue-800">Net Worth</div>
              <div className="text-2xl text-blue-600">${calculateTotals().netWorth}</div>
            </motion.div>
          </div>
        </motion.div>

        {netWorthHistory.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">Net Worth History</h2>
            <NetWorthChart data={netWorthHistory} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;