import React, { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';

function MyGroupView({ teams, onTeamClick, onBack }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="teams-page">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={onBack}>
            <ArrowLeft size={20} />
            Back to All Teams
          </button>
          <h1>My Group</h1>
          <p className="page-subtitle">Teams where you are a member</p>
        </div>
      </div>

      <div className="page-content-full">
        <div className="main-content-full">
          <div className="search-header">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-full"
            />
          </div>

          <table className="teams-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                    {searchQuery ? 'No teams found' : 'You are not a member of any team yet'}
                  </td>
                </tr>
              ) : (
                filteredTeams.map(team => (
                  <tr 
                    key={team.id} 
                    onClick={() => onTeamClick(team)} 
                    className="clickable-row"
                  >
                    <td>
                      <div className="team-name">
                        <div className="team-icon-wrapper">
                          <Users size={20} strokeWidth={2} />
                        </div>
                        {team.name}
                      </div>
                    </td>
                    <td>{team.memberCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyGroupView;