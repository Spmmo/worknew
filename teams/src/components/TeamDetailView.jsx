import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, Crown, Trash2, ArrowLeft, Users, FileX } from 'lucide-react';

function TeamDetailView({ team, onBack, onAddUser, onRemoveUser, onDeleteTeam, currentUserId }) {
  const [memberSearch, setMemberSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  if (!team) return null;

  const members = team.members || [];
  const isCreator = team.createdBy === currentUserId;

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUserName.trim() && newUserEmail.trim()) {
      onAddUser(team.id, newUserName.trim(), newUserEmail.trim());
      setNewUserName('');
      setNewUserEmail('');
      setShowAddUserModal(false);
    }
  };

  const handleDeleteTeam = () => {
    onDeleteTeam(team.id);
    setShowDeleteConfirm(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddUser();
    }
  };

  return (
    <div className="teams-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div>
            <button className="btn-back" onClick={onBack}>
              <ArrowLeft size={20} />
              Back to Teams
            </button>
            <h1>{team.name}</h1>
            <p className="page-subtitle">Manage team members and settings</p>
          </div>
          {isCreator && (
            <button 
              className="btn-delete-team-header"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete team"
              style={{ marginTop: '2rem' }}
            >
              <Trash2 size={18} />
              Delete Team
            </button>
          )}
        </div>
      </div>

      <div className="page-content-full">
        <div className="main-content-full">
          <div className="team-detail-header">
            <div className="team-icon-large-wrapper">
              <Users size={40} strokeWidth={2} />
            </div>
            <div className="team-info">
              <h2>{team.name}</h2>
              <p className="team-member-count">{members.length} {members.length === 1 ? 'member' : 'members'}</p>
            </div>
          </div>

          <div className="team-tabs">
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users: {members.length}
            </button>
            <button 
              className={`tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content: 0
            </button>
          </div>

          {activeTab === 'users' ? (
            <>
              <div className="team-search">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name or email"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>
                <button className="btn-add-users" onClick={() => setShowAddUserModal(true)}>
                  <UserPlus size={18} />
                  Add users
                </button>
              </div>

              {filteredMembers.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>
                  {memberSearch ? 'No members found' : 'No members yet. Click "Add users" to add members.'}
                </div>
              ) : (
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map(member => {
                      const isMemberCreator = member.userId === team.createdBy;
                      return (
                        <tr key={member.id}>
                          <td>
                            <div className="member-info">
                              <div className="avatar">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              {member.name}
                            </div>
                          </td>
                          <td>{member.email}</td>
                          <td>
                            {isMemberCreator && (
                              <span className="admin-badge" title="Team Creator">
                                <Crown size={14} />
                              </span>
                            )}
                          </td>
                          <td>
                            {!isMemberCreator && (
                              <div className="member-actions">
                                <button 
                                  className="btn-menu"
                                  onClick={() => setShowUserMenu(showUserMenu === member.id ? null : member.id)}
                                >
                                  <MoreVertical size={18} />
                                </button>
                                {showUserMenu === member.id && (
                                  <div className="user-menu">
                                    <button onClick={() => {
                                      onRemoveUser(team.id, member.id);
                                      setShowUserMenu(null);
                                    }}>
                                      <Trash2 size={16} />
                                      Remove from team
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '4rem 2rem',
              textAlign: 'center'
            }}>
              <div style={{ 
                marginBottom: '1.5rem',
                background: '#f3f4f6',
                borderRadius: '50%',
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileX size={60} strokeWidth={1.5} color="#9ca3af" />
              </div>
              
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 600, 
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                This team has no content yet
              </h3>
              
              <p style={{ 
                fontSize: '1rem', 
                color: '#6b7280',
                maxWidth: '500px'
              }}>
                This team is not directly subscribed to any board, doc, dashboard or workspace
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="new-team-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add User to Team</h3>
            <input
              type="text"
              placeholder="Enter user name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
            <input
              type="email"
              placeholder="Enter user email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAddUserModal(false)}>
                Cancel
              </button>
              <button className="btn-create" onClick={handleAddUser}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="new-team-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Team</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Are you sure you want to delete "{team.name}"? This action cannot be undone and all members will be removed.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn-delete" onClick={handleDeleteTeam}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamDetailView;