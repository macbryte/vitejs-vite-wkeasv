import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { NetWorthEntry } from '../types/finance';

interface NetWorthChartProps {
  data: NetWorthEntry[];
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  return (
    <div className="w-full h-64 mt-8">
      <LineChart width={800} height={400} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalAssets" stroke="#82ca9d" name="Total Assets" />
        <Line type="monotone" dataKey="totalLiabilities" stroke="#ff7f7f" name="Total Liabilities" />
        <Line type="monotone" dataKey="netWorth" stroke="#8884d8" name="Net Worth" />
      </LineChart>
    </div>
  );
}