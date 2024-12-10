// /Users/anand/Desktop/cerebro/frontend/pages/roles-permissions.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/UI/button';
import Input from '../components/UI/input';

type UserInfo = {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string; // summary of permissions
};

type RoleInfo = {
  id: number;
  role_name: string;
  permissions: { [ds: string]: string }; // datasource: "R" or "W"
};

type DatasourceCategory = {
  category: string;
  types: string[];
};

export default function RolesPermissionsConfig() {
  const router = useRouter();

  const [users, setUsers] = useState<UserInfo[]>([]);
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [datasourceCategories, setDatasourceCategories] = useState<DatasourceCategory[]>([]);

  // Invite user state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Analyst');

  // Create new role state
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDatasources, setNewRoleDatasources] = useState<{[ds: string]: string}>({});
  const [showCreateRole, setShowCreateRole] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const resUsers = await fetch('http://localhost:8000/api/roles-permissions/users');
    const userData = await resUsers.json();

    const resRoles = await fetch('http://localhost:8000/api/roles-permissions/roles');
    const roleData = await resRoles.json();

    const resDS = await fetch('http://localhost:8000/api/roles-permissions/datasources');
    const dsData = await resDS.json();

    setUsers(userData.users);
    setRoles(roleData.roles);
    setDatasourceCategories(dsData.datasourceCategories);
  }

  const handleInvite = async () => {
    const res = await fetch('http://localhost:8000/api/roles-permissions/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole
      })
    });
    if (res.ok) {
      const d = await res.json();
      setUsers(d.users);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('Analyst');
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    const res = await fetch('http://localhost:8000/api/roles-permissions/create-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        role_name: newRoleName,
        permissions: newRoleDatasources
      })
    });
    if (res.ok) {
      const d = await res.json();
      setRoles(d.roles);
      setNewRoleName('');
      setNewRoleDatasources({});
      setShowCreateRole(false);
    }
  };

  const handleDatasourcePermissionChange = (ds: string, permission: 'R'|'W') => {
    setNewRoleDatasources(prev => ({ ...prev, [ds]: permission }));
  };

  const handleNext = () => {
    // Updated to go to the workspace page instead of loading-workspace
    router.push('/workspace');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black space-y-8">
      <h1 className="text-2xl mb-4">Roles & Permissions</h1>

      {/* Users Table */}
      <div className="overflow-auto">
        <table className="border-collapse w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-200 text-left">
              <th className="p-2">UserID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.permissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite User Section */}
      <div className="border p-4 bg-white rounded">
        <h2 className="text-lg font-semibold mb-2">Invite New User</h2>
        <div className="flex flex-col space-y-2">
          <div>
            <span className="mr-2">Name (optional):</span>
            <Input value={inviteName} onChange={e => setInviteName(e.target.value)} />
          </div>
          <div>
            <span className="mr-2">Email (required):</span>
            <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
          </div>
          <div>
            <span className="mr-2">Role:</span>
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="border border-gray-300 rounded p-1">
              {roles.map(r => (
                <option key={r.id} value={r.role_name}>{r.role_name}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleInvite} className="bg-blue-600 text-white mt-2">Invite</Button>
        </div>
      </div>

      {/* Create New Role Section */}
      <div className="border p-4 bg-white rounded space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manage Roles</h2>
          <Button onClick={() => setShowCreateRole(!showCreateRole)} className="bg-green-600 text-white">
            {showCreateRole ? 'Cancel' : 'Create New Role'}
          </Button>
        </div>
        {showCreateRole && (
          <div className="space-y-4">
            <div>
              <span className="mr-2">Role Name:</span>
              <Input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} />
            </div>
            <div>
              <p className="font-semibold mb-2">Set Permissions for each Datasource:</p>
              {datasourceCategories.map((cat, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="font-medium">{cat.category}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cat.types.map(ds => (
                      <div key={ds} className="flex items-center space-x-2 border p-2 rounded bg-gray-100">
                        <span>{ds}</span>
                        <div className="flex items-center space-x-1">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name={`${ds}-permission`} onChange={() => handleDatasourcePermissionChange(ds, 'R')} checked={newRoleDatasources[ds] === 'R'} />
                            <span>R</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name={`${ds}-permission`} onChange={() => handleDatasourcePermissionChange(ds, 'W')} checked={newRoleDatasources[ds] === 'W'} />
                            <span>W</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleCreateRole} className="bg-blue-600 text-white">Create Role</Button>
          </div>
        )}
      </div>

      <Button onClick={handleNext} className="mt-4 bg-blue-600 text-white">Next</Button>
    </div>
  );
}