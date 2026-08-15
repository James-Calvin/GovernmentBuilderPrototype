const governmentTemplates = {
  democracy: {
    name: 'The Commons Assembly',
    roles: [
      {
        id: 'leader',
        name: 'Leader',
        description: 'Represents the government externally.',
        permissions: {
          taxes: { request: true, vote: true, executive: true },
          policy: { request: true, vote: true, executive: true },
          territory: { request: true, vote: true, executive: true },
          recruit: { request: true, vote: true, executive: true },
        },
      },
      {
        id: 'member',
        name: 'Member',
        description: 'Can join debates and proposals.',
        permissions: {
          taxes: { request: false, vote: true, executive: false },
          policy: { request: true, vote: true, executive: false },
          territory: { request: false, vote: true, executive: false },
          recruit: { request: false, vote: false, executive: false },
        },
      },
      {
        id: 'council',
        name: 'Council',
        description: 'Coordinates governance decisions.',
        permissions: {
          taxes: { request: true, vote: true, executive: false },
          policy: { request: true, vote: true, executive: false },
          territory: { request: true, vote: true, executive: false },
          recruit: { request: true, vote: true, executive: false },
        },
      },
    ],
    actions: [
      { id: 'taxes', name: 'Taxes' },
      { id: 'policy', name: 'Create Policy' },
      { id: 'territory', name: 'Claim Territory' },
      { id: 'recruit', name: 'Recruit Members' },
    ],
    players: [
      { id: 'p1', name: 'Aster', roleIds: ['leader'] },
      { id: 'p2', name: 'Mira', roleIds: ['member'] },
      { id: 'p3', name: 'Orin', roleIds: ['council', 'member'] },
    ],
  },
  dictatorship: {
    name: 'The Directorate',
    roles: [
      {
        id: 'leader',
        name: 'Leader',
        description: 'Exercises executive authority.',
        permissions: {
          taxes: { request: true, vote: true, executive: true },
          policy: { request: true, vote: true, executive: true },
          territory: { request: true, vote: true, executive: true },
          recruit: { request: true, vote: true, executive: true },
        },
      },
      {
        id: 'adviser',
        name: 'Adviser',
        description: 'Can advise and shape policy.',
        permissions: {
          taxes: { request: true, vote: true, executive: false },
          policy: { request: true, vote: true, executive: false },
          territory: { request: false, vote: false, executive: false },
          recruit: { request: false, vote: false, executive: false },
        },
      },
      {
        id: 'member',
        name: 'Member',
        description: 'Limited participation.',
        permissions: {
          taxes: { request: false, vote: false, executive: false },
          policy: { request: false, vote: false, executive: false },
          territory: { request: false, vote: false, executive: false },
          recruit: { request: false, vote: false, executive: false },
        },
      },
    ],
    actions: [
      { id: 'taxes', name: 'Taxes' },
      { id: 'policy', name: 'Create Policy' },
      { id: 'territory', name: 'Claim Territory' },
      { id: 'recruit', name: 'Recruit Members' },
    ],
    players: [
      { id: 'p1', name: 'Aster', roleIds: ['leader'] },
      { id: 'p2', name: 'Bren', roleIds: ['adviser'] },
      { id: 'p3', name: 'Iris', roleIds: ['member'] },
    ],
  },
  anarchy: {
    name: 'The Unbound Commons',
    roles: [
      {
        id: 'member',
        name: 'Member',
        description: 'Open access to communal participation.',
        permissions: {
          taxes: { request: true, vote: true, executive: true },
          policy: { request: true, vote: true, executive: true },
          territory: { request: true, vote: true, executive: true },
          recruit: { request: true, vote: true, executive: true },
        },
      },
    ],
    actions: [
      { id: 'taxes', name: 'Taxes' },
      { id: 'policy', name: 'Create Policy' },
      { id: 'territory', name: 'Claim Territory' },
      { id: 'recruit', name: 'Recruit Members' },
    ],
    players: [
      { id: 'p1', name: 'Aster', roleIds: ['member'] },
      { id: 'p2', name: 'Nim', roleIds: ['member'] },
      { id: 'p3', name: 'Rosa', roleIds: ['member'] },
    ],
  },
  commune: {
    name: 'The Cooperative Circle',
    roles: [
      {
        id: 'member',
        name: 'Member',
        description: 'Shared access to labor and governance.',
        permissions: {
          taxes: { request: true, vote: true, executive: false },
          policy: { request: true, vote: true, executive: false },
          territory: { request: true, vote: true, executive: false },
          recruit: { request: true, vote: true, executive: false },
        },
      },
      {
        id: 'organizer',
        name: 'Organizer',
        description: 'Coordinates work and logistics.',
        permissions: {
          taxes: { request: true, vote: true, executive: true },
          policy: { request: true, vote: true, executive: true },
          territory: { request: true, vote: true, executive: true },
          recruit: { request: true, vote: true, executive: true },
        },
      },
    ],
    actions: [
      { id: 'taxes', name: 'Taxes' },
      { id: 'policy', name: 'Create Policy' },
      { id: 'territory', name: 'Claim Territory' },
      { id: 'recruit', name: 'Recruit Members' },
    ],
    players: [
      { id: 'p1', name: 'Rook', roleIds: ['member'] },
      { id: 'p2', name: 'Sera', roleIds: ['organizer', 'member'] },
    ],
  },
};

const state = {
  governmentName: 'The Commons Assembly',
  template: 'democracy',
  roles: [],
  actions: [],
  players: [],
};

function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizePermissionSet(permissionSet) {
  const fallback = { request: false, vote: false, executive: false };
  if (!permissionSet || typeof permissionSet !== 'object') {
    return { ...fallback };
  }

  return {
    request: Boolean(permissionSet.request),
    vote: Boolean(permissionSet.vote),
    executive: Boolean(permissionSet.executive),
  };
}

function normalizeRole(role) {
  const normalizedPermissions = {};
  const rawPermissions = role.permissions && typeof role.permissions === 'object' ? role.permissions : {};

  Object.entries(rawPermissions).forEach(([actionId, access]) => {
    normalizedPermissions[actionId] = normalizePermissionSet(access);
  });

  return {
    ...role,
    permissions: normalizedPermissions,
  };
}

function normalizeAction(action) {
  return {
    ...action,
    id: action.id || generateId('permission'),
    name: action.name || 'Unnamed Permission',
  };
}

function getRoleById(roleId) {
  return state.roles.find((role) => role.id === roleId);
}

function getActionById(actionId) {
  return state.actions.find((action) => action.id === actionId);
}

function getPlayerById(playerId) {
  return state.players.find((player) => player.id === playerId);
}

function getEffectivePermissionsForPlayer(player) {
  const permissions = {};

  for (const action of state.actions) {
    const aggregate = { request: false, vote: false, executive: false };

    for (const roleId of player.roleIds || []) {
      const role = getRoleById(roleId);
      if (!role) continue;
      const rolePermission = role.permissions[action.id] || { request: false, vote: false, executive: false };
      aggregate.request = aggregate.request || rolePermission.request;
      aggregate.vote = aggregate.vote || rolePermission.vote;
      aggregate.executive = aggregate.executive || rolePermission.executive;
    }

    const granted = Object.entries(aggregate)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (granted.length) {
      permissions[action.name] = granted.join(', ');
    }
  }

  return permissions;
}

function setTemplate(templateKey) {
  const template = governmentTemplates[templateKey] || governmentTemplates.democracy;
  state.governmentName = template.name;
  state.template = templateKey;
  state.roles = template.roles.map(normalizeRole);
  state.actions = template.actions.map(normalizeAction);
  state.players = template.players.map((player) => ({
    ...player,
    roleIds: [...player.roleIds],
  }));

  document.getElementById('government-name').value = state.governmentName;
  renderAll();
}

function updateGovernmentName() {
  state.governmentName = document.getElementById('government-name').value || 'Unnamed Government';
  renderSummary();
}

function addRole() {
  const input = document.getElementById('new-role-name');
  const value = (input.value || '').trim();
  if (!value) return;

  state.roles.push({
    id: generateId('role'),
    name: value,
    description: 'Custom role',
    permissions: {},
  });

  input.value = '';
  renderAll();
}

function removeRole(roleId) {
  state.roles = state.roles.filter((role) => role.id !== roleId);
  state.players = state.players.map((player) => ({
    ...player,
    roleIds: (player.roleIds || []).filter((id) => id !== roleId),
  }));
  renderAll();
}

function addAction() {
  const input = document.getElementById('new-action-name');
  const value = (input.value || '').trim();
  if (!value) return;

  const actionId = generateId('permission');

  state.actions.push({
    id: actionId,
    name: value,
  });

  state.roles = state.roles.map((role) => ({
    ...role,
    permissions: {
      ...role.permissions,
      [actionId]: { request: false, vote: false, executive: false },
    },
  }));

  input.value = '';
  renderAll();
}

function removeAction(actionId) {
  state.actions = state.actions.filter((action) => action.id !== actionId);
  state.roles = state.roles.map((role) => {
    const nextPermissions = { ...(role.permissions || {}) };
    delete nextPermissions[actionId];
    return {
      ...role,
      permissions: nextPermissions,
    };
  });
  renderAll();
}

function addPlayer() {
  const input = document.getElementById('new-player-name');
  const value = (input.value || '').trim();
  if (!value) return;

  state.players.push({
    id: generateId('player'),
    name: value,
    roleIds: state.roles.length ? [state.roles[0].id] : [],
  });

  input.value = '';
  renderAll();
}

function removePlayer(playerId) {
  state.players = state.players.filter((player) => player.id !== playerId);
  renderAll();
}

function updateRoleField(roleId, field, value) {
  const role = getRoleById(roleId);
  if (!role) return;
  role[field] = value;
  renderAll();
}

function updatePlayerRole(playerId, roleId, checked) {
  const player = getPlayerById(playerId);
  if (!player) return;

  const roleIds = new Set(player.roleIds || []);
  if (checked) {
    roleIds.add(roleId);
  } else {
    roleIds.delete(roleId);
  }

  player.roleIds = Array.from(roleIds);
  renderAll();
}

function toggleRolePermission(roleId, actionId, permissionType, checked) {
  const role = getRoleById(roleId);
  if (!role) return;

  const nextPermissions = {
    ...(role.permissions || {}),
    [actionId]: {
      request: false,
      vote: false,
      executive: false,
      ...((role.permissions && role.permissions[actionId]) || {}),
    },
  };

  nextPermissions[actionId][permissionType] = checked;
  role.permissions = nextPermissions;
  renderAll();
}

function renderRoleList() {
  const roleList = document.getElementById('role-list');
  if (!state.roles.length) {
    roleList.innerHTML = '<p class="empty-state">No roles yet.</p>';
    return;
  }

  roleList.innerHTML = state.roles
    .map(
      (role) => `
        <div class="entry-card">
          <div class="entry-header">
            <input data-role-id="${role.id}" data-role-field="name" class="role-name-input" value="${role.name}" />
            <button class="remove-button" data-role-remove="${role.id}">Remove</button>
          </div>
          <textarea data-role-id="${role.id}" data-role-field="description" rows="2">${role.description || ''}</textarea>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('.role-name-input').forEach((input) => {
    input.addEventListener('input', (event) => {
      updateRoleField(event.target.dataset.roleId, 'name', event.target.value);
    });
  });

  document.querySelectorAll('[data-role-field="description"]').forEach((textarea) => {
    textarea.addEventListener('input', (event) => {
      updateRoleField(event.target.dataset.roleId, 'description', event.target.value);
    });
  });

  document.querySelectorAll('[data-role-remove]').forEach((button) => {
    button.addEventListener('click', () => removeRole(button.dataset.roleRemove));
  });
}

function renderActionList() {
  const actionList = document.getElementById('action-list');
  if (!state.actions.length) {
    actionList.innerHTML = '<p class="empty-state">No permissions yet.</p>';
    return;
  }

  actionList.innerHTML = state.actions
    .map(
      (action) => `
        <div class="entry-card action-card">
          <div class="entry-header">
            <input data-action-id="${action.id}" data-action-field="name" class="action-name-input" value="${action.name}" />
            <button class="remove-button" data-action-remove="${action.id}">Remove</button>
          </div>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('.action-name-input').forEach((input) => {
    input.addEventListener('input', (event) => {
      const action = getActionById(event.target.dataset.actionId);
      if (!action) return;
      action.name = event.target.value;
      renderAll();
    });
  });

  document.querySelectorAll('[data-action-remove]').forEach((button) => {
    button.addEventListener('click', () => removeAction(button.dataset.actionRemove));
  });
}

function renderPermissionMatrix() {
  const permissionOutput = document.getElementById('permission-output');

  if (!state.roles.length || !state.actions.length) {
    permissionOutput.innerHTML = '<p class="empty-state">Add roles and permissions to build a matrix.</p>';
    return;
  }

  const headerCells = state.actions
    .map(
      (action) => `
        <th colspan="3">${action.name}</th>
      `
    )
    .join('');

  const subHeaderCells = `
    <tr>
      <th>Role</th>
      ${state.actions
        .map(
          () => `
            <th>Request</th>
            <th>Vote</th>
            <th>Executive</th>
          `
        )
        .join('')}
    </tr>
  `;

  const rows = state.roles
    .map((role) => {
      const cells = state.actions
        .map((action) => {
          const permission = role.permissions[action.id] || { request: false, vote: false, executive: false };
          return `
            <td>
              <input type="checkbox" data-role-permission-toggle="${role.id}" data-action-id="${action.id}" data-permission-type="request" ${permission.request ? 'checked' : ''} />
            </td>
            <td>
              <input type="checkbox" data-role-permission-toggle="${role.id}" data-action-id="${action.id}" data-permission-type="vote" ${permission.vote ? 'checked' : ''} />
            </td>
            <td>
              <input type="checkbox" data-role-permission-toggle="${role.id}" data-action-id="${action.id}" data-permission-type="executive" ${permission.executive ? 'checked' : ''} />
            </td>
          `;
        })
        .join('');

      return `
        <tr>
          <td class="role-label-cell">${role.name}</td>
          ${cells}
        </tr>
      `;
    })
    .join('');

  permissionOutput.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Role</th>
          ${headerCells}
        </tr>
        ${subHeaderCells}
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  document.querySelectorAll('[data-role-permission-toggle]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const roleId = event.target.dataset.rolePermissionToggle;
      const actionId = event.target.dataset.actionId;
      const permissionType = event.target.dataset.permissionType;
      toggleRolePermission(roleId, actionId, permissionType, event.target.checked);
    });
  });
}

