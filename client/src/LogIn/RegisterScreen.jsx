import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Mundo-Gen/api';
import { AUTH_MESSAGES, SLOW_SERVER_DELAY_MS, getAuthErrorMessage } from './authMessages';
import { AuthMessage, FieldError, FieldRule } from './AuthMessage';

const { registerUser } = api;

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /\S+@\S+\.\S+/;

// Errores de cada campo con los valores actuales (null = sin error)
const getFieldErrors = ({ username, email, password, confirmPassword }) => ({
  username: !username.trim() ? AUTH_MESSAGES.usernameEmpty : null,
  email: !email.trim()
    ? AUTH_MESSAGES.emailEmpty
    : !EMAIL_PATTERN.test(email) ? AUTH_MESSAGES.emailInvalid : null,
  password: !password
    ? AUTH_MESSAGES.passwordEmpty
    : password.length < MIN_PASSWORD_LENGTH ? AUTH_MESSAGES.passwordShort : null,
  confirmPassword: !confirmPassword || password !== confirmPassword ? AUTH_MESSAGES.passwordsDontMatch : null,
});

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  // Un campo se valida en cuanto el usuario sale de él (o al intentar enviar)
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const slowServerTimer = useRef(null);
  const redirectTimer = useRef(null);

  useEffect(() => () => {
    clearTimeout(slowServerTimer.current);
    clearTimeout(redirectTimer.current);
  }, []);

  const fieldErrors = getFieldErrors(values);
  const showErrorFor = (name) => (touched[name] || submitted) && fieldErrors[name];
  const isValid = Object.values(fieldErrors).every((error) => error === null);

  const handleChange = (name) => (e) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleBlur = (name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Estado de cada restricción visible: neutral mientras no ha escrito nada
  const ruleState = (name, ok) => {
    if (ok && values[name]) return 'ok';
    if (touched[name] || submitted) return 'error';
    return 'neutral';
  };

  const inputClass = (name) =>
    `kawaii-input${!fieldErrors[name] && values[name] ? ' is-valid' : ''}`;

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage(null);
    setSubmitted(true);

    if (!isValid) return;

    const { username, email, password } = values;

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

  const passwordLength = values.password.length;

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="relative z-10 w-full max-w-lg mx-auto p-4 sm:p-6 kawaii-layout-bg text-center">
        <div className="mb-4">
          <h1 className="kawaii-header text-4xl sm:text-5xl">Join the Town</h1>
        </div>

        <div className="kawaii-panel p-4 sm:p-6">
          <h2 className="text-lg font-bold mb-4 text-[var(--kawaii-text-dark)]">Sign up to learn!</h2>

          <AuthMessage message={message} />

          <form onSubmit={handleRegister} noValidate>
            <div className="space-y-3 mb-6">
              <div className="auth-field">
                <label className="auth-label" htmlFor="register-username">
                  Username <span className="auth-label__es">Nombre de usuario</span>
                </label>
                <input
                  id="register-username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. alex123"
                  className={inputClass('username')}
                  value={values.username}
                  onChange={handleChange('username')}
                  onBlur={handleBlur('username')}
                  aria-invalid={Boolean(showErrorFor('username'))}
                  aria-describedby="register-username-rule"
                />
                <FieldRule
                  id="register-username-rule"
                  state={ruleState('username', !fieldErrors.username)}
                  en="Required. This name appears in the game."
                  es="Obligatorio. Este nombre aparece en el juego."
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="register-email">
                  Email <span className="auth-label__es">Correo electrónico</span>
                </label>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@mail.com"
                  className={inputClass('email')}
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  aria-invalid={Boolean(showErrorFor('email'))}
                  aria-describedby="register-email-rule"
                />
                {showErrorFor('email') && values.email ? (
                  <FieldError error={fieldErrors.email} />
                ) : (
                  <FieldRule
                    id="register-email-rule"
                    state={ruleState('email', !fieldErrors.email)}
                    en="A valid email, like name@mail.com"
                    es="Un correo válido, como nombre@correo.com"
                  />
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="register-password">
                  Password <span className="auth-label__es">Contraseña</span>
                </label>
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass('password')}
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  aria-invalid={Boolean(showErrorFor('password'))}
                  aria-describedby="register-password-rule"
                />
                <FieldRule
                  id="register-password-rule"
                  state={ruleState('password', !fieldErrors.password)}
                  en={`At least ${MIN_PASSWORD_LENGTH} characters (${passwordLength}/${MIN_PASSWORD_LENGTH})`}
                  es={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
                />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="register-confirm">
                  Confirm password <span className="auth-label__es">Confirma la contraseña</span>
                </label>
                <input
                  id="register-confirm"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass('confirmPassword')}
                  value={values.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  aria-invalid={Boolean(showErrorFor('confirmPassword'))}
                  aria-describedby="register-confirm-rule"
                />
                <FieldRule
                  id="register-confirm-rule"
                  state={ruleState('confirmPassword', !fieldErrors.confirmPassword)}
                  en="Must be the same as the password"
                  es="Debe ser igual a la contraseña"
                />
              </div>
            </div>

            {submitted && !isValid && (
              <p className="auth-rule auth-rule--error" style={{ justifyContent: 'center', marginBottom: '8px' }}>
                Please fix the fields marked with ✗. <span className="auth-rule__es">Corrige los campos marcados con ✗.</span>
              </p>
            )}

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
