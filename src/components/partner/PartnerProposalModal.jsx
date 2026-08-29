import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function PartnerProposalModal({ issue, isOpen, onClose, onSuccess }) {
  const [description, setDescription] = useState('');
  const [resources, setResources] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !issue) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('issue_solutions').insert([
        {
          issue_id: issue.id,
          provider_id: user?.id || null,
          solution_description: description,
          resources_offered: resources,
          status: 'proposé'
        }
      ]);

      if (error) throw error;
      onSuccess?.();
      onClose();
    } catch (err) {
      alert("Erreur lors de l'envoi de la proposition : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>🤝 Proposer une solution / contribution</h2>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Problème : <strong>{issue.title}</strong></p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label>Description de la solution proposée</label>
            <textarea
              rows="3"
              required
              placeholder="Ex: Mise à disposition d'un camion d'enlèvement et d'une équipe de 5 bénévoles..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Moyens / Ressources mobilisés</label>
            <input
              type="text"
              placeholder="Ex: Matériel, financement, expertise technique..."
              value={resources}
              onChange={(e) => setResources(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Soumission...' : 'Envoyer la proposition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}