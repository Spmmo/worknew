import React, { useState } from 'react';
import TeamsList from './components/TeamsList';
import TeamsView from './components/TeamsView';
import TeamDetailView from './components/TeamDetailView';
import MyGroupView from './components/MyGroupView';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', or 'mygroup'
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Current user (simulated)
  const currentUserId = 'user1';

  const [teams, setTeams] = useState([]);

  const handleCreateTeam = (teamName) => {
    const currentUserMember = {
      id: Date.now(),
      name: 'You',
      email: 'you@example.com',
      role: 'admin',
      userId: currentUserId
    };
    
    const newTeam = {
      id: Date.now(),
      name: teamName,
      memberCount: 1,
      createdBy: currentUserId,
      members: [currentUserMember]
    };
    setTeams([...teams, newTeam]);
  };

  const handleDeleteTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId));
    // If we're viewing the deleted team, go back to list
    if (selectedTeam?.id === teamId) {
      setCurrentView('list');
      setSelectedTeam(null);
    }
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTeam(null);
  };

  const handleGoToMyGroup = () => {
    setCurrentView('mygroup');
  };

  const handleBackFromMyGroup = () => {
    setCurrentView('list');
  };

  const handleAddUser = (teamId, userName, userEmail) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const newMember = {
          id: Date.now(),
          name: userName,
          email: userEmail,
          role: 'member',
          userId: `user${Date.now()}`
        };
        return {
          ...team,
          members: [...team.members, newMember],
          memberCount: team.memberCount + 1
        };
      }
      return team;
    }));

    // Update selected team if we're viewing it
    if (selectedTeam?.id === teamId) {
      const updatedTeam = teams.find(t => t.id === teamId);
      if (updatedTeam) {
        setSelectedTeam({
          ...updatedTeam,
          members: [...updatedTeam.members, {
            id: Date.now(),
            name: userName,
            email: userEmail,
            role: 'member',
            userId: `user${Date.now()}`
          }],
          memberCount: updatedTeam.memberCount + 1
        });
      }
    }
  };

  const handleRemoveUser = (teamId, userId) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.filter(m => m.id !== userId),
          memberCount: team.memberCount - 1
        };
      }
      return team;
    }));

    // Update selected team if we're viewing it
    if (selectedTeam?.id === teamId) {
      setSelectedTeam({
        ...selectedTeam,
        members: selectedTeam.members.filter(m => m.id !== userId),
        memberCount: selectedTeam.memberCount - 1
      });
    }
  };

  // Filter teams where current user is a member
  const myTeams = teams.filter(team => 
    team.members.some(member => member.userId === currentUserId)
  );

  return (
    <div className="app">
      {currentView === 'list' ? (
        <TeamsView
          teams={teams}
          onTeamClick={handleTeamClick}
          onCreateTeam={handleCreateTeam}
          onDeleteTeam={handleDeleteTeam}
          onGoToMyGroup={handleGoToMyGroup}
          myTeamsCount={myTeams.length}
          currentUserId={currentUserId}
        />
      ) : currentView === 'mygroup' ? (
        <MyGroupView
          teams={myTeams}
          onTeamClick={handleTeamClick}
          onBack={handleBackFromMyGroup}
        />
      ) : (
        <TeamDetailView
          team={selectedTeam}
          onBack={handleBackToList}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
          onDeleteTeam={handleDeleteTeam}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

export default App;