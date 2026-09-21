import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Mundo-Gen/api';

const { registerUser } = api; 

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Username cannot be empty';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email cannot be empty';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email must be a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password cannot be empty';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage('');
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = { email, username, password };
      console.log('Enviando datos de registro:', userData);
      
      const result = await registerUser(userData); 
      console.log('Resultado del registro:', result);
      
      setMessage('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      console.error('Error completo en registro:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        setMessage('Unable to connect to the server. Make sure the backend is running at https://talkie-town-api.onrender.com');
      } else {
        const errorMsg = error.message || 'Unknown registration error.';
        setMessage(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ error }) =>
    error ? (
      <p className="text-red-600 text-xs mt-1 font-semibold text-left mx-auto w-3/4">{error}</p>
    ) : null;

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="relative z-10 w-full max-w-lg mx-auto p-4 sm:p-6 kawaii-layout-bg text-center">
        <div className="mb-4">
          <h1 className="kawaii-header text-4xl sm:text-5xl">Join the Town</h1>
        </div>

        <div className="kawaii-panel p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4 text-[var(--kawaii-text-dark)]">Sign up to learn!</h2>

          {message && (
            <p
              className={`mb-4 text-sm font-semibold p-2 rounded-xl transition duration-300 border ${message.toLowerCase().includes('exitoso')
                  ? 'bg-green-100 border-green-600 text-green-800'
                  : 'bg-red-100 border-red-600 text-red-800'
                }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleRegister}>
            <div className="space-y-3 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="kawaii-input w-3/4 mx-auto"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <ErrorMessage error={errors.username} />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="kawaii-input w-3/4 mx-auto"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <ErrorMessage error={errors.email} />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  className="kawaii-input w-3/4 mx-auto"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <ErrorMessage error={errors.password} />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="kawaii-input w-3/4 mx-auto"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <ErrorMessage error={errors.confirmPassword} />
              </div>
            </div>

            <button type="submit" className="kawaii-button w-full text-base py-2" disabled={loading}>
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>

          <div className="flex justify-center items-center space-x-4 mt-4">
            <button onClick={() => navigate('/login')} className="kawaii-link-button text-sm">
              Already have an account? <br />
              Log In
            </button>

            <button onClick={() => navigate('/')} className="kawaii-link-button text-sm">
              Back to the <br />
              Home screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
