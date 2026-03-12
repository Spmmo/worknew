import React, { useState } from 'react';
import { Trash2, Users } from 'lucide-react';
import TeamsList from './TeamsList';

function TeamsView({ teams, onTeamClick, onCreateTeam, onDeleteTeam, onGoToMyGroup, myTeamsCount, currentUserId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      onCreateTeam(newTeamName.trim());
      setNewTeamName('');
      setShowNewTeamModal(false);
    }
  };

  const handleDeleteTeam = (teamId) => {
    onDeleteTeam(teamId);
    setShowDeleteConfirm(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateTeam();
    }
  };

  return (
    <div className="teams-page">
      <div className="page-header">
        <div>
          <h1>Teams</h1>
          <p className="page-subtitle">Organize your account users into teams and assign them to content.</p>
        </div>
      </div>

      <div className="page-content">
        <TeamsList
          teams={filteredTeams}
          allTeamsCount={teams.length}
          myTeamsCount={myTeamsCount}
          onNewTeam={() => setShowNewTeamModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onGoToMyGroup={onGoToMyGroup}
        />

        <div className="main-content">
          <h2>All teams</h2>
          <table className="teams-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Members</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                    {searchQuery ? 'No teams found' : 'No teams yet. Click "New team" to create one.'}
                  </td>
                </tr>
              ) : (
                filteredTeams.map(team => (
                  <tr key={team.id}>
                    <td 
                      onClick={() => onTeamClick(team)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="team-name">
                        <div className="team-icon-wrapper">
                          <Users size={20} strokeWidth={2} />
                        </div>
                        {team.name}
                        {team.createdBy === currentUserId && (
                          <span className="creator-badge" title="Team Creator">
                          </span>
                        )}
                      </div>
                    </td>
                    <td 
                      onClick={() => onTeamClick(team)}
                      style={{ cursor: 'pointer' }}
                    >
                      {team.memberCount}
                    </td>
                    <td>
                      {team.createdBy === currentUserId && (
                        <button 
                          className="btn-delete-team"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(team.id);
                          }}
                          title="Delete team"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Team Modal */}
      {showNewTeamModal && (
        <div className="modal-overlay" onClick={() => setShowNewTeamModal(false)}>
          <div className="new-team-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Team</h3>
            <input
              type="text"
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowNewTeamModal(false)}>
                Cancel
              </button>
              <button className="btn-create" onClick={handleCreateTeam}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="new-team-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Team</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this team? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-delete" onClick={() => handleDeleteTeam(showDeleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamsView;