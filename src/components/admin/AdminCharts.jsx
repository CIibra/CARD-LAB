import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CATEGORIES, STATUS_LABELS } from '../../data/regionsCI';
import { COLORS } from '../../theme';

const PIE_COLORS = ['#0e7a4f', '#f2994a', '#4a9db0', '#64748b', '#8b5cf6', '#f97316', '#22c55e', '#94a3b8'];

export default function AdminCharts({ issues }) {
  const byCategory = useMemo(() => {
    return CATEGORIES.map(c => ({
      name: c.label,
      total: issues.filter(i => i.category === c.value).length
    })).filter(d => d.total > 0);
  }, [issues]);

  const byStatus = useMemo(() => {
    return Object.keys(STATUS_LABELS).map(status => ({
      name: STATUS_LABELS[status].label,
      value: issues.filter(i => i.status === status).length
    })).filter(d => d.value > 0);
  }, [issues]);

  const byCommune = useMemo(() => {
    const counts = {};
    issues.forEach(i => { counts[i.commune] = (counts[i.commune] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [issues]);

  if (issues.length === 0) {
    return <p style={{ fontSize: '13px', color: '#94a3b8' }}>Pas encore de données à afficher.</p>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      <ChartCard title="Signalements par catégorie">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={byCategory} layout="vertical" margin={{ left: 10, right: 10 }}>
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="total" fill={COLORS.green} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Répartition par statut">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
              {byStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top communes concernées">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={byCommune} margin={{ left: -10 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="total" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '16px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>{title}</h4>
      {children}
    </div>
  );
}
