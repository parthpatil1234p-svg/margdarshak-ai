/**
 * Authentication & Saved Roadmaps Client Module
 */

window.currentUser = null;

const getAuthToken = () => localStorage.getItem('margdarshak_token');
const setAuthToken = (token) => localStorage.setItem('margdarshak_token', token);
const clearAuthToken = () => localStorage.removeItem('margdarshak_token');

const initAuth = async () => {
  const token = getAuthToken();
  if (!token) {
    renderUnauthenticatedUI();
    return;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.user) {
      window.currentUser = data.user;
      renderAuthenticatedUI(data.user);
    } else {
      clearAuthToken();
      renderUnauthenticatedUI();
    }
  } catch (err) {
    console.warn('[Auth Check Warning]', err);
    renderUnauthenticatedUI();
  }
};

const renderAuthenticatedUI = (user) => {
  const container = document.getElementById('authNavContainer');
  if (!container) return;

  const roleBadgeColor = user.userType === 'Judge' ? 'warning text-white' :
                         user.userType === 'Parent' ? 'info' : 'primary';

  container.innerHTML = `
    <div class="dropdown">
      <button class="btn btn-outline-light btn-sm dropdown-toggle rounded-pill px-2 px-sm-3 d-flex align-items-center" type="button" data-bs-toggle="dropdown">
        <i class="fa-solid fa-circle-user fa-lg me-1 me-sm-2 text-warning"></i>
        <span class="fw-bold me-1 text-truncate user-display-name" style="max-width: 120px;">${user.name}</span>
        <span class="badge bg-${roleBadgeColor} ms-1" style="font-size: 0.68rem;">${user.userType}</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-2">
        <li class="px-3 py-1 small text-muted border-bottom mb-2">
          Signed in as <strong>${user.email}</strong>
        </li>
        <li>
          <button class="dropdown-item rounded-2 py-2 small" onclick="openSavedRoadmapsModal()">
            <i class="fa-solid fa-folder-open text-primary me-2"></i>My Saved Roadmaps
            <span id="navSavedRoadmapsCount" class="badge bg-primary-subtle text-primary ms-2">${user.savedRoadmapsCount || 0}</span>
          </button>
        </li>
        <li>
          <button class="dropdown-item rounded-2 py-2 small" onclick="openSaveRoadmapModal()">
            <i class="fa-solid fa-bookmark text-success me-2"></i>Save Current Simulation
          </button>
        </li>
        <li><hr class="dropdown-divider my-1"></li>
        <li>
          <button class="dropdown-item rounded-2 py-2 small text-danger" onclick="handleLogout()">
            <i class="fa-solid fa-right-from-bracket me-2"></i>Log Out
          </button>
        </li>
      </ul>
    </div>
  `;
};

const renderUnauthenticatedUI = () => {
  const container = document.getElementById('authNavContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="d-flex align-items-center gap-1 gap-sm-2">
      <button class="btn-shiny-amber text-nowrap" onclick="handleDemoJudgeLogin()" title="Judge 1-Click Login">
        <i class="fa-solid fa-bolt text-warning me-1"></i><span class="d-none d-sm-inline">Judge 1-Click </span>Login
      </button>
      <button class="btn-interactive-pill text-nowrap" data-bs-toggle="modal" data-bs-target="#authModal">
        <i class="fa-solid fa-user me-1"></i><span class="d-none d-md-inline">Sign In</span>
      </button>
    </div>
  `;
};

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      setAuthToken(data.token);
      window.currentUser = data.user;
      renderAuthenticatedUI(data.user);
      bootstrap.Modal.getInstance(document.getElementById('authModal'))?.hide();
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    alert('Login error: ' + err.message);
  }
};

const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const userType = document.getElementById('regUserType').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, userType })
    });
    const data = await res.json();
    if (data.success) {
      setAuthToken(data.token);
      window.currentUser = data.user;
      renderAuthenticatedUI(data.user);
      bootstrap.Modal.getInstance(document.getElementById('authModal'))?.hide();
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (err) {
    alert('Registration error: ' + err.message);
  }
};

const handleDemoJudgeLogin = async () => {
  try {
    const res = await fetch('/api/auth/demo-judge-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      setAuthToken(data.token);
      window.currentUser = data.user;
      renderAuthenticatedUI(data.user);
      openSavedRoadmapsModal();
    }
  } catch (err) {
    alert('Judge login error: ' + err.message);
  }
};

const handleLogout = () => {
  clearAuthToken();
  window.currentUser = null;
  renderUnauthenticatedUI();
};

/**
 * Save current simulation modal
 */
const openSaveRoadmapModal = () => {
  if (!window.currentUser) {
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();
    return;
  }

  const studentName = window.currentStudentProfile?.fullName || 'Student';
  const defaultTitle = `${studentName} - Career Simulation (${new Date().toLocaleDateString('en-IN')})`;

  document.getElementById('saveRoadmapTitle').value = defaultTitle;
  document.getElementById('saveRoadmapNotes').value = '';

  const saveModal = new bootstrap.Modal(document.getElementById('saveRoadmapModal'));
  saveModal.show();
};

const submitSaveRoadmap = async () => {
  const title = document.getElementById('saveRoadmapTitle').value;
  const notes = document.getElementById('saveRoadmapNotes').value;

  if (!title) {
    alert('Please enter a title for this roadmap.');
    return;
  }

  if (!window.currentStudentProfile || !window.currentPathways?.length) {
    alert('Please simulate a pathway first before saving!');
    return;
  }

  const token = getAuthToken();
  try {
    const res = await fetch('/api/auth/save-roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        studentName: window.currentStudentProfile.fullName,
        profileSnapshot: window.currentStudentProfile,
        pathwaysSnapshot: window.currentPathways,
        aiCounselingSnapshot: window.counselingData,
        notes
      })
    });
    const data = await res.json();
    if (data.success) {
      bootstrap.Modal.getInstance(document.getElementById('saveRoadmapModal'))?.hide();
      alert('✅ Roadmap successfully saved to your MongoDB profile!');
      
      // Update badge count
      const countEl = document.getElementById('navSavedRoadmapsCount');
      if (countEl) countEl.innerText = data.totalSavedCount;
    } else {
      alert(data.error || 'Failed to save roadmap');
    }
  } catch (err) {
    alert('Save error: ' + err.message);
  }
};

/**
 * Open and render "My Saved Roadmaps" modal
 */
const openSavedRoadmapsModal = async () => {
  const token = getAuthToken();
  if (!token) {
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();
    return;
  }

  const container = document.getElementById('savedRoadmapsListContainer');
  if (container) {
    container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div></div>';
  }

  const modal = new bootstrap.Modal(document.getElementById('savedRoadmapsModal'));
  modal.show();

  try {
    const res = await fetch('/api/auth/saved-roadmaps', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && container) {
      renderSavedRoadmapsList(data.savedRoadmaps || []);
    }
  } catch (err) {
    if (container) container.innerHTML = '<p class="text-danger">Failed to load saved roadmaps.</p>';
  }
};

const renderSavedRoadmapsList = (roadmaps) => {
  const container = document.getElementById('savedRoadmapsListContainer');
  if (!container) return;

  if (roadmaps.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fa-regular fa-folder-open fa-3x mb-3 text-secondary"></i>
        <h5>No saved roadmaps yet</h5>
        <p class="small">Run a simulation and click "Save This Roadmap" to store your favorite academic plans here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = roadmaps.map((r, idx) => `
    <div class="p-3 glass-card border border-glass rounded-3 mb-3 shadow-sm">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6 class="fw-bold text-white mb-1">${r.title}</h6>
          <span class="badge bg-secondary-subtle text-white border border-glass small me-2">
            <i class="fa-solid fa-user-graduate me-1 text-primary"></i>${r.studentName}
          </span>
          <span class="text-muted small">
            <i class="fa-regular fa-calendar me-1"></i>${new Date(r.savedAt).toLocaleDateString('en-IN')}
          </span>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm rounded-pill" onclick="loadSavedRoadmapIntoSimulator('${r._id}')">
            <i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Load
          </button>
          <button class="btn btn-outline-danger btn-sm rounded-pill" onclick="deleteSavedRoadmap('${r._id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      ${r.notes ? `<div class="p-2 glass-card border border-glass rounded-2 small text-muted mb-2"><i class="fa-solid fa-note-sticky text-warning me-1"></i>${r.notes}</div>` : ''}

      <div class="d-flex gap-3 small text-secondary">
        <span><strong>10th Marks:</strong> ${r.profileSnapshot?.marks?.overallPercentage || 75}%</span>
        <span><strong>Budget:</strong> ₹${((r.profileSnapshot?.maxBudgetINR || 500000) / 100000).toFixed(1)}L</span>
        <span><strong>Aspiration:</strong> ${r.profileSnapshot?.targetAspiration || 'Open'}</span>
      </div>
    </div>
  `).join('');
};

const loadSavedRoadmapIntoSimulator = async (id) => {
  const token = getAuthToken();
  try {
    const res = await fetch('/api/auth/saved-roadmaps', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      const selected = data.savedRoadmaps.find(r => r._id === id);
      if (selected) {
        window.currentStudentProfile = selected.profileSnapshot;
        window.currentPathways = selected.pathwaysSnapshot;
        window.counselingData = selected.aiCounselingSnapshot;

        // If pathways snapshot was empty (e.g. sample benchmarks), auto-simulate from snapshot profile
        if (!selected.pathwaysSnapshot || selected.pathwaysSnapshot.length === 0) {
          await simulateCareerRoadmap(selected.profileSnapshot);
        } else {
          renderCounselorGuidance(selected.aiCounselingSnapshot);
          renderPathways(selected.pathwaysSnapshot);
          renderDecisionMatrix(selected.pathwaysSnapshot);
        }

        bootstrap.Modal.getInstance(document.getElementById('savedRoadmapsModal'))?.hide();

        // Switch to roadmap tab
        const tabEl = document.getElementById('pills-roadmap-tab');
        if (tabEl) new bootstrap.Tab(tabEl).show();

        alert(`✅ Loaded "${selected.title}" into simulator.`);
      }
    }
  } catch (err) {
    alert('Load error: ' + err.message);
  }
};

const deleteSavedRoadmap = async (id) => {
  if (!confirm('Are you sure you want to delete this saved roadmap?')) return;

  const token = getAuthToken();
  try {
    const res = await fetch(`/api/auth/saved-roadmaps/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      openSavedRoadmapsModal();
      const countEl = document.getElementById('navSavedRoadmapsCount');
      if (countEl) countEl.innerText = data.remainingCount;
    }
  } catch (err) {
    alert('Delete error: ' + err.message);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

window.handleLoginSubmit = handleLoginSubmit;
window.handleRegisterSubmit = handleRegisterSubmit;
window.handleDemoJudgeLogin = handleDemoJudgeLogin;
window.handleLogout = handleLogout;
window.openSaveRoadmapModal = openSaveRoadmapModal;
window.submitSaveRoadmap = submitSaveRoadmap;
window.openSavedRoadmapsModal = openSavedRoadmapsModal;
window.loadSavedRoadmapIntoSimulator = loadSavedRoadmapIntoSimulator;
window.deleteSavedRoadmap = deleteSavedRoadmap;
