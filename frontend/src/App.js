import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationsProvider, { useNotification } from './Notifications';
import './App.css';
import logo from './logo.jpeg';

// Use environment variable or default to production backend
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://cpf-backend1.onrender.com/api' 
    : 'http://localhost:5000/api');

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <NotificationsProvider>
        <Login setUser={setUser} />
      </NotificationsProvider>
    );
  }
  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h1 className="text-sm sm:text-lg font-bold truncate">Career Assessment</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 active:bg-white/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

        {user.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <StudentDashboard user={user} />
        )}
      </div>
    </NotificationsProvider>
  );
}

function Login({ setUser }) {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, { rollNumber, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex flex-col lg:flex-row">
      {/* Left Side - College Logo (Hidden on mobile, shown on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8 xl:p-12 text-white">
        <div className="max-w-lg text-center animate-fadeIn">
          <div className="mb-6">
            <img 
              src={logo}
              alt="College Logo" 
              className="mx-auto max-h-32 xl:max-h-40 rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="hidden w-24 h-24 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              🎓
            </div>
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold mb-3">Student Counselling Cell</h1>
          <h2 className="text-2xl xl:text-3xl font-semibold mb-4 text-white/95">Student Wellbeing Assessment Framework</h2>
          <p className="text-base xl:text-lg text-white/85 mb-8">Discover your ideal career path with our comprehensive assessment tools</p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-xs font-medium">Career Guidance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-xs font-medium">Detailed Reports</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-xs font-medium">Personalized Insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0">
        {/* Mobile header - show on small screens only */}
        <div className="absolute top-0 left-0 right-0 pt-6 pb-4 lg:hidden">
          <div className="flex flex-col items-center justify-center text-white">
            <img 
              src={logo}
              alt="Logo" 
              className="max-w-[200px] sm:max-w-[240px] h-auto rounded-xl shadow-2xl border-2 border-white/30"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-bold text-xl mt-3">Career Assessment</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-slideUp mt-16 lg:mt-0">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4 shadow-inner">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                  placeholder="Enter your roll number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Help text for mobile */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact your administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ user }) {
  const [view, setView] = useState('home');
  const [profile, setProfile] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const navItems = [
    { key: 'home', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { key: 'test', label: 'Assessment', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )},
    { key: 'settings', label: 'Settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )}
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-6">
      {/* Desktop Navigation Tabs */}
      <div className="hidden sm:flex mb-6 gap-2 bg-white/50 p-1.5 rounded-xl backdrop-blur-sm">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => { setView(item.key); if (item.key !== 'test') setSelectedTest(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              view === item.key 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 safe-bottom">
        <div className="flex justify-around items-center py-2 px-2">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setView(item.key); if (item.key !== 'test') setSelectedTest(null); }}
              className={`mobile-nav-item flex-1 ${view === item.key ? 'active' : ''}`}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Header for current section */}
      <div className="sm:hidden mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {view === 'home' ? 'Dashboard' : view === 'test' ? 'Assessments' : 'Settings'}
        </h2>
      </div>

      <div className="animate-fadeIn">
        {view === 'home' && <StudentHome profile={profile} />}
        {view === 'test' && (
          !selectedTest ? (
            <TestsList onSelect={(t) => setSelectedTest(t)} />
          ) : (
            <div>
              <div className="mb-4">
                <button 
                  onClick={() => setSelectedTest(null)} 
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 shadow-sm border border-gray-200 text-gray-700 font-medium transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Tests
                </button>
              </div>
              <TestComponent profile={profile} fetchProfile={fetchProfile} testKey={selectedTest} />
            </div>
          )
        )}
        {view === 'settings' && <StudentSettings />}
      </div>
    </div>
  );
}

function TestsList({ onSelect }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        // try authenticated endpoint first
        const res = await axios.get(`${API_URL}/tests`);
        setTests(res.data || []);
      } catch (err) {
        console.warn('Authenticated tests fetch failed, trying public endpoint', err?.response?.status);
        // fall back to public endpoint
        try {
          const pub = await axios.get(`${API_URL}/public/tests`);
          setTests(pub.data || []);
        } catch (err2) {
          console.error('Failed to fetch public tests', err2);
          setError(err2.response?.data?.error || 'Failed to load tests.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();

    // also try to fetch profile (optional) to mark completed tests on the cards
    const fetchProfile = async () => {
      try {
        const p = await axios.get(`${API_URL}/user/profile`);
        setProfile(p.data);
      } catch (e) {
        // ignore if unauthenticated or fails — public view still works
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div></div>;
  if (tests.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center animate-fadeIn">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">No tests available</h3>
        <p className="text-sm text-gray-600 mb-6">{error || 'There are no tests configured on the server.'}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={() => onSelect('RIASEC')} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all active:scale-95">Take RIASEC (default)</button>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all active:scale-95">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tests.map((test, index) => {
        const isCompleted = profile && profile.testResults && profile.testResults.some(r => r.test === test.key);
        const testIcons = {
          'RIASEC': '🎯',
          'Personality': '😊',
          'Aptitude': '🧠',
          'EI': '💭'
        };
        return (
          <div 
            key={test.key} 
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 sm:p-6 border border-gray-100 card-hover animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl">
                  {testIcons[test.key] || '📋'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{test.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{test.questionCount} Questions</span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Done
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">{test.description}</p>
            <button 
              onClick={() => onSelect(test.key)} 
              className={`w-full py-3 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isCompleted 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isCompleted ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Result
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Test
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function StudentHome({ profile }) {
  const careerData = {
    'R': { name: 'Realistic', color: 'bg-blue-500', desc: 'Hands-on work with tools and machinery' },
    'I': { name: 'Investigative', color: 'bg-purple-500', desc: 'Analytical and research-oriented' },
    'A': { name: 'Artistic', color: 'bg-pink-500', desc: 'Creative expression and innovation' },
    'S': { name: 'Social', color: 'bg-green-500', desc: 'People-oriented and helping' },
    'E': { name: 'Enterprising', color: 'bg-orange-500', desc: 'Leadership and entrepreneurship' },
    'C': { name: 'Conventional', color: 'bg-gray-500', desc: 'Organized and detail-oriented' }
  };
  
  if (!profile) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const testResults = profile?.testResults || [];
  const sortedTestResults = [...testResults].sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  const riasecResults = sortedTestResults.filter(r => r.test === 'RIASEC');
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg p-5 sm:p-8 border border-indigo-100 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg flex-shrink-0">
            👋
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome, {profile.name?.split(' ')[0] || 'Student'}!</h2>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Discover your ideal career path with our assessments</p>
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          {profile.hasCompletedTest ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-semibold">Assessment Completed</p>
                <p className="text-green-700 text-sm">Your career profile is ready below</p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-800 font-semibold">Ready to Begin?</p>
                <p className="text-amber-700 text-sm">Tap "Assessment" below to start your journey</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIASEC summary: show top 1 large and next 2 smaller */}
      {profile.hasCompletedTest && riasecResults.length > 0 && (() => {
        const latest = riasecResults[0];
        const scores = latest?.scores || {};
        const sorted = Object.entries(scores).sort(([,a],[,b]) => b - a);
        const topThree = sorted.slice(0,3).map(([code]) => code);
        const [top1, top2, top3] = topThree;
        const top1Label = `${top1} - ${careerData[top1]?.name || ''}`;
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg bg-white/10 flex items-center justify-center text-4xl font-bold">{top1}</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold">{top1Label}</h3>
                  <p className="text-sm opacity-90 mt-1">{careerData[top1]?.desc}</p>
                  <div className="mt-4 space-y-1">
                    <div className="text-xs opacity-90 font-semibold mb-2">Preferred Tasks:</div>
                    {(latest.recommendedCareers || []).slice(0,4).map((c, i) => (
                      <div key={i} className="text-sm opacity-95 flex items-start gap-2">
                        <span>•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[top2, top3].filter(Boolean).map((code) => (
                <div key={code} className="bg-white rounded-xl shadow p-5">
                  <div className="text-xs text-gray-500">{careerData[code]?.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{careerData[code]?.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* When only non-RIASEC tests exist, show their result plus a prompt to take RIASEC */}
      {profile.hasCompletedTest && riasecResults.length === 0 && sortedTestResults.length > 0 && (() => {
        const latest = sortedTestResults[0];

        // Personality summary card
        if (latest.test === 'Personality') {
          const getNum = (v) => (v !== undefined && v !== null && !isNaN(Number(v)) ? Number(v) : null);
          const score = getNum(latest.score) ?? getNum(latest.total) ?? getNum(latest.correct);
          const questionCount = getNum(latest.questionCount);
          const interpretation = latest.interpretation || '';
          const feedback = latest.feedback || '';
          let scoreRange = '';
          if (questionCount) {
            scoreRange = questionCount >= 14
              ? `WEMWBS (14-item): ${score ?? '—'}/70`
              : `SWEMWBS (7-item): ${score ?? '—'}/35`;
          } else {
            scoreRange = score != null ? `Score: ${score}` : 'Score not available';
          }

          return (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 border border-purple-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 text-2xl">😊</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">Personality Inventory Result</h3>
                    <p className="text-sm text-gray-600 mt-1">{scoreRange}</p>
                    <p className="text-md font-semibold text-purple-700 mt-2">{interpretation}</p>
                    <div className="mt-3 text-sm text-gray-700 whitespace-pre-line leading-relaxed">{feedback}</div>
                    <div className="text-xs text-gray-500 mt-3">Completed: {new Date(latest.completedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">ℹ️</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-800">RIASEC result not available yet</h3>
                    <p className="text-sm text-yellow-700 mt-1">Take the Career Interest (RIASEC) test to unlock the full career dashboard with top matches and task preferences.</p>
                    <div className="mt-3 text-xs text-yellow-700">Last test completed: {new Date(latest.completedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </>
          );
        }

        // Aptitude summary card
        if (latest.test === 'Aptitude') {
          const score = latest.score || latest.correct || 0;
          const total = latest.total || latest.totalQuestions || 0;
          return (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl">🧠</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">Aptitude Test Result</h3>
                    <p className="text-md font-semibold text-blue-700 mt-2">Score: {score} / {total}</p>
                    <div className="text-xs text-gray-500 mt-3">Completed: {new Date(latest.completedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">ℹ️</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-800">RIASEC result not available yet</h3>
                    <p className="text-sm text-yellow-700 mt-1">Take the Career Interest (RIASEC) test to unlock the full career dashboard with top matches and task preferences.</p>
                    <div className="mt-3 text-xs text-yellow-700">Last test completed: {new Date(latest.completedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </>
          );
        }

        // Emotional Intelligence summary card
        if (latest.test === 'EI') {
          const factorData = latest.factorFeedback || latest.factors || {};
          const globalScore = latest.globalScore ?? 0;
          const globalLevel = latest.globalLevel || 'Average';
          
          return (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 border border-teal-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-100 text-teal-700 text-2xl">💭</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">Emotional Intelligence (TEIQue-SF) Result</h3>
                    <div className="mt-2 p-3 bg-teal-50 rounded-lg">
                      <p className="text-sm font-semibold text-teal-700">Global EI Score: <span className="text-xl text-teal-800">{typeof globalScore === 'number' ? globalScore.toFixed(2) : globalScore}</span> / 7.0</p>
                      <p className="text-sm font-semibold text-teal-700">Level: <span className="text-teal-800">{globalLevel}</span></p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {Object.entries(factorData).map(([factor, data]) => {
                        const scoreValue = typeof data === 'object' && data.score ? data.score : data;
                        const displayScore = typeof scoreValue === 'number' ? scoreValue.toFixed(2) : parseFloat(scoreValue).toFixed(2);
                        return (
                          <div key={factor} className="bg-gray-50 p-2 rounded">
                            <p className="text-xs font-semibold text-gray-700">{factor}</p>
                            <p className="text-sm font-bold text-teal-600">{displayScore}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-500 mt-3">Completed: {new Date(latest.completedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </>
          );

        }

        // Generic fallback
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="text-3xl">ℹ️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-800">RIASEC result not available yet</h3>
                <p className="text-sm text-yellow-700 mt-1">Your latest completed test is {latest.test}. Take the Career Interest (RIASEC) test to see the full dashboard with career matches.</p>
                <div className="mt-3 text-xs text-yellow-700">Last test completed: {new Date(latest.completedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Detailed RIASEC breakdown (top three only) */}
      {riasecResults.length > 0 && (() => {
        const latest = riasecResults[0];
        const maxPossibleScore = 35;
        const topThree = Object.entries(latest?.scores || {})
          .sort(([,a],[,b])=>b-a)
          .slice(0,3);
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map(([code, score]) => {
              const career = careerData[code];
              const numScore = Number(score) || 0;
              return (
                <div key={code} className="bg-white rounded-xl shadow p-5">
                  <div className="text-xs text-gray-500">{career.name}</div>
                  <div className="text-3xl font-bold mt-2 text-indigo-600">{numScore}<span className="text-xl text-gray-400">/{maxPossibleScore}</span></div>
                  <p className="text-sm text-gray-500 mt-3">{career.desc}</p>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Latest test result (any test) to surface Personality/Aptitude clearly */}
      {sortedTestResults.length > 0 && (() => {
        const latestAny = sortedTestResults[0];

        if (latestAny.test === 'Personality') {
          const getNum = (v) => (v !== undefined && v !== null && !isNaN(Number(v)) ? Number(v) : null);
          const score = getNum(latestAny.score) ?? getNum(latestAny.total) ?? getNum(latestAny.correct);
          const questionCount = getNum(latestAny.questionCount);
          const interpretation = latestAny.interpretation || '';
          const feedback = latestAny.feedback || '';
          const scoreRange = questionCount
            ? (questionCount >= 14 ? `WEMWBS (14-item): ${score ?? '—'}/70` : `SWEMWBS (7-item): ${score ?? '—'}/35`)
            : (score != null ? `Score: ${score}` : 'Score not available');

          return (
            <div className="bg-white rounded-xl shadow-md p-6 border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 text-2xl">😊</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Latest Test: Personality Inventory</h3>
                      <p className="text-sm text-gray-600 mt-1">{scoreRange}</p>
                      <p className="text-md font-semibold text-purple-700 mt-2">{interpretation}</p>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(latestAny.completedAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700 whitespace-pre-line leading-relaxed">{feedback}</div>
                </div>
              </div>
            </div>
          );
        }

        if (latestAny.test === 'Aptitude') {
          const score = latestAny.score || latestAny.correct || 0;
          const total = latestAny.total || latestAny.totalQuestions || 0;
          return (
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl">🧠</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Latest Test: Aptitude</h3>
                      <p className="text-md font-semibold text-blue-700 mt-2">Score: {score} / {total}</p>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(latestAny.completedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // If latest is RIASEC, rely on the main RIASEC cards already shown; no extra card needed.
        return null;
      })()}

      {/* Test history: show all saved test results */}
      {sortedTestResults.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h4 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Test History
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {sortedTestResults.map((r, idx) => {
              const isPersonality = r.test === 'Personality';
              const isAptitude = r.test === 'Aptitude';
              const isEI = r.test === 'EI';
              const getNum = (v) => (v !== undefined && v !== null && !isNaN(Number(v)) ? Number(v) : null);
              const qc = getNum(r.questionCount);
              const sVal = getNum(r.score) ?? getNum(r.total) ?? getNum(r.correct);
              
              const titleText = isPersonality 
                ? `${r.test} (${qc && qc >= 14 ? 'WEMWBS' : 'SWEMWBS'})` 
                : isAptitude 
                ? `${r.test}` 
                : isEI
                ? `${r.test} — ${r.globalLevel || 'Completed'} EI`
                : `${r.test} — ${r.primaryCareer}`;
              
              const scoreText = isPersonality 
                ? (qc ? `Score: ${sVal ?? '—'}/${qc >= 14 ? 70 : 35}` : (sVal != null ? `Score: ${sVal}` : 'Score: —')) 
                : isAptitude 
                ? `Score: ${sVal ?? '—'}/${getNum(r.total) ?? getNum(r.totalQuestions) ?? '—'}` 
                : isEI
                ? (r.globalScore !== undefined && r.globalScore !== null ? `Global Score: ${typeof r.globalScore === 'number' ? r.globalScore.toFixed(2) : r.globalScore}/7.0` : 'Global Score: —/7.0')
                : `Top: ${r.topThree?.map(t => t.split(' - ')[0]).join(', ')}`;

              const testIcons = {
                'RIASEC': '🎯',
                'Personality': '😊',
                'Aptitude': '🧠',
                'EI': '💭'
              };
              
              return (
                <div key={idx} className="border-2 border-gray-100 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white hover:border-indigo-200 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-lg flex-shrink-0">
                      {testIcons[r.test] || '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">{titleText}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{new Date(r.completedAt).toLocaleDateString()}</div>
                      <div className="mt-2 text-sm font-medium text-indigo-600">{scoreText}</div>
                    </div>
                    <button 
                      onClick={() => downloadResultForUser(r, profile)} 
                      className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function downloadResultForUser(result, profile) {
  const roll = profile?.rollNumber || 'N/A';
  const name = profile?.name || 'N/A';
  const test = result?.test || 'N/A';

  // Build content based on test type
  let lines = [];
  lines.push(`Career Assessment Report`);
  lines.push(``);
  lines.push(`Student: ${name} (${roll})`);
  lines.push(`Test: ${test}`);
  lines.push(`Completed: ${result?.completedAt ? new Date(result.completedAt).toLocaleString() : 'N/A'}`);
  lines.push(``);

  if (test === 'RIASEC') {
    const scores = result?.scores || {};
    const topThree = Object.entries(scores).sort(([,a],[,b]) => b-a).slice(0,3).map(([c]) => c);
    const recs = result?.recommendedCareers || [];
    lines.push(`Top Matches: ${topThree.join(', ')}`);
    lines.push(`Scores:`);
    Object.entries(scores).forEach(([code, score]) => lines.push(`- ${code}: ${score} / 35`));
    if (recs.length) {
      lines.push(``);
      lines.push(`Suggestions:`);
      recs.forEach(s => lines.push(`- ${s}`));
    }
  } else if (test === 'EI') {
    const factorData = result?.factorFeedback || result?.factors || {};
    const globalScore = result?.globalScore;
    const globalLevel = result?.globalLevel;
    
    if (globalScore !== undefined && globalScore !== null) {
      const scoreNum = typeof globalScore === 'number' ? globalScore : parseFloat(globalScore);
      lines.push(`Global EI Score: ${scoreNum.toFixed(2)} / 7.0`);
    } else {
      lines.push(`Global EI Score: Data not available`);
    }
    
    if (globalLevel) {
      lines.push(`Level: ${globalLevel}`);
    } else {
      lines.push(`Level: Assessment complete`);
    }
    
    lines.push(``);
    lines.push(`Factor Scores:`);
    
    if (Object.keys(factorData).length > 0) {
      Object.entries(factorData).forEach(([factor, data]) => {
        const scoreValue = typeof data === 'object' && data.score ? data.score : data;
        const numScore = typeof scoreValue === 'number' ? scoreValue : parseFloat(scoreValue);
        if (!isNaN(numScore)) {
          lines.push(`- ${factor}: ${numScore.toFixed(2)} / 7.0`);
        } else {
          lines.push(`- ${factor}: Data not available`);
        }
      });
    } else {
      lines.push(`- Factor data not available`);
    }
    
    if (result?.globalFeedback) {
      lines.push(``);
      lines.push(`Overall Assessment:`);
      lines.push(result.globalFeedback);
    }
  } else if (test === 'Personality') {
    const score = result?.score ?? result?.total ?? result?.correct ?? 'N/A';
    const qCount = result?.questionCount || 0;
    const range = qCount >= 14 ? 70 : 35;
    lines.push(`Score: ${score} / ${range}`);
    if (result?.interpretation) lines.push(`Interpretation: ${result.interpretation}`);
    if (result?.feedback) {
      lines.push(``);
      lines.push(`Suggestions:`);
      lines.push(result.feedback);
    }
  } else if (test === 'Aptitude') {
    const score = result?.score ?? result?.correct ?? 0;
    const total = result?.total ?? result?.totalQuestions ?? 'N/A';
    lines.push(`Score: ${score} / ${total}`);
  } else {
    lines.push(`Result data not available.`);
  }

  // Generate PDF via jsPDF (loaded via public/index.html)
  try {
    const doc = new window.jspdf.jsPDF();
    const margin = 14;
    let y = margin;
    doc.setFontSize(16);
    doc.text(lines[0], margin, y);
    doc.setFontSize(11);
    y += 8;
    lines.slice(1).forEach(line => {
      const split = doc.splitTextToSize(line, 180);
      split.forEach(chunk => {
        doc.text(chunk, margin, y);
        y += 6;
        if (y > 280) { doc.addPage(); y = margin; }
      });
    });
    doc.save(`${roll}_${test}_report.pdf`);
  } catch (e) {
    // Fallback to text if PDF fails
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roll}_${test}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

function TestComponent({ profile, fetchProfile, testKey }) {
  const { notify, celebrate } = useNotification();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [readyToStart, setReadyToStart] = useState(false);

  const fetchQuestions = React.useCallback(async () => {
    try {
      // fetch questions for a specific test if provided
      const url = `${API_URL}/questions`;
      let response;
      try {
        response = testKey ? await axios.get(url, { params: { test: testKey } }) : await axios.get(url);
      } catch (err) {
        // if authenticated request fails, fall back to public endpoint
        console.warn('Authenticated questions fetch failed, trying public endpoint', err?.response?.status);
        const pubUrl = `${API_URL}/public/questions`;
        response = testKey ? await axios.get(pubUrl, { params: { test: testKey } }) : await axios.get(pubUrl);
      }
      setQuestions(response.data);
      // Do NOT initialize slider-based tests (RIASEC, Personality, EI) - they need explicit user interaction
      // Only initialize Aptitude with 0 values for MCQ radio buttons
      if ((testKey && testKey === 'Aptitude') && response.data && response.data.length) {
        const init = {};
        response.data.forEach(q => { init[q._id] = 0; });
        setAnswers(init);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }, [testKey]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSliderChange = (value) => {
    const currentQuestion = questions[currentIndex];
    setAnswers(prev => ({ ...prev, [currentQuestion._id]: value }));
  };

  const handleRangeClick = (e) => {
    // compute value based on click position so clicking the track sets value even if same as current
    const el = e.target;
    const rect = el.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const min = Number(el.min) || 1;
    const max = Number(el.max) || 5;
    const value = Math.round(ratio * (max - min) + min);
    handleSliderChange(value);
  };

  const handleCheckboxChange = (checked) => {
    const currentQuestion = questions[currentIndex];
    setAnswers(prev => ({ ...prev, [currentQuestion._id]: checked ? 1 : 0 }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      // Mark current question as visited when moving to next
      const qId = questions[currentIndex]._id;
      setVisitedQuestions(prev => ({ ...prev, [qId]: true }));
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Mark current question as visited when moving to previous
      const qId = questions[currentIndex]._id;
      setVisitedQuestions(prev => ({ ...prev, [qId]: true }));
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered()) {
      notify('Please answer all questions', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/submit-test`, { answers, test: testKey });
      setResult(response.data);
      await fetchProfile();
      
      // Test-specific success message
      let testName = testKey;
      if (testKey === 'RIASEC') testName = 'Career Interest Assessment';
      else if (testKey === 'Personality') testName = 'Personality Inventory';
      else if (testKey === 'Aptitude') testName = 'Aptitude Test';
      else if (testKey === 'EI') testName = 'Emotional Intelligence';
      
      notify(`${testName} submitted successfully! 🎉`, 'success');
      
      // celebration on success
      try { celebrate(); } catch (e) { /* ignore if unavailable */ }
    } catch (error) {
      notify('Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isAnswered = (q) => {
    const a = answers[q._id];
    const t = (q.test || '').toString().toLowerCase();
    // Slider-based tests: RIASEC (5-point), Personality (5-point), EI (7-point)
    // All require explicit user selection, so undefined means not answered
    if (t === 'riasec') return a !== undefined;
    if (t === 'personality') return a !== undefined;
    if (t === 'ei') return a !== undefined;
    // Aptitude uses MCQ radio buttons - undefined or empty/null/0 means not answered
    if (t === 'aptitude') return a !== undefined && a !== '' && a !== 0 && a !== null;
    // Generic fallback for checkbox-based tests
    return a !== undefined && a !== 0;
  };

  const allAnswered = () => {
    if (!questions || !questions.length) return false;
    return questions.every(q => isAnswered(q));
  };

  const jumpTo = (idx) => {
    const qId = questions[idx]._id;
    setVisitedQuestions(prev => ({ ...prev, [qId]: true }));
    setCurrentIndex(idx);
  };

  // If the user has already completed this specific test, show completed state
  const hasCompletedThisTest = profile?.testResults?.some(r => r.test === testKey);
  if (hasCompletedThisTest && !result) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-5xl mb-3">✓</div>
        <h3 className="text-2xl font-bold mb-2">Assessment Completed</h3>
        <p className="text-gray-600">View your results on the Dashboard</p>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div></div>;

  if (!loading && questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-2xl font-bold mb-2">No questions found for this test</h3>
          <p className="text-gray-600 mb-4">This test currently has no questions on the server.</p>
        </div>
      </div>
    );
  }

  // Show instructions screen before starting the test
  if (showInstructions && !result) {
    // Test-specific instructions
    const getInstructions = () => {
      switch (testKey) {
        case 'RIASEC':
          return {
            icon: '🎯',
            title: 'Holland Career Code Assessment',
            subtitle: 'What Sparks your Interest?',
            fullText: `This assessment is designed to help you understand your interests, strengths, and preferred ways of working.

There are no right or wrong answers—respond honestly based on what you enjoy or feel comfortable doing. Your responses will help identify career paths that align with your natural inclinations and engineering interests. The results are meant for self-reflection and career planning, not for evaluation or grading.

Please answer all questions thoughtfully to gain the most meaningful insights from the assessment.`
          };
        case 'Personality':
          return {
            icon: '😊',
            title: 'Warwick–Edinburgh Mental Wellbeing Scale',
            subtitle: null,
            fullText: `This assessment is designed to understand your general mental wellbeing and positive feelings. It focuses on thoughts, emotions, and experiences related to everyday life.

There are no right or wrong answers—please respond honestly based on how you have been feeling recently.

Please read each statement carefully and choose the option that best reflects your experience and your feelings in the past 2 weeks.`
          };
        case 'EI':
          return {
            icon: '💭',
            title: 'Trait Emotional Intelligence Questionnaire (TEIQue)',
            subtitle: null,
            fullText: `This questionnaire is designed to understand how you typically perceive, express, and manage your emotions.

There are no right or wrong answers—please respond based on what best reflects you, not what you think is expected.

Your responses will help in gaining insights into emotional strengths and areas for personal development.`
          };
        case 'Aptitude':
          return {
            icon: '🛡️',
            title: 'Student Resilience Survey (SRS)',
            subtitle: null,
            fullText: `This survey is designed to understand how you respond to challenges, stress, and change in your academic and personal life.

There are no right or wrong answers—please respond honestly based on your usual experiences.

Your responses will help identify strengths and areas where additional support may be helpful.`
          };
        default:
          return {
            icon: '📋',
            title: 'Assessment',
            subtitle: null,
            fullText: 'Please answer all questions honestly and thoughtfully.'
          };
      }
    };

    const inst = getInstructions();

    return (
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 md:p-10">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-indigo-200">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{inst.icon}</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              {inst.title}
            </h2>
            {inst.subtitle && (
              <p className="text-base sm:text-xl text-indigo-700 font-semibold italic mt-2">{inst.subtitle}</p>
            )}
          </div>

          {/* Main Content */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white border-l-4 border-indigo-600 rounded-xl p-4 sm:p-6 mb-5 sm:mb-6 shadow-sm">
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-gray-800 font-medium">
                {inst.fullText}
              </p>
            </div>

            {/* Key Points Section - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                <div className="text-2xl sm:text-3xl sm:mb-2">✓</div>
                <div>
                  <p className="text-sm font-semibold text-green-800">Honest Responses</p>
                  <p className="text-xs text-green-700 mt-0.5 sm:mt-1">Be truthful and authentic</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                <div className="text-2xl sm:text-3xl sm:mb-2">⏱️</div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">Take Your Time</p>
                  <p className="text-xs text-blue-700 mt-0.5 sm:mt-1">No time pressure</p>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                <div className="text-2xl sm:text-3xl sm:mb-2">🎯</div>
                <div>
                  <p className="text-sm font-semibold text-purple-800">Self-Discovery</p>
                  <p className="text-xs text-purple-700 mt-0.5 sm:mt-1">Meaningful insights</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 mb-5 sm:mb-6">
              <p className="text-sm text-yellow-900 flex items-start gap-2">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <span><strong>Important:</strong> There are no right or wrong answers. Your honest responses will provide the most accurate and meaningful results.</span>
              </p>
            </div>
          </div>

          {/* Ready Checkbox */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 sm:p-5 mb-5 sm:mb-6 border border-indigo-300">
            <label className="flex items-center cursor-pointer gap-3">
              <input
                type="checkbox"
                checked={readyToStart}
                onChange={(e) => setReadyToStart(e.target.checked)}
                className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm sm:text-base text-gray-800 font-medium">
                I have read and understood the instructions above
              </span>
            </label>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={() => setShowInstructions(false)}
              disabled={!readyToStart}
              className={`w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg ${
                readyToStart
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 cursor-pointer hover:shadow-xl active:scale-[0.98]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {readyToStart ? (
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>Start Test</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              ) : (
                'Check the box to continue'
              )}
            </button>
            <p className="text-xs text-gray-600 mt-3">You can always go back to review these instructions later</p>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    if (testKey === 'EI') {
      const factors = result.factors || {};
      const factorFeedback = result.factorFeedback || {};
      const globalScore = result.globalScore || 0;
      const globalLevel = result.globalLevel || 'Average';
      const globalFeedback = result.globalFeedback || '';

      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-green-500 text-white rounded-xl p-8 text-center">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-3xl font-bold">Emotional Intelligence Assessment Complete</h2>
            <div className="text-lg mt-4 font-semibold">Global EI Score: <span className="text-2xl">{globalScore.toFixed(2)}</span> / 7.0</div>
            <div className="text-sm mt-2 opacity-90 font-semibold">Level: {globalLevel}</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bold mb-4 text-center">Your EI Factor Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(factors).map(([factor, score]) => {
                const fb = factorFeedback[factor] || {};
                const scoreLevelColor = fb.level === 'High' ? 'text-green-600' : fb.level === 'Low' ? 'text-red-600' : 'text-yellow-600';
                const bgColor = fb.level === 'High' ? 'bg-green-50' : fb.level === 'Low' ? 'bg-red-50' : 'bg-yellow-50';
                const borderColor = fb.level === 'High' ? 'border-green-200' : fb.level === 'Low' ? 'border-red-200' : 'border-yellow-200';
                return (
                  <div key={factor} className={`${bgColor} border-2 ${borderColor} rounded-lg p-4`}>
                    <h4 className="text-lg font-bold mb-2">{factor}</h4>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className={`text-3xl font-bold ${scoreLevelColor}`}>{score.toFixed(2)}</span>
                      <span className={`text-sm font-semibold ${scoreLevelColor}`}>{fb.level}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{fb.feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
            <h4 className="font-bold text-indigo-800 text-lg mb-2">Overall Emotional Intelligence Profile</h4>
            <p className="text-sm text-indigo-700 leading-relaxed">{globalFeedback}</p>
          </div>
        </div>
      );
    }

    if (testKey === 'Personality') {
      const score = result.score || 0;
      const questionCount = result.questionCount || questions.length;
      const interpretation = result.interpretation || '';
      const feedback = result.feedback || '';
      
      // Determine score range text
      let scoreRange = '';
      if (questionCount >= 14) {
        scoreRange = `WEMWBS (14-item): ${score}/70`;
      } else {
        scoreRange = `SWEMWBS (7-item): ${score}/35`;
      }

      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-green-500 text-white rounded-xl p-8 text-center">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-3xl font-bold">Personality Assessment Complete</h2>
            <div className="text-sm mt-2 opacity-90">{scoreRange}</div>
            <div className="text-lg mt-2 font-semibold">{interpretation}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Feedback & Recommendations</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{feedback}</div>
          </div>
        </div>
      );
    }

    if (testKey === 'Aptitude') {
      const score = result.score || result.correct || 0;
      const total = result.total || result.totalQuestions || questions.length || 0;
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-green-500 text-white rounded-xl p-8 text-center">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-3xl font-bold">Aptitude Test Complete</h2>
            <div className="text-sm mt-1 opacity-90">Score: {score} / {total}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Summary</h3>
            <div className="text-sm text-gray-700">You answered {score} out of {total} correctly.</div>
          </div>
        </div>
      );
    }

    // Fallback / RIASEC-style display
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-green-500 text-white rounded-xl p-8 text-center">
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="text-3xl font-bold">Assessment Complete!</h2>
          {testKey && <div className="text-sm mt-1 opacity-90">Test: {testKey}</div>}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Your Results</h3>
          <div className="bg-indigo-50 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-indigo-800 mb-1">Primary Career Type</h4>
            <p className="text-2xl font-bold text-indigo-600">{result.primaryCareer}</p>
          </div>
          <div className="space-y-2 mb-4">
            {(result.topThree || []).map((area, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <span className="font-semibold">#{idx + 1}: {area}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">Preferred Tasks & Activities</h4>
            <div className="grid grid-cols-1 gap-2">
              {(result.recommendedCareers || []).map((task, idx) => (
                <div key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const testTitle = testKey || 'Assessment';
  const hasAnswer = answers[currentQuestion._id] !== undefined;
  const isQuestionVisited = visitedQuestions[currentQuestion._id] === true;
  const showUnansweredWarning = isQuestionVisited && !hasAnswer;
  const currentAnswer = (testKey === 'RIASEC' || testKey === 'Personality')
    ? (hasAnswer ? answers[currentQuestion._id] : 3)
    : (testKey === 'EI')
    ? (hasAnswer ? answers[currentQuestion._id] : 4)
    : (hasAnswer ? answers[currentQuestion._id] : 0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const sliderLabelsRIASEC = [
    { value: 1, label: 'Strongly Disagree', short: 'SD' },
    { value: 2, label: 'Disagree', short: 'D' },
    { value: 3, label: 'Neutral', short: 'N' },
    { value: 4, label: 'Agree', short: 'A' },
    { value: 5, label: 'Strongly Agree', short: 'SA' }
  ];

  const sliderLabelsEI = [
    { value: 1, label: 'Completely Disagree', short: 'CD' },
    { value: 2, label: 'Disagree', short: 'D' },
    { value: 3, label: 'Somewhat Disagree', short: 'SD' },
    { value: 4, label: 'Neutral', short: 'N' },
    { value: 5, label: 'Somewhat Agree', short: 'SA' },
    { value: 6, label: 'Agree', short: 'A' },
    { value: 7, label: 'Completely Agree', short: 'CA' }
  ];

  // Personality Inventory scale as requested: None → Rarely → Some → Often → All of the time
  const sliderLabelsPersonality = [
    { value: 1, label: 'None of the time', short: 'None' },
    { value: 2, label: 'Rarely', short: 'Rare' },
    { value: 3, label: 'Some of the time', short: 'Some' },
    { value: 4, label: 'Often', short: 'Often' },
    { value: 5, label: 'All of the time', short: 'All' }
  ];

  return (
    <div className="max-w-5xl mx-auto md:flex md:items-start md:gap-6">
      <div className="flex-1">
      {/* Progress Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">{testTitle}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 sm:px-3 py-1 rounded-full">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500">{answeredCount} answered</p>
          <p className="text-xs text-gray-500">{questions.length - answeredCount} remaining</p>
        </div>
      </div>

      {/* Question Card */}
      <div className={`bg-white rounded-2xl shadow-lg p-5 sm:p-8 animate-slideUp ${showUnansweredWarning ? 'ring-2 ring-red-400 bg-red-50/50' : ''}`}>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base ${showUnansweredWarning ? 'bg-red-500 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'}`}>
              {currentQuestion.questionNumber}
            </div>
            <div className="flex-1 pt-1 sm:pt-2">
              <p className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed">{currentQuestion.text}</p>
              {showUnansweredWarning && (
                <p className="text-sm text-red-600 mt-2 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please answer this question
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Slider/Options Section */}
        <div className="mb-6 sm:mb-8">
          {testKey === 'RIASEC' ? (
            <div className="relative px-1 sm:px-4">
              {/* Mobile Legend - Only visible on small screens */}
              <div className="sm:hidden mb-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center font-medium mb-2">What each option means:</p>
                <div className="grid grid-cols-5 gap-1 text-xs text-gray-600 text-center">
                  <div><strong>SD</strong><br/>Strongly Disagree</div>
                  <div><strong>D</strong><br/>Disagree</div>
                  <div><strong>N</strong><br/>Neutral</div>
                  <div><strong>A</strong><br/>Agree</div>
                  <div><strong>SA</strong><br/>Strongly Agree</div>
                </div>
              </div>
              {/* Clickable scale buttons for mobile */}
              <div className="flex justify-between mb-4">
                {sliderLabelsRIASEC.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleSliderChange(item.value)}
                    className={`flex-1 mx-0.5 sm:mx-1 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      hasAnswer && currentAnswer === item.value
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="hidden sm:block">{item.label}</span>
                    <span className="sm:hidden">{item.short}</span>
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={currentAnswer}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                onClick={handleRangeClick}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider hidden sm:block ${!hasAnswer ? 'range-no-thumb' : ''}`}
              />
            </div>
          ) : testKey === 'Personality' ? (
            <div className="relative px-1 sm:px-4">
              {/* Mobile Legend for Personality - Only visible on small screens */}
              <div className="sm:hidden mb-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center font-medium mb-2">What each option means:</p>
                <div className="grid grid-cols-5 gap-1 text-xs text-gray-600 text-center">
                  <div><strong>None</strong><br/>None of the time</div>
                  <div><strong>Rare</strong><br/>Rarely</div>
                  <div><strong>Some</strong><br/>Some of the time</div>
                  <div><strong>Often</strong><br/>Often</div>
                  <div><strong>All</strong><br/>All of the time</div>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                {sliderLabelsPersonality.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleSliderChange(item.value)}
                    className={`flex-1 mx-0.5 sm:mx-1 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      hasAnswer && currentAnswer === item.value
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="hidden sm:block">{item.label}</span>
                    <span className="sm:hidden">{item.short}</span>
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={currentAnswer}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                onClick={handleRangeClick}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider hidden sm:block ${!hasAnswer ? 'range-no-thumb' : ''}`}
              />
            </div>
          ) : testKey === 'EI' ? (
            <div className="relative px-1 sm:px-2">
              {/* Mobile Legend for EI - Only visible on small screens */}
              <div className="sm:hidden mb-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center font-medium mb-2">What each option means:</p>
                <div className="grid grid-cols-4 gap-1 text-xs text-gray-600 text-center mb-1">
                  <div><strong>CD</strong><br/>Completely Disagree</div>
                  <div><strong>D</strong><br/>Disagree</div>
                  <div><strong>SD</strong><br/>Somewhat Disagree</div>
                  <div><strong>N</strong><br/>Neutral</div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs text-gray-600 text-center">
                  <div><strong>SA</strong><br/>Somewhat Agree</div>
                  <div><strong>A</strong><br/>Agree</div>
                  <div><strong>CA</strong><br/>Completely Agree</div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 sm:flex sm:justify-between mb-4">
                {sliderLabelsEI.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleSliderChange(item.value)}
                    className={`py-2 sm:py-3 px-1 sm:px-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all sm:flex-1 sm:mx-1 ${
                      hasAnswer && currentAnswer === item.value
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="hidden sm:block text-xs">{item.label}</span>
                    <span className="sm:hidden">{item.short}</span>
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={currentAnswer}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                onClick={handleRangeClick}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider hidden sm:block ${!hasAnswer ? 'range-no-thumb' : ''}`}
              />
            </div>
          ) : testKey === 'Aptitude' ? (
            <div className="space-y-2 sm:space-y-3">
              {(currentQuestion.options && currentQuestion.options.length) ? (
                currentQuestion.options.map((opt, idx) => (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers[currentQuestion._id] === opt
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`opt_${currentQuestion._id}`} 
                      checked={answers[currentQuestion._id] === opt} 
                      onChange={() => setAnswers(prev => ({ ...prev, [currentQuestion._id]: opt }))} 
                      className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600"
                    />
                    <span className="text-sm sm:text-base text-gray-700">{opt}</span>
                  </label>
                ))
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">No options configured for this aptitude question.</div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 cursor-pointer transition-all">
                <input type="checkbox" checked={!!currentAnswer} onChange={(e) => handleCheckboxChange(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="text-sm sm:text-base">Mark as applicable / true</span>
              </label>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-gray-100">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-medium disabled:opacity-40 hover:bg-gray-200 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered() || submitting}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Submitting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
      </div>
      
      {/* Desktop Sidebar: question status */}
      <div className="w-44 hidden md:block flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-800">Questions</h4>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500" title="Answered"></span>
              <span className="w-3 h-3 rounded-full bg-red-400" title="Skipped"></span>
              <span className="w-3 h-3 rounded-full bg-gray-200 border" title="Not visited"></span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const answered = isAnswered(q);
              const visited = visitedQuestions[q._id];
              const isCurrent = idx === currentIndex;
              const status = answered ? 'answered' : (visited ? 'visited-unanswered' : 'unvisited');
              const bg = isCurrent 
                ? 'ring-2 ring-indigo-500 ring-offset-1 bg-indigo-100 text-indigo-700'
                : status === 'answered' 
                  ? 'bg-green-500 text-white shadow-sm' 
                  : status === 'visited-unanswered' 
                    ? 'bg-red-400 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
              return (
                <button 
                  key={q._id} 
                  onClick={() => jumpTo(idx)} 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${bg}`} 
                  title={`Q ${q.questionNumber}`}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="font-semibold text-green-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className="font-semibold text-gray-600">{questions.length - answeredCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Question Navigator - Fixed at bottom above nav */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-3 pb-2 safe-bottom">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Quick Jump</span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>{answeredCount}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span>{questions.length - answeredCount}</span>
            </div>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {questions.map((q, idx) => {
              const answered = isAnswered(q);
              const visited = visitedQuestions[q._id];
              const isCurrent = idx === currentIndex;
              const status = answered ? 'answered' : (visited ? 'visited-unanswered' : 'unvisited');
              const bg = isCurrent 
                ? 'ring-2 ring-indigo-500 bg-indigo-100 text-indigo-700'
                : status === 'answered' 
                  ? 'bg-green-500 text-white' 
                  : status === 'visited-unanswered' 
                    ? 'bg-red-400 text-white' 
                    : 'bg-gray-100 text-gray-600';
              return (
                <button 
                  key={q._id} 
                  onClick={() => jumpTo(idx)} 
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${bg}`}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentSettings() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${API_URL}/change-password`, { oldPassword, newPassword });
      setMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Account Settings</h2>
            <p className="text-sm text-gray-500">Manage your password and security</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                placeholder="Enter current password"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                placeholder="Enter new password"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>
          
          {message && (
            <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [view, setView] = useState('students');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setView('students')}
          className={`px-6 py-2 rounded-lg font-medium shadow-md transition ${view === 'students' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Student Management
        </button>
        <button
          onClick={() => setView('questions')}
          className={`px-6 py-2 rounded-lg font-medium shadow-md transition ${view === 'questions' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Question Bank
        </button>
      </div>
      {view === 'students' && <StudentsManagement />}
      {view === 'questions' && <QuestionsManagement />}
    </div>
  );
}

function StudentsManagement() {
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ rollNumber: '', name: '', year: '', password: '' });
  const [studentFile, setStudentFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riasecFilter, setRiasecFilter] = useState('ALL');
  const [uploadProgress, setUploadProgress] = useState(null); // { current, total, created, updated, skipped }
  const { notify, confirm } = useNotification();

  useEffect(() => {
    fetchStudents();
    fetchTests();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/students`);
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_URL}/tests`);
      setTests(res.data || []);
    } catch (err) {
      // fallback to known tests if needed
      setTests([{ key: 'RIASEC', name: 'RIASEC' }]);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    const ok = await confirm(`Delete student ${name} completely? This cannot be undone.`);
    if (!ok) return;
    try {
      await axios.delete(`${API_URL}/admin/students/${id}`);
      setStudents(students.filter(s => s._id !== id));
      notify('Student deleted successfully', 'success');
    } catch (error) {
      notify('Failed to delete student', 'error');
    }
  };

  const handleResetAssessmentForTest = async (id, name, testKey) => {
    const ok = await confirm(`Reset assessment for ${name} (${testKey})?`);
    if (!ok) return;
    try {
      await axios.post(`${API_URL}/admin/students/${id}/reset-assessment`, { test: testKey });
      fetchStudents();
      notify(`Assessment for ${testKey} reset successfully`, 'success');
    } catch (error) {
      notify('Failed to reset assessment', 'error');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = { rollNumber: newStudent.rollNumber, name: newStudent.name, password: newStudent.password || 'student', year: newStudent.year };
      const res = await axios.post(`${API_URL}/admin/students`, payload);
      setStudents(prev => [res.data, ...prev]);
      setNewStudent({ rollNumber: '', name: '', year: '', password: '' });
      setShowAddStudent(false);
      notify('Student added', 'success');
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to add student', 'error');
    }
  };

  const handleStudentFileChange = (e) => {
    setStudentFile(e.target.files[0]);
  };

  const handleUploadStudents = async () => {
    if (!studentFile) return notify('Select a file first', 'error');
    
    const fd = new FormData();
    fd.append('file', studentFile);
    
    // Reset progress
    setUploadProgress({ current: 0, total: 0, created: 0, updated: 0, skipped: 0 });
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/students/upload`, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Upload failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) {
                // Upload complete
                setUploadProgress(null);
                setStudentFile(null);
                notify(`Upload complete: ${data.details.created} created, ${data.details.updated} updated, ${data.details.skipped} skipped`, 'success');
                fetchStudents();
              } else {
                // Progress update
                setUploadProgress({
                  current: data.current,
                  total: data.total,
                  created: data.created,
                  updated: data.updated,
                  skipped: data.skipped
                });
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      setUploadProgress(null);
      notify(err.message || 'Upload failed', 'error');
    }
  };
  const downloadResult = (student, result) => {
    let reportLines = [];
    reportLines.push(`CAREER ASSESSMENT REPORT`);
    reportLines.push(``);
    reportLines.push(`Student Information:`);
    reportLines.push(`- Name: ${student.name}`);
    reportLines.push(`- Roll Number: ${student.rollNumber}`);
    reportLines.push(`- Assessment Date: ${result?.completedAt ? new Date(result.completedAt).toLocaleString() : 'N/A'}`);
    reportLines.push(`- Test Type: ${result?.test || 'N/A'}`);
    reportLines.push(``);

    if (result?.test === 'RIASEC') {
      reportLines.push(`Result (RIASEC Career Assessment):`);
      reportLines.push(`- Primary Career Type: ${result?.primaryCareer || 'N/A'}`);
      reportLines.push(`- Top Three Types: ${result?.topThree?.join(', ') || 'N/A'}`);
      reportLines.push(``);
      reportLines.push(`Score Breakdown:`);
      Object.entries(result?.scores || {}).forEach(([code, score]) => {
        reportLines.push(`- ${code}: ${score} / 35`);
      });
      if (result?.recommendedCareers && result.recommendedCareers.length > 0) {
        reportLines.push(``);
        reportLines.push(`Recommended Careers:`);
        result.recommendedCareers.forEach(c => reportLines.push(`- ${c}`));
      }
    } else if (result?.test === 'EI') {
      reportLines.push(`Result (Emotional Intelligence - TEIQue-SF):`);
      const globalScore = result?.globalScore;
      const globalLevel = result?.globalLevel;
      
      if (globalScore !== undefined && globalScore !== null) {
        const scoreNum = typeof globalScore === 'number' ? globalScore : parseFloat(globalScore);
        reportLines.push(`- Global EI Score: ${scoreNum.toFixed(2)} / 7.0`);
      } else {
        reportLines.push(`- Global EI Score: Data not available`);
      }
      
      if (globalLevel) {
        reportLines.push(`- Level: ${globalLevel}`);
      }
      
      reportLines.push(``);
      reportLines.push(`Factor Scores:`);
      
      const factorData = result?.factorFeedback || result?.factors || {};
      if (Object.keys(factorData).length > 0) {
        Object.entries(factorData).forEach(([factor, data]) => {
          const scoreValue = typeof data === 'object' && data.score ? data.score : data;
          const numScore = typeof scoreValue === 'number' ? scoreValue : parseFloat(scoreValue);
          if (!isNaN(numScore)) {
            reportLines.push(`- ${factor}: ${numScore.toFixed(2)} / 7.0`);
          } else {
            reportLines.push(`- ${factor}: Data not available`);
          }
        });
      } else {
        reportLines.push(`- Factor data not available`);
      }
      
      if (result?.globalFeedback) {
        reportLines.push(``);
        reportLines.push(`Overall Assessment:`);
        reportLines.push(result.globalFeedback);
      }
    } else if (result?.test === 'Personality') {
      reportLines.push(`Result (Personality Inventory):`);
      const score = result?.score ?? result?.total ?? result?.correct ?? 'N/A';
      const qCount = result?.questionCount || 0;
      const range = qCount >= 14 ? 70 : 35;
      reportLines.push(`- Score: ${score} / ${range}`);
      reportLines.push(`- Scale: ${qCount >= 14 ? 'WEMWBS (14-item)' : 'SWEMWBS (7-item)'}`);
      if (result?.interpretation) reportLines.push(`- Interpretation: ${result.interpretation}`);
      if (result?.feedback) {
        reportLines.push(``);
        reportLines.push(`Feedback:`);
        reportLines.push(result.feedback);
      }
    } else if (result?.test === 'Aptitude') {
      reportLines.push(`Result (Aptitude Test):`);
      const score = result?.score ?? result?.correct ?? 0;
      const total = result?.total ?? result?.totalQuestions ?? 'N/A';
      reportLines.push(`- Score: ${score} / ${total}`);
      reportLines.push(`- Correct Answers: ${score}`);
    } else {
      reportLines.push(`Result: ${result?.test || 'Unknown'} test - Data available`);
    }

    const report = reportLines.join('\n');
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.rollNumber}_${result?.test || 'result'}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div></div>;

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = student.rollNumber.toLowerCase().includes(query) || student.name.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (riasecFilter === 'ALL') return true;

    // find latest RIASEC result
    const latestRIASEC = (student.testResults || []).slice().reverse().find(tr => tr.test === 'RIASEC');
    if (!latestRIASEC) return riasecFilter === 'NONE';
    let primaryCode = null;
    if (latestRIASEC.topThree && latestRIASEC.topThree.length) {
      primaryCode = latestRIASEC.topThree[0].split(' ')[0];
    } else if (latestRIASEC.scores) {
      const entry = Object.entries(latestRIASEC.scores).sort(([,a],[,b]) => b - a)[0];
      primaryCode = entry ? entry[0] : null;
    }
    if (!primaryCode) return false;
    return primaryCode.toUpperCase() === riasecFilter;
  });

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Student Management</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-200">
            <p className="text-xs font-semibold text-blue-700">TOTAL</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 sm:p-4 border border-green-200">
            <p className="text-xs font-semibold text-green-700">COMPLETED</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{students.filter(s => s.hasCompletedTest).length}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 sm:p-4 border border-yellow-200">
            <p className="text-xs font-semibold text-yellow-700">PENDING</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{students.filter(s => !s.hasCompletedTest).length}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 sm:p-4 border border-purple-200">
            <p className="text-xs font-semibold text-purple-700">RESULTS</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{students.reduce((sum, s) => sum + (s.testResults?.length || 0), 0)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
          <button 
            onClick={() => setShowAddStudent(s => !s)} 
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${showAddStudent ? 'bg-gray-600 text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg'}`}
          >
            {showAddStudent ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add Student
              </>
            )}
          </button>
          
          {/* Upload Section - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center gap-2 flex-1">
            <input 
              type="file" 
              accept=".xlsx,.csv" 
              onChange={handleStudentFileChange} 
              className="text-sm file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:font-medium hover:file:bg-gray-200 flex-1" 
              disabled={uploadProgress !== null} 
            />
            <button 
              onClick={handleUploadStudents} 
              disabled={uploadProgress !== null} 
              className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${uploadProgress !== null ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
            >
              {uploadProgress !== null ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress !== null && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 animate-fadeIn">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-bold text-blue-700">{uploadProgress.current}/{uploadProgress.total}</span>
                <span className="text-blue-600 text-xs">
                  {uploadProgress.created} new, {uploadProgress.updated} updated
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddStudent && (
          <form onSubmit={handleAddStudent} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-5 rounded-xl mb-4 border border-indigo-200 animate-fadeIn">
            <h3 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add New Student
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Roll Number *</label>
                <input 
                  required 
                  value={newStudent.rollNumber} 
                  onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})} 
                  placeholder="e.g., MB001" 
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                <input 
                  required 
                  value={newStudent.name} 
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} 
                  placeholder="Student Name" 
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Year</label>
                <input 
                  value={newStudent.year} 
                  onChange={(e) => setNewStudent({...newStudent, year: e.target.value})} 
                  placeholder="1st, 2nd, etc." 
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <input 
                  value={newStudent.password} 
                  onChange={(e) => setNewStudent({...newStudent, password: e.target.value})} 
                  placeholder="Default: student" 
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm" 
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Student
              </button>
            </div>
          </form>
        )}

        <div className="mb-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Roll Number or Name..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-3">
            <select
              value={riasecFilter}
              onChange={(e) => setRiasecFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="ALL">All RIASEC</option>
              <option value="NONE">No RIASEC result</option>
              <option value="R">Realistic (R)</option>
              <option value="I">Investigative (I)</option>
              <option value="A">Artistic (A)</option>
              <option value="S">Social (S)</option>
              <option value="E">Enterprising (E)</option>
              <option value="C">Conventional (C)</option>
            </select>
            <button 
              onClick={async () => {
                try {
                  const response = await axios.get(`${API_URL}/admin/download-all-results`, {
                    responseType: 'blob'
                  });
                  const url = URL.createObjectURL(response.data);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'All_Students_Results.xlsx';
                  a.click();
                  URL.revokeObjectURL(url);
                  notify('Results downloaded successfully!', 'success');
                } catch (error) {
                  notify('Failed to download results', 'error');
                  console.error(error);
                }
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold whitespace-nowrap"
              title="Download all students' results as Excel"
            >
              📥 Download All Results
            </button>
          </div>
        </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Roll No</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Career Type</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredStudents.map(student => {
              const latestResult = student.testResults && student.testResults.length ? student.testResults[student.testResults.length - 1] : null;
              return (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">{student.rollNumber}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">
                    {student.hasCompletedTest ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Completed</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {latestResult ? (
                      <div className="space-y-2 text-xs">
                        {latestResult.test === 'RIASEC' ? (
                          <>
                            <div className="grid grid-cols-3 gap-2">
                              {['R','I','A','S','E','C'].map(code => {
                                const score = latestResult.scores?.[code] || 0;
                                const maxScore = 35;
                                const pct = Math.round((score / maxScore) * 100);
                                return (
                                  <div key={code} className="flex items-center gap-1">
                                    <div className="w-6 text-sm font-semibold text-indigo-700">{code}</div>
                                    <div className="flex-1">
                                      <div className="text-xs text-gray-500">{score}/{maxScore}</div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-0.5">
                                        <div className={`bg-indigo-500 h-1.5 rounded-full`} style={{ width: `${pct}%` }}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-gray-500">Top: {latestResult.topThree?.map(t => t.split(' ')[0]).join(', ')}</div>
                          </>
                        ) : latestResult.test === 'Personality' ? (
                          <>
                            <div className="font-semibold text-indigo-600">
                              Score: {latestResult.score || latestResult.total || '—'} / {latestResult.questionCount >= 14 ? 70 : 35}
                            </div>
                            <div className="text-gray-600">{latestResult.interpretation || 'Assessment completed'}</div>
                          </>
                        ) : latestResult.test === 'Aptitude' ? (
                          <>
                            <div className="font-semibold text-indigo-600">
                              Score: {latestResult.score || latestResult.correct || 0} / {latestResult.total || latestResult.totalQuestions || '—'}
                            </div>
                          </>
                        ) : latestResult.test === 'EI' ? (
                          <>
                            <div className="font-semibold text-teal-600">
                              Global EI: {latestResult.globalScore !== undefined && latestResult.globalScore !== null ? (typeof latestResult.globalScore === 'number' ? latestResult.globalScore.toFixed(2) : latestResult.globalScore) : '—'} / 7.0
                            </div>
                            <div className="text-gray-600">Level: {latestResult.globalLevel || '—'}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(() => {
                                const factorData = latestResult.factorFeedback || latestResult.factors || {};
                                const factorCount = Object.keys(factorData).length;
                                return factorCount > 0 ? `${factorCount} factors assessed` : 'Factors available';
                              })()}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">{latestResult.test} - Test completed</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Not available</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {latestResult && (
                        <button
                          onClick={() => downloadResult(student, latestResult)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold"
                          title="Download Report"
                        >
                          Download
                        </button>
                      )}
                      <div className="flex items-center gap-2">
                        {tests.map(t => {
                          const has = (student.testResults || []).some(tr => tr.test === t.key);
                          return (
                            <button
                              key={t.key}
                              onClick={() => handleResetAssessmentForTest(student._id, student.name, t.key)}
                              disabled={!has}
                              className={`px-3 py-1 rounded text-xs font-semibold ${has ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                              title={has ? `Reset ${t.name}` : `No ${t.name} result to reset`}
                            >
                              Reset {t.key}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setViewingStudent(student)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold"
                        title="View Results"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id, student.name)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
                        title="Delete Student"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No students found</div>
          ) : (
            filteredStudents.map(student => {
              const latestResult = student.testResults && student.testResults.length ? student.testResults[student.testResults.length - 1] : null;
              return (
                <div key={student._id} className="p-4 hover:bg-gray-50">
                  {/* Student Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                        {student.name?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{student.name}</div>
                        <div className="text-xs text-indigo-600 font-mono">{student.rollNumber}</div>
                      </div>
                    </div>
                    {student.hasCompletedTest ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex-shrink-0">✓ Done</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex-shrink-0">Pending</span>
                    )}
                  </div>

                  {/* Latest Result Summary */}
                  {latestResult && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-700">{latestResult.test}</span>
                        {latestResult.test === 'RIASEC' && latestResult.topThree && (
                          <span className="text-indigo-600 font-medium">Top: {latestResult.topThree.slice(0,2).map(t => t.split(' ')[0]).join(', ')}</span>
                        )}
                        {latestResult.test === 'Personality' && (
                          <span className="text-purple-600 font-medium">Score: {latestResult.score || '—'}</span>
                        )}
                        {latestResult.test === 'Aptitude' && (
                          <span className="text-blue-600 font-medium">Score: {latestResult.score || latestResult.correct || 0}/{latestResult.total || '—'}</span>
                        )}
                        {latestResult.test === 'EI' && (
                          <span className="text-teal-600 font-medium">EI: {latestResult.globalScore?.toFixed(1) || '—'}/7</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setViewingStudent(student)}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    {latestResult && (
                      <button
                        onClick={() => downloadResult(student, latestResult)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteStudent(student._id, student.name)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Viewing modal for a selected student (inside StudentsManagement scope) */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Results for {viewingStudent.name}</h3>
              <button onClick={() => setViewingStudent(null)} className="text-gray-500 px-2 py-1">Close</button>
            </div>
            {viewingStudent.testResults && viewingStudent.testResults.length ? (
              <div className="space-y-3 max-h-72 overflow-auto">
                {viewingStudent.testResults.map((r, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-1">{r.test}</div>
                        <div className="text-sm text-gray-500 mb-3">Completed: {new Date(r.completedAt).toLocaleString()}</div>
                        
                        {r.test === 'RIASEC' ? (
                          <>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              {['R','I','A','S','E','C'].map(code => {
                                const score = r.scores?.[code] || 0;
                                const maxScore = 35;
                                const pct = Math.round((score / maxScore) * 100);
                                return (
                                  <div key={code} className="p-2 bg-white rounded border">
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                      <div className="font-semibold">{code}</div>
                                      <div>{score}/{maxScore}</div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div className={`bg-indigo-500 h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-sm text-gray-600">Top Matches: {r.topThree?.map(t => t.split(' - ')[0]).join(', ')}</div>
                          </>
                        ) : r.test === 'Personality' ? (
                          <>
                            <div className="bg-white rounded border p-3 mb-2">
                              <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Score:</span> {r.score || r.total || '—'} / {r.questionCount >= 14 ? 70 : 35}</div>
                              <div className="text-sm text-gray-700"><span className="font-semibold">Scale:</span> {r.questionCount >= 14 ? 'WEMWBS (14-item)' : 'SWEMWBS (7-item)'}</div>
                              <div className="text-sm text-indigo-600 mt-2 font-semibold">{r.interpretation}</div>
                              {r.feedback && <div className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">{r.feedback}</div>}
                            </div>
                          </>
                        ) : r.test === 'Aptitude' ? (
                          <>
                            <div className="bg-white rounded border p-3">
                              <div className="text-sm text-gray-700"><span className="font-semibold">Score:</span> {r.score || r.correct || 0} / {r.total || r.totalQuestions || '—'}</div>
                              <div className="text-sm text-gray-600 mt-2">Correct Answers: {r.score || r.correct || 0}</div>
                            </div>
                          </>
                        ) : r.test === 'EI' ? (
                          <>
                            <div className="bg-white rounded border p-3 mb-2">
                              <div className="mb-3 pb-3 border-b">
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">Global EI Score:</span> <span className="text-lg font-bold text-teal-600">{r.globalScore !== undefined && r.globalScore !== null ? (typeof r.globalScore === 'number' ? r.globalScore.toFixed(2) : r.globalScore) : '—'}</span> / 7.0
                                </div>
                                <div className="text-sm text-gray-700 mt-1">
                                  <span className="font-semibold">Level:</span> <span className="font-semibold text-indigo-600">{r.globalLevel || '—'}</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="text-xs font-semibold text-gray-600 mb-2">FACTOR BREAKDOWN</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {(() => {
                                    const factorData = r.factorFeedback || r.factors || {};
                                    return Object.entries(factorData).map(([factor, data]) => {
                                      const scoreValue = typeof data === 'object' && data.score ? data.score : data;
                                      const levelValue = typeof data === 'object' && data.level ? data.level : '';
                                      const displayScore = typeof scoreValue === 'number' ? scoreValue.toFixed(2) : (isNaN(parseFloat(scoreValue)) ? '—' : parseFloat(scoreValue).toFixed(2));
                                      const levelColor = levelValue === 'High' ? 'text-green-600' : levelValue === 'Low' ? 'text-red-600' : 'text-yellow-600';
                                      const bgColor = levelValue === 'High' ? 'bg-green-50' : levelValue === 'Low' ? 'bg-red-50' : 'bg-yellow-50';
                                      return (
                                        <div key={factor} className={`${bgColor} p-2 rounded text-xs border`}>
                                          <div className="font-semibold text-gray-700">{factor}</div>
                                          <div className={`font-bold ${levelColor}`}>{displayScore}/7.0</div>
                                          {levelValue && <div className="text-gray-600">{levelValue}</div>}
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}

                      </div>
                      <div className="flex-shrink-0">
                        <button onClick={() => downloadResultForUser(r, viewingStudent)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold whitespace-nowrap">Download</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600">No test results available for this student.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionsManagement() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ questionNumber: '', text: '', category: 'R', test: 'RIASEC', options: '', correctAnswer: '' });
  const [questionFile, setQuestionFile] = useState(null);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('RIASEC');
  const { notify, confirm } = useNotification();

  // Helper to get default category based on test type
  const getDefaultCategory = (testKey) => {
    switch (testKey) {
      case 'RIASEC': return 'R';
      case 'EI': return 'Well-being';
      case 'Personality': return 'Personality';
      default: return 'General';
    }
  };

  const fetchQuestions = React.useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/questions`, { params: { test: selectedTest } });
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [selectedTest]);

  const fetchTests = React.useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/tests`);
      setTests(res.data || []);
      if (res.data && res.data.length && !selectedTest) {
        setSelectedTest(res.data[0].key);
      }
    } catch (err) {
      console.error('Failed to fetch tests for admin', err);
    }
  }, [selectedTest]);

  useEffect(() => {
    fetchTests();
    fetchQuestions();
  }, [fetchTests, fetchQuestions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure `test` is always present in the payload (fallback to selectedTest)
      const payload = { ...formData, test: formData.test || selectedTest };
      // If aptitude, normalize options into array and include correctAnswer
      if ((payload.test === 'Aptitude' || payload.test === 'aptitude') && payload.options) {
        // split on comma or semicolon and trim
        payload.options = payload.options.split(/[,;]\s*/).map(s => s.trim()).filter(Boolean);
      }
      if (editing) {
        await axios.put(`${API_URL}/questions/${editing._id}`, payload);
        notify('Updated successfully', 'success');
      } else {
        await axios.post(`${API_URL}/questions`, payload);
        notify('Added successfully', 'success');
      }
      // Reset form but keep the test pre-selected to the current domain
      setFormData({ questionNumber: '', text: '', category: getDefaultCategory(selectedTest), test: selectedTest });
      setShowForm(false);
      setEditing(null);
      fetchQuestions();
    } catch (error) {
      notify('Failed to save', 'error');
    }
  };

  const handleEdit = (q) => {
    setFormData({ questionNumber: q.questionNumber, text: q.text, category: q.category, test: q.test || 'RIASEC', options: (q.options || []).join(', '), correctAnswer: q.correctAnswer || '' });
    setEditing(q);
    setShowForm(true);
  };

  const handleDelete = async (id, num) => {
    const ok = await confirm(`Delete question ${num}?`);
    if (!ok) return;
    try {
      await axios.delete(`${API_URL}/questions/${id}`);
      setQuestions(questions.filter(q => q._id !== id));
      notify('Deleted successfully', 'success');
    } catch (error) {
      notify('Failed to delete', 'error');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div></div>;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Question Bank</h2>
            
            {/* Mobile: Dropdown selector for test domains */}
            <div className="md:hidden w-full">
              <select
                value={selectedTest}
                onChange={(e) => {
                  const testKey = e.target.value;
                  setSelectedTest(testKey);
                  setLoading(true);
                  setShowForm(false);
                  setEditing(null);
                  setFormData({ questionNumber: '', text: '', category: getDefaultCategory(testKey), test: testKey });
                  (async () => {
                    try {
                      const resp = await axios.get(`${API_URL}/questions`, { params: { test: testKey } });
                      setQuestions(resp.data);
                    } catch (err) {
                      console.error('Failed to fetch questions for test', testKey, err);
                    } finally {
                      setLoading(false);
                    }
                  })();
                }}
                className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-xl bg-indigo-50 text-indigo-800 font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              >
                {tests.map(t => (
                  <option key={t.key} value={t.key}>{t.name} ({t.questionCount || 0})</option>
                ))}
              </select>
            </div>
            
            {/* Desktop: Tab buttons for test domains */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex gap-2">
                {tests.map(t => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setSelectedTest(t.key);
                      setLoading(true);
                      setShowForm(false);
                      setEditing(null);
                      setFormData({ questionNumber: '', text: '', category: getDefaultCategory(t.key), test: t.key });
                      (async (testKey) => {
                        try {
                          const resp = await axios.get(`${API_URL}/questions`, { params: { test: testKey } });
                          setQuestions(resp.data);
                        } catch (err) {
                          console.error('Failed to fetch questions for test', testKey, err);
                        } finally {
                          setLoading(false);
                        }
                      })(t.key);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedTest === t.key ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    {t.key} <span className="text-xs opacity-75">({t.questionCount || 0})</span>
                  </button>
                ))}
              </div>
              
              {/* Desktop file upload */}
              <input type="file" accept=".xlsx,.csv" onChange={(e) => setQuestionFile(e.target.files[0])} className="hidden md:block text-sm" id="questionFileInput" />

              <button onClick={async () => {
                if (!questionFile) {
                  document.getElementById('questionFileInput').click();
                  return;
                }
                const fd = new FormData();
                fd.append('file', questionFile);
                fd.append('test', selectedTest || formData.test || 'RIASEC');
                try {
                  await axios.post(`${API_URL}/admin/questions/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                  notify('Questions uploaded successfully', 'success');
                  setQuestionFile(null);
                  fetchQuestions();
                } catch (err) {
                  notify(err.response?.data?.error || 'Upload failed', 'error');
                }
              }} className="hidden md:block px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all">
                {questionFile ? '📤 Upload' : '📁 Select File'}
              </button>

              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) {
                    setEditing(null);
                    setFormData({ questionNumber: '', text: '', category: getDefaultCategory(selectedTest), test: selectedTest });
                  } else {
                    setFormData({ questionNumber: '', text: '', category: getDefaultCategory(selectedTest), test: selectedTest });
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${showForm ? 'bg-gray-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
              >
                {showForm ? '✕ Cancel' : '+ Add'}
              </button>
            </div>
          </div>
          
          {/* Question count indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="font-semibold text-indigo-600">{questions.length}</span> questions in 
            <span className="font-semibold text-indigo-600">{selectedTest}</span>
          </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 bg-indigo-50 p-5 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-sm">Question Number</label>
                <input
                  type="number"
                  value={formData.questionNumber}
                  onChange={(e) => setFormData({...formData, questionNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-sm">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg outline-none"
                >
                  {formData.test === 'RIASEC' ? (
                    <>
                      <option value="R">R - Realistic</option>
                      <option value="I">I - Investigative</option>
                      <option value="A">A - Artistic</option>
                      <option value="S">S - Social</option>
                      <option value="E">E - Enterprising</option>
                      <option value="C">C - Conventional</option>
                    </>
                  ) : formData.test === 'EI' ? (
                    <>
                      <option value="Well-being">Well-being</option>
                      <option value="Self-control">Self-control</option>
                      <option value="Emotionality">Emotionality</option>
                      <option value="Sociability">Sociability</option>
                      <option value="Global">Global</option>
                    </>
                  ) : formData.test === 'Personality' ? (
                    <>
                      <option value="Personality">Personality</option>
                    </>
                  ) : (
                    <>
                      <option value="General">General</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">Question Text</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg outline-none"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">Test / Domain</label>
              <select
                value={formData.test}
                onChange={(e) => {
                  const newTest = e.target.value;
                  setFormData({...formData, test: newTest, category: getDefaultCategory(newTest)});
                }}
                className="w-full px-3 py-2 border rounded-lg outline-none"
              >
                {/* Always show all available test domains */}
                <option value="RIASEC">RIASEC Career Assessment</option>
                <option value="Personality">Personality Inventory (WEMWBS)</option>
                <option value="EI">Emotional Intelligence (TEIQue)</option>
                <option value="Aptitude">Aptitude Test</option>
              </select>
            </div>
            {/* Options + correct answer for Aptitude type */}
            {(formData.test === 'Aptitude' || formData.test === 'aptitude') && (
              <div>
                <label className="block font-semibold mb-1 text-sm">Options (comma or semicolon separated)</label>
                <input value={formData.options} onChange={(e) => setFormData({...formData, options: e.target.value})} placeholder="Option1, Option2, Option3" className="w-full px-3 py-2 border rounded-lg outline-none" />
                <label className="block font-semibold mt-3 mb-1 text-sm">Correct Answer (exact option text)</label>
                <input value={formData.correctAnswer} onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})} placeholder="Correct option text" className="w-full px-3 py-2 border rounded-lg outline-none" />
              </div>
            )}
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold">
              {editing ? 'Update' : 'Add'} Question
            </button>
          </form>
        )}

        <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="font-semibold text-blue-800 text-sm">Total Questions: {questions.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Question</th>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {questions.map(q => (
              <tr key={q._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{q.questionNumber}</td>
                <td className="px-4 py-3">{q.text}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">{q.category}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(q)} className="bg-indigo-500 text-white px-3 py-1 rounded text-xs font-semibold">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(q._id, q.questionNumber)} className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default App;