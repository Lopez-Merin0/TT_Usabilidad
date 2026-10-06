import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Mundo-Gen/api';
import { AUTH_MESSAGES, SLOW_SERVER_DELAY_MS, getAuthErrorMessage } from './authMessages';
import { AuthMessage, FieldError } from './AuthMessage';

const { registerUser } = api; 

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const slowServerTimer = useRef(null);
  const redirectTimer = useRef(null);

  useEffect(() => () => {
    clearTimeout(slowServerTimer.current);
    clearTimeout(redirectTimer.current);
  }, []);

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = AUTH_MESSAGES.usernameEmpty;
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = AUTH_MESSAGES.emailEmpty;
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = AUTH_MESSAGES.emailInvalid;
      isValid = false;
    }

    if (!password) {
      newErrors.password = AUTH_MESSAGES.passwordEmpty;
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = AUTH_MESSAGES.passwordShort;
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = AUTH_MESSAGES.passwordsDontMatch;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage(null);
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    // En el plan gratuito de Render el backend tarda en despertar
    slowServerTimer.current = setTimeout(() => setMessage(AUTH_MESSAGES.serverWaking), SLOW_SERVER_DELAY_MS);
    try {
      const userData = { email, username, password };
      console.log('Enviando registro para:', userData.email);
      
      const result = await registerUser(userData); 
      console.log('Resultado del registro:', result);
      
      clearTimeout(slowServerTimer.current);
      setMessage(AUTH_MESSAGES.registerSuccess);
      
      redirectTimer.current = setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      console.error('Error completo en registro:', error);
      setMessage(getAuthErrorMessage(error, 'register'));
    } finally {
      clearTimeout(slowServerTimer.current);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="relative z-10 w-full max-w-lg mx-auto p-4 sm:p-6 kawaii-layout-bg text-center">
        <div className="mb-4">
          <h1 className="kawaii-header text-4xl sm:text-5xl">Join the Town</h1>
        </div>

        <div className="kawaii-panel p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4 text-[var(--kawaii-text-dark)]">Sign up to learn!</h2>

          <AuthMessage message={message} />

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
                <FieldError error={errors.username} />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="kawaii-input w-3/4 mx-auto"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FieldError error={errors.email} />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  className="kawaii-input w-3/4 mx-auto"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FieldError error={errors.password} />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="kawaii-input w-3/4 mx-auto"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FieldError error={errors.confirmPassword} />
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
