import React from 'react';
import { Users, UserPlus } from 'lucide-react';

function TeamsList({ allTeamsCount, myTeamsCount, onNewTeam, searchQuery, onSearchChange, onGoToMyGroup }) {
  return (
    <div className="teams-sidebar">
      <button className="btn-new-team" onClick={onNewTeam}>
        <UserPlus size={16} />
        New team
      </button>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search teams"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="teams-list">
        <div className="team-item active">
          <Users size={18} />
          <span>All teams</span>
          <span className="team-count">{allTeamsCount}</span>
        </div>

        <div 
          className="team-item"
          onClick={onGoToMyGroup}
        >
          <Users size={18} />
          <span>My Group</span>
          <span className="team-count">{myTeamsCount}</span>
        </div>
      </div>
    </div>
  );
}

export default TeamsList;