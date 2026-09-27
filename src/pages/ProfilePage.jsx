import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import { useProjects } from '../context/ProjectContext';
import { supabase } from '../services/supabaseClient';
import BadgeStatus from '../components/common/BadgeStatus';
import EditIssueModal from '../components/citizen/EditIssueModal';
import IssueDetailModal from '../components/citizen/IssueDetailModal';
import CompleteSolutionModal from '../components/citizen/CompleteSolutionModal';
import MyProjectCard from '../components/citizen/MyProjectCard';
import { CATEGORIES } from '../data/regionsCI';
import { timeAgo } from '../utils/timeAgo';
import { markProfilAsSeen } from '../hooks/useProfileNotifications';
import { COLORS } from '../theme';

const SOLUTION_STATUS_STYLE = {
  'proposé': { bg: COLORS.orangeLight, color: COLORS.orange, label: 'En attente de validation' },
  'accepté': { bg: COLORS.greenLight, color: COLORS.greenDark, label: 'Accepté' },
  'refusé': { bg: '#fee2e2', color: '#991b1b', label: 'Refusé' },
  'en_execution': { bg: COLORS.tealLight, color: COLORS.teal, label: 'Travaux en cours' },
  'terminé': { bg: '#e0e7ff', color: '#3730a3', label: 'Travaux terminés — en attente de confirmation' }
};

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { issues, fetchIssues, fetchAllSolutions, updateSolutionStatus, deleteIssue } = useIssues();
  const { projects } = useProjects();

  const [mySolutions, setMySolutions] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [activeTab, setActiveTab] = useState('signalements');
  const [updatingId, setUpdatingId] = useState(null);
  const [editingIssue, setEditingIssue] = useState(null);
  const [detailIssue, setDetailIssue] = useState(null);
  const [completingSolution, setCompletingSolution] = useState(null);

  // Marque le profil comme "vu" (éteint le point de notification) dès l'arrivée sur la page
  useEffect(() => {
    if (user) markProfilAsSeen(user.id);
  }, [user]);

  const loadExtra = useCallback(async () => {
    if (!user) return;
    setLoadingExtra(true);

    await fetchIssues(); // toujours à jour, plus besoin de quitter/relancer l'app
    const allSolutions = await fetchAllSolutions();
    setMySolutions(allSolutions.filter(s => s.provider_id === user.id));

    const { data: msgs } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setMyMessages(msgs || []);

    setLoadingExtra(false);
  }, [user, fetchIssues, fetchAllSolutions]);

  useEffect(() => { loadExtra(); }, [loadExtra]);

  if (authLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: COLORS.slate }}>Chargement…</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '8px' }}>Connexion requise</h2>
        <p style={{ color: COLORS.slate, fontSize: '14px' }}>Connecte-toi pour accéder à ton profil.</p>
      </div>
    );
  }

  const myIssues = issues.filter(i => i.user_id === user.id);
  const myProjects = projects.filter(p => p.user_id === user.id);

  const advanceSolution = async (solution, newStatus) => {
    setUpdatingId(solution.id);
    const result = await updateSolutionStatus(solution.id, newStatus);
    if (result.success) {
      setMySolutions(prev => prev.map(s => (s.id === solution.id ? { ...s, status: newStatus } : s)));
    } else {
      alert("Erreur : " + (result.error?.message || ''));
    }
    setUpdatingId(null);
  };

  const handleDelete = async (issue) => {
    if (!window.confirm(`Supprimer définitivement le signalement "${issue.title}" ?`)) return;
    const result = await deleteIssue(issue.id);
    if (!result.success) {
      alert("Erreur lors de la suppression : " + (result.error?.message || "Le signalement a peut-être déjà avancé et ne peut plus être supprimé."));
    }
  };

  const TABS = [
    { id: 'signalements', label: `Mes signalements (${myIssues.length})` },
    { id: 'solutions', label: `Mes propositions (${mySolutions.length})` },
    { id: 'projets', label: `Mes projets (${myProjects.length})` },
    { id: 'messages', label: `Mes messages (${myMessages.length})` }
  ];

  return (
    <div style={{ padding: '20px 20px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
          {profile?.full_name || 'Utilisateur'}
        </h1>
        <p style={{ fontSize: '13px', color: COLORS.slate, marginBottom: '12px' }}>{user.email}</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: COLORS.tealLight, color: COLORS.teal, fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '10px' }}>
            {roleLabel(profile?.role)}
          </span>
          {profile?.commune && (
            <span style={{ background: COLORS.slateLight, color: COLORS.slate, fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '10px' }}>
              {profile.commune}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 14px', border: 'none', background: 'none',
              borderBottom: activeTab === tab.id ? `3px solid ${COLORS.green}` : '3px solid transparent',
              color: activeTab === tab.id ? COLORS.green : COLORS.slate,
              fontWeight: activeTab === tab.id ? '700' : '500', fontSize: '13px', cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'signalements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myIssues.length === 0 && <EmptyState text="Vous n'avez pas encore signalé de problème." />}
          {myIssues.map(issue => {
            const canModify = issue.status === 'Nouveau';
            return (
              <div key={issue.id} onClick={() => setDetailIssue(issue)} style={{ ...cardStyle, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{issue.title}</div>
                    <div style={{ fontSize: '11px', color: COLORS.slate }}>
                      {CATEGORIES.find(c => c.value === issue.category)?.label} — {issue.commune}
                    </div>
                  </div>
                  <BadgeStatus status={issue.status} />
                </div>

                {issue.photos && issue.photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                    {issue.photos.map((url, i) => (
                      <img key={i} src={url} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canModify ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setEditingIssue(issue); }} style={actionBtnStyle}>
                          <Pencil size={13} /> Modifier
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(issue); }} style={{ ...actionBtnStyle, color: '#dc2626', borderColor: '#fecaca' }}>
                          <Trash2 size={13} /> Retirer
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>
                        Déjà pris en charge — modification impossible
                      </span>
                    )}
                  </div>

                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: COLORS.slateLight, color: COLORS.navy,
                    fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '10px'
                  }}>
                    <Clock size={12} /> {timeAgo(issue.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'solutions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loadingExtra && <p style={{ fontSize: '13px', color: '#94a3b8' }}>Chargement…</p>}
          {!loadingExtra && mySolutions.length === 0 && <EmptyState text="Vous n'avez pas encore proposé de solution." />}
          {mySolutions.map(sol => {
            const st = SOLUTION_STATUS_STYLE[sol.status] || SOLUTION_STATUS_STYLE['proposé'];
            const isUpdating = updatingId === sol.id;
            return (
              <div key={sol.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                    {sol.issues?.title || 'Signalement'}
                  </div>
                  <span style={{ background: st.bg, color: st.color, fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '10px', textAlign: 'right' }}>
                    {st.label}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', marginBottom: '10px' }}>{sol.solution_description}</p>

                {sol.status === 'accepté' && (
                  <button
                    onClick={() => advanceSolution(sol, 'en_execution')}
                    disabled={isUpdating}
                    style={{ background: COLORS.teal, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', opacity: isUpdating ? 0.7 : 1 }}
                  >
                    {isUpdating ? 'Mise à jour…' : 'Travaux commencés'}
                  </button>
                )}

                {sol.status === 'en_execution' && (
                  <button
                    onClick={() => setCompletingSolution(sol)}
                    style={{ background: COLORS.green, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Signaler la fin des travaux
                  </button>
                )}

                {sol.status === 'terminé' && (
                  <div>
                    {sol.completion_photos && sol.completion_photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                        {sol.completion_photos.map((url, i) => (
                          <img key={i} src={url} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: '11px', color: COLORS.slate, fontStyle: 'italic' }}>
                      En attente de confirmation par le MAC.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'projets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myProjects.length === 0 && <EmptyState text="Vous n'avez pas encore proposé de projet." />}
          {myProjects.map(project => <MyProjectCard key={project.id} project={project} />)}
        </div>
      )}

      {activeTab === 'messages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loadingExtra && <p style={{ fontSize: '13px', color: '#94a3b8' }}>Chargement…</p>}
          {!loadingExtra && myMessages.length === 0 && <EmptyState text="Vous n'avez envoyé aucun message au MAC." />}
          {myMessages.map(msg => (
            <div key={msg.id} style={cardStyle}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{msg.subject}</div>
              <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', marginBottom: msg.admin_reply ? '10px' : '0' }}>
                {msg.message}
              </p>
              {msg.admin_reply && (
                <div style={{ background: COLORS.greenLight, borderRadius: '8px', padding: '10px', marginTop: '8px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: COLORS.greenDark, marginBottom: '4px' }}>
                    RÉPONSE DU MAC
                  </div>
                  <p style={{ fontSize: '12px', color: COLORS.greenDark, lineHeight: '1.5' }}>{msg.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editingIssue && (
        <EditIssueModal
          issue={editingIssue}
          onClose={() => setEditingIssue(null)}
          onSaved={() => {}}
        />
      )}

      <IssueDetailModal issue={detailIssue} onClose={() => setDetailIssue(null)} />

      <CompleteSolutionModal
        solution={completingSolution}
        onClose={() => setCompletingSolution(null)}
        onCompleted={(photoUrls) => {
          setMySolutions(prev => prev.map(s => (
            s.id === completingSolution.id ? { ...s, status: 'terminé', completion_photos: photoUrls } : s
          )));
        }}
      />
    </div>
  );
}

function EmptyState({ text }) {
  return <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>{text}</p>;
}

function roleLabel(role) {
  const labels = {
    citoyen: 'Citoyen', expert: 'Expert', association: 'Association',
    ong: 'ONG', entreprise: 'Entreprise', collectivite: 'Collectivité', mac_admin: 'Administrateur MAC'
  };
  return labels[role] || 'Citoyen';
}

const cardStyle = { background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px' };
const actionBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '4px',
  background: '#fff', border: '1px solid #cbd5e1', color: '#334155',
  padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer'
};
