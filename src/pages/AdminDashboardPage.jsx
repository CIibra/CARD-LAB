import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import { supabase } from '../services/supabaseClient';
import AdminStats from '../components/admin/AdminStats';
import AdminCharts from '../components/admin/AdminCharts';
import AdminFilters from '../components/admin/AdminFilters';
import IssueModerationTable from '../components/admin/IssueModerationTable';
import SolutionValidationList from '../components/admin/SolutionValidationList';
import ResolutionConfirmList from '../components/admin/ResolutionConfirmList';
import ContactMessagesList from '../components/admin/ContactMessagesList';
import IssueDetailModal from '../components/citizen/IssueDetailModal';
import { COLORS } from '../theme';

export default function AdminDashboardPage() {
  const { user, profile, loading: authLoading, isAdmin } = useAuth();
  const { issues, updateIssueStatus, fetchAllSolutions, updateSolutionStatus } = useIssues();

  const [solutions, setSolutions] = useState([]);
  const [solutionsLoading, setSolutionsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [detailIssue, setDetailIssue] = useState(null);

  // Filtres du tableau de modération
  const [statusFilter, setStatusFilter] = useState('Toutes');
  const [categoryFilter, setCategoryFilter] = useState('Toutes');
  const [communeSearch, setCommuneSearch] = useState('');

  const loadSolutions = useCallback(async () => {
    setSolutionsLoading(true);
    const data = await fetchAllSolutions();
    setSolutions(data);
    setSolutionsLoading(false);
  }, [fetchAllSolutions]);

  const loadMessages = useCallback(async () => {
    setMessagesLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setMessages(data || []);
    setMessagesLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadSolutions();
      loadMessages();
    }
  }, [isAdmin, loadSolutions, loadMessages]);

  const filteredIssues = useMemo(() => issues.filter(i => {
    const matchStatus = statusFilter === 'Toutes' || i.status === statusFilter;
    const matchCategory = categoryFilter === 'Toutes' || i.category === categoryFilter;
    const matchCommune = communeSearch.trim() === '' || i.commune.toLowerCase().includes(communeSearch.trim().toLowerCase());
    return matchStatus && matchCategory && matchCommune;
  }), [issues, statusFilter, categoryFilter, communeSearch]);

  // --- Garde d'accès ---
  if (authLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: COLORS.slate }}>Chargement…</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '8px' }}>Espace réservé</h2>
        <p style={{ color: COLORS.slate, fontSize: '14px' }}>Connectez-vous pour accéder à cette page.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '8px' }}>Accès refusé</h2>
        <p style={{ color: COLORS.slate, fontSize: '14px' }}>
          Cet espace est réservé aux administrateurs du Mouvement Avenir Citoyen.
        </p>
      </div>
    );
  }

  const handleIssueStatusChange = async (issueId, status) => {
    const result = await updateIssueStatus(issueId, status);
    if (!result.success) alert("Erreur lors de la mise à jour : " + (result.error?.message || ''));
  };

  const handleSolutionValidate = async (solutionId, status) => {
    const solution = solutions.find(s => s.id === solutionId);
    const result = await updateSolutionStatus(solutionId, status, solution?.issue_id);
    if (!result.success) {
      alert("Erreur lors de la validation : " + (result.error?.message || ''));
      return;
    }
    setSolutions(prev => prev.map(s => (s.id === solutionId ? { ...s, status } : s)));
  };

  const handleConfirmResolution = async (issueId) => {
    const result = await updateIssueStatus(issueId, 'Résolu');
    if (!result.success) {
      alert("Erreur lors de la confirmation : " + (result.error?.message || ''));
      return;
    }
    setSolutions(prev => prev.map(s => (s.issue_id === issueId ? { ...s, issues: { ...s.issues, status: 'Résolu' } } : s)));
  };

  const handleReply = async (messageId, replyText) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ admin_reply: replyText, replied_at: new Date().toISOString(), status: 'Traité' })
      .eq('id', messageId);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }
    setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, admin_reply: replyText, status: 'Traité' } : m)));
  };

  const pendingSolutions = solutions.filter(s => s.status === 'proposé').length;
  const pendingResolutions = solutions.filter(s => s.status === 'terminé' && s.issues?.status !== 'Résolu').length;
  const newMessages = messages.filter(m => m.status !== 'Traité').length;

  const TABS = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'stats', label: 'Statistiques' },
    { id: 'issues', label: `Signalements (${issues.length})` },
    { id: 'solutions', label: `Solutions à valider (${pendingSolutions})` },
    { id: 'resolutions', label: `Résolutions à confirmer (${pendingResolutions})` },
    { id: 'messages', label: `Messages (${newMessages})` }
  ];

  return (
    <div style={{ padding: '20px 20px 48px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          Espace Administration MAC
        </h1>
        <p style={{ fontSize: '13px', color: COLORS.slate, margin: '4px 0 0' }}>
          Connecté en tant que {profile?.full_name} — gestion des signalements, solutions et messages reçus.
        </p>
      </div>

      <AdminStats issues={issues} solutions={solutions} />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.id ? `3px solid ${COLORS.green}` : '3px solid transparent',
              color: activeTab === tab.id ? COLORS.green : COLORS.slate,
              fontWeight: activeTab === tab.id ? '700' : '500',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Solutions en attente de validation</h3>
          {solutionsLoading ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Chargement…</p>
          ) : (
            <SolutionValidationList
              solutions={solutions.filter(s => s.status === 'proposé')}
              onValidate={handleSolutionValidate}
            />
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <AdminCharts issues={issues} />
      )}

      {activeTab === 'issues' && (
        <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>
            Tous les signalements ({filteredIssues.length} / {issues.length})
          </h3>
          <AdminFilters
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
            communeSearch={communeSearch} setCommuneSearch={setCommuneSearch}
          />
          <IssueModerationTable issues={filteredIssues} onStatusChange={handleIssueStatusChange} onSelectIssue={setDetailIssue} />
        </div>
      )}

      {activeTab === 'solutions' && (
        <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Toutes les propositions de solution</h3>
          {solutionsLoading ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Chargement…</p>
          ) : (
            <SolutionValidationList solutions={solutions} onValidate={handleSolutionValidate} />
          )}
        </div>
      )}

      {activeTab === 'resolutions' && (
        <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Travaux terminés à confirmer</h3>
          <p style={{ fontSize: '12px', color: COLORS.slate, marginBottom: '14px' }}>
            Le prestataire a signalé la fin des travaux depuis son profil. Confirme ici une fois vérifié pour
            passer le signalement en "Résolu".
          </p>
          {solutionsLoading ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Chargement…</p>
          ) : (
            <ResolutionConfirmList solutions={solutions} onConfirm={handleConfirmResolution} />
          )}
        </div>
      )}

      {activeTab === 'messages' && (
        <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Messages reçus via le formulaire de contact</h3>
          {messagesLoading ? (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Chargement…</p>
          ) : (
            <ContactMessagesList messages={messages} onReply={handleReply} />
          )}
        </div>
      )}

      <IssueDetailModal
        issue={detailIssue}
        onClose={() => setDetailIssue(null)}
        canSeeAddress={true}
        showPhone={true}
      />
    </div>
  );
}