function renderPlayerList() {
  const playerList = document.getElementById('player-list');
  if (!state.players.length) {
    playerList.innerHTML = '<p class="empty-state">No players yet.</p>';
    return;
  }

  playerList.innerHTML = state.players
    .map(
      (player) => `
        <div class="entry-card player-card">
          <div class="entry-header">
            <strong>${player.name}</strong>
            <button class="remove-button" data-player-remove="${player.id}">Remove</button>
          </div>
          <div class="role-checklist">
            ${state.roles
              .map(
                (role) => `
                  <label>
                    <input type="checkbox" data-player-role="${player.id}" value="${role.id}" ${player.roleIds.includes(role.id) ? 'checked' : ''} />
                    ${role.name}
                  </label>
                `
              )
              .join('')}
          </div>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('[data-player-role]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      updatePlayerRole(event.target.dataset.playerRole, event.target.value, event.target.checked);
    });
  });

  document.querySelectorAll('[data-player-remove]').forEach((button) => {
    button.addEventListener('click', () => removePlayer(button.dataset.playerRemove));
  });
}

function renderSummary() {
  const governmentOutput = document.getElementById('government-output');

  governmentOutput.innerHTML = `
    <div class="government-card">
      <h3>${state.governmentName}</h3>
      <div class="meta-grid">
        <div><span>Template</span><strong>${state.template}</strong></div>
        <div><span>Roles</span><strong>${state.roles.length}</strong></div>
        <div><span>Permissions</span><strong>${state.actions.length}</strong></div>
        <div><span>Players</span><strong>${state.players.length}</strong></div>
      </div>
      <div class="role-summary">
        ${state.roles
          .map(
            (role) => `
              <div class="summary-pill">
                <strong>${role.name}</strong>
                <span>${role.description || 'Custom role'}</span>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;

  const playerPermissionsOutput = document.getElementById('player-permissions-output');
  playerPermissionsOutput.innerHTML = state.players
    .map((player) => {
      const permissions = getEffectivePermissionsForPlayer(player);
      const summaryEntries = Object.entries(permissions);
      const summary = summaryEntries.length
        ? summaryEntries
            .map(([permissionName, value]) => `<li><strong>${permissionName}:</strong> ${value}</li>`)
            .join('')
        : '<li>No active permissions</li>';

      return `
        <div class="player-permission-card">
          <h4>${player.name}</h4>
          <div class="player-role-list">
            ${(player.roleIds || []).map((roleId) => getRoleById(roleId)?.name || 'Unknown role').join(', ') || 'No roles'}
          </div>
          <ul>${summary}</ul>
        </div>
      `;
    })
    .join('');
}

function renderAll() {
  renderRoleList();
  renderActionList();
  renderPermissionMatrix();
  renderPlayerList();
  renderSummary();
}

document.getElementById('government-name').addEventListener('input', updateGovernmentName);
document.getElementById('add-role').addEventListener('click', addRole);
document.getElementById('add-action').addEventListener('click', addAction);
document.getElementById('add-player').addEventListener('click', addPlayer);
document.getElementById('load-template').addEventListener('click', () => {
  const templateKey = document.getElementById('government-template').value;
  setTemplate(templateKey);
});

setTemplate('democracy');
