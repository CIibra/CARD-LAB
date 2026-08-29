import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import BadgeStatus from '../components/common/BadgeStatus';
import PartnerProposalModal from '../components/partner/PartnerProposalModal';
import { useIssues } from '../context/IssueContext';

export default function PartnerDashboardPage() {
  const { issues } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '1000px', margin: '24px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Espace Partenaires & Experts</h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Consultez les besoins identifiés et proposez des solutions directes.</p>

        <div style={{ display: 'grid', gap: '16px' }}>
          {issues.map((issue) => (
            <div key={issue.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <BadgeStatus status={issue.status} />
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700' }}>📍 {issue.commune}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{issue.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{issue.description}</p>
              </div>

              <button
                className="btn-primary"
                onClick={() => setSelectedIssue(issue)}
              >
                Proposer une solution
              </button>
            </div>
          ))}
        </div>
      </main>

      <PartnerProposalModal
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onSuccess={() => alert('Proposition envoyée avec succès !')}
      />
    </div>
  );
}