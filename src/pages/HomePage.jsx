import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import FilterBar from '../components/citizen/FilterBar';
import MapView from '../components/citizen/MapView';
import ReportModal from '../components/citizen/ReportModal';
import SolutionModal from '../components/citizen/SolutionModal';
import IssueDetailModal from '../components/citizen/IssueDetailModal';
import { REGIONS_CI, CI_CENTER_COORDS, ZOOM_PAYS, ZOOM_REGION } from '../data/regionsCI';
import { timeAgo } from '../utils/timeAgo';

// Un signalement Résolu ou Archivé sort de la vue publique (carte + urgences récentes)
// mais reste bien compté partout ailleurs (stats admin, tableau de modération, profil).
const HIDDEN_FROM_PUBLIC_VIEW = ['Résolu', 'Archivé'];

export default function HomePage() {
  const { user, isAdmin } = useAuth();
  const { issues, loading, fetchMyClearedIssueIds } = useIssues();

  const [clearedIssueIds, setClearedIssueIds] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchMyClearedIssueIds(user.id).then(setClearedIssueIds);
    } else {
      setClearedIssueIds(new Set());
    }
  }, [user, fetchMyClearedIssueIds]);

  // L'adresse précise (quartier) reste masquée tant que le MAC n'a pas validé
  // une solution pour ce signalement — sinon un prestataire n'a aucun besoin
  // de passer par le MAC pour intervenir directement.
  const canSeeAddress = useCallback((issue) => {
    if (isAdmin) return true;
    if (user && issue.user_id === user.id) return true;
    return clearedIssueIds.has(issue.id);
  }, [isAdmin, user, clearedIssueIds]);

  const [selectedRegion, setSelectedRegion] = useState('Toutes');
  const [selectedVille, setSelectedVille] = useState('Toutes');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  const [mapCenter, setMapCenter] = useState(CI_CENTER_COORDS);
  const [mapZoom, setMapZoom] = useState(ZOOM_PAYS);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [detailIssue, setDetailIssue] = useState(null);

  const handleRegionChangeEffect = (region) => {
    setSelectedRegion(region);
    if (region === 'Toutes') {
      setMapCenter(CI_CENTER_COORDS);
      setMapZoom(ZOOM_PAYS);
    } else if (REGIONS_CI[region]) {
      setMapCenter(REGIONS_CI[region].coords);
      setMapZoom(ZOOM_REGION);
    }
  };

  const activeIssues = useMemo(
    () => issues.filter(i => !HIDDEN_FROM_PUBLIC_VIEW.includes(i.status)),
    [issues]
  );

  const filteredIssues = useMemo(() => activeIssues.filter(i => {
    const matchVille = selectedVille === 'Toutes' || i.commune === selectedVille;
    const matchCat = selectedCategory === 'Toutes' || i.category === selectedCategory;
    const matchRegion = selectedRegion === 'Toutes' ||
      (REGIONS_CI[selectedRegion]?.villes || []).includes(i.commune);
    return matchRegion && matchVille && matchCat;
  }), [activeIssues, selectedRegion, selectedVille, selectedCategory]);

  const recentIssues = useMemo(
    () => [...activeIssues].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4),
    [activeIssues]
  );

  const openSolution = (issue) => {
    setSelectedIssue(issue);
    setIsSolutionOpen(true);
  };

  const handleCreated = (issue) => {
    if (issue) {
      setMapCenter([issue.latitude, issue.longitude]);
      setMapZoom(ZOOM_REGION);
    }
  };

  return (
    <div style={{ padding: '20px 20px 48px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="home-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        <div>
          <FilterBar
            selectedRegion={selectedRegion}
            setSelectedRegion={handleRegionChangeEffect}
            selectedVille={selectedVille}
            setSelectedVille={setSelectedVille}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onOpenReport={() => setIsReportOpen(true)}
          />
          <MapView
            issues={filteredIssues}
            center={mapCenter}
            zoom={mapZoom}
            onProposeSolution={openSolution}
            canSeeAddress={canSeeAddress}
          />
        </div>

        <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
            🔴 Urgences Récentes ({activeIssues.length} en cours)
          </h3>

          {loading && <p style={{ fontSize: '12px', color: '#94a3b8' }}>Chargement…</p>}
          {!loading && recentIssues.length === 0 && (
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Aucun signalement en cours pour le moment.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentIssues.map(issue => {
              const isNew = (Date.now() - new Date(issue.created_at).getTime()) < 86400000 * 2;
              return (
                <div
                  key={issue.id}
                  onClick={() => setDetailIssue(issue)}
                  style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', background: '#f8fafc', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>{issue.commune}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {isNew && <span style={{ background: '#22c55e', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px' }}>NOUVEAU</span>}
                    </div>
                  </div>

                  {issue.photos && issue.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
                      {issue.photos.map((url, i) => (
                        <img key={i} src={url} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                      ))}
                    </div>
                  )}

                  <h4 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 4px 0', color: '#1e293b' }}>{issue.title}</h4>
                  <p style={{
                    fontSize: '11px', color: '#64748b', margin: '0 0 8px 0', lineHeight: '1.3',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {issue.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: '#e2e8f0', color: '#12384a',
                      fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '10px'
                    }}>
                      🕒 {timeAgo(issue.created_at)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); openSolution(issue); }}
                    style={{ width: '100%', background: '#fff', border: '1px solid #12384a', color: '#12384a', padding: '5px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    💡 Proposer une solution
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} onCreated={handleCreated} />
      <SolutionModal isOpen={isSolutionOpen} onClose={() => setIsSolutionOpen(false)} issue={selectedIssue} />
      <IssueDetailModal
        issue={detailIssue}
        onClose={() => setDetailIssue(null)}
        onProposeSolution={openSolution}
        canSeeAddress={detailIssue ? canSeeAddress(detailIssue) : true}
      />
    </div>
  );
}
