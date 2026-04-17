import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePollStore } from '../../store/pollStore';

export const ResultsChart = () => {
  const { results, options } = usePollStore();

  const data = options.map((opt) => ({
    name: opt,
    votes: results[opt] || 0
  })).sort((a, b) => b.votes - a.votes);

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <XAxis type="number" hide domain={[0, (dataMax) => Math.max(dataMax, 5)]} />
          <YAxis dataKey="name" type="category" width={150} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
          />
          <Bar dataKey="votes" minPointSize={8} radius={[0, 4, 4, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#colorGradient)`} />
            ))}
          </Bar>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
