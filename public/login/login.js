/* ===== PeopleCore HRMS – Login Page Logic ===== */

const roleConfig = {
  hr: { label: 'HR', desc: 'Human Resources' },
  admin: { label: 'Admin', desc: 'System Admin' },
  employee: { label: 'Employee', desc: 'Staff Portal' },
};

let currentRole = 'hr';
let rememberMe = false;

function selectRole(role) {
  currentRole = role;

  // Update tabs
  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.role === role);
  });

  // Update divider text
  document.getElementById('roleDesc').textContent = roleConfig[role].desc;

  // Update button
  const btn = document.getElementById('loginBtn');
  document.getElementById('btnText').textContent = 'Sign in as ' + roleConfig[role].label;
  btn.className = 'login-btn';
  if (role === 'admin') btn.classList.add('admin-role');
  else if (role === 'employee') btn.classList.add('emp-role');

  // Clear error
  hideError();
}

function togglePassword() {
  const pw = document.getElementById('password');
  const open = document.getElementById('eyeOpen');
  const closed = document.getElementById('eyeClosed');
  if (pw.type === 'password') {
    pw.type = 'text';
    open.style.display = 'none';
    closed.style.display = 'block';
  } else {
    pw.type = 'password';
    open.style.display = 'block';
    closed.style.display = 'none';
  }
}

function toggleRemember() {
  rememberMe = !rememberMe;
  document.getElementById('rememberBtn').classList.toggle('checked', rememberMe);
}

function showError(msg) {
  const box = document.getElementById('errorBox');
  box.textContent = msg;
  box.classList.add('show');
}

function hideError() {
  const box = document.getElementById('errorBox');
  box.classList.remove('show');
  box.textContent = '';
}

function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }

  hideError();

  // Show loading
  const btn = document.getElementById('loginBtn');
  btn.classList.add('loading');

  // Simulate API call
  setTimeout(() => {
    btn.classList.remove('loading');
    // On success, redirect to main app
    window.location.href = '/';
  }, 1500);
}
