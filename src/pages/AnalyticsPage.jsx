import React, { useEffect, useState } from 'react';
import { usePaste } from '../context/PasteContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Eye, FileText, Activity, Code, Calendar } from 'lucide-react';

const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3', '#19B5FF'];

const AnalyticsPage = () => {
  const { fetchOverviewStats } = usePaste();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchOverviewStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setIsLoading(false);
      }
    };
    getStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto mt-12">
        <p>{error || 'Something went wrong.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Snippet Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Insights, viewing trends, and language distributions across your notes and snippets.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center space-x-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/60 rounded-lg text-purple-600 dark:text-purple-300">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Snippets</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPastes}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center space-x-4">
          <div className="p-3 bg-teal-100 dark:bg-teal-900/60 rounded-lg text-teal-600 dark:text-teal-300">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/60 rounded-lg text-blue-600 dark:text-blue-300">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Views</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalPastes > 0 ? (stats.totalViews / stats.totalPastes).toFixed(1) : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-purple-500" />
            Snippet Creation Trend (Last 7 Days)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.historyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: '#fff' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Breakdown Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Code className="mr-2 h-5 w-5 text-teal-500" />
            Language Distribution
          </h3>
          <div className="h-72 flex flex-col justify-between">
            {stats.languageData.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.languageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.languageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none', 
                          borderRadius: '8px', 
                          color: '#fff' 
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs mt-4">
                  {stats.languageData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center space-x-1.5">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No snippet data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
