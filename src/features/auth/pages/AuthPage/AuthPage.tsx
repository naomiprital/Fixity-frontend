import { useState, type ChangeEvent, type FormEvent } from 'react';
import { signIn, signUp } from '../../api/authApi';
import { FixityWordmark } from '../../../../shared/brand/FixityWordmark';
import { LockIcon, MailIcon, UserIcon } from '../../../../shared/icons/AuthIcons';
import { TextField } from '../../../../shared/ui/TextField';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';

type AuthTab = 'login' | 'signup';

type LoginFormState = {
  email: string;
  password: string;
};

type SignUpFormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const AUTH_STORAGE_KEY = 'fixity.auth';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState<SignUpFormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  function persistAuthSession(payload: Awaited<ReturnType<typeof signIn>>) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  }

  function handleLoginChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSignUpChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setSignUpForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleTabChange(tab: AuthTab) {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    navigate("/home")


    // try {
    //   const response = await signIn(loginForm);
    //   persistAuthSession(response);
    //   setSuccessMessage(`Welcome back, ${response.user.firstName}.`);
    // } catch (error) {
    //   setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in');
    // } finally {
    //   setIsSubmitting(false);
    // }
  }

  async function handleSignUpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await signUp(signUpForm);
      persistAuthSession(response);
      setSuccessMessage(`Account created for ${response.user.firstName} ${response.user.lastName}.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create account');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page__layout">
        <header className="auth-page__hero">
          <div className="auth-page__brand-pill">
            <FixityWordmark />
          </div>
          <p className="auth-page__tagline">Better City. Together.</p>
        </header>

        <section className="auth-page__card" aria-label="Authentication">
          <div className="auth-page__tabs" role="tablist" aria-label="Authentication forms">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'login'}
              className={activeTab === 'login' ? 'is-active' : ''}
              onClick={() => handleTabChange('login')}
            >
              Log In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'signup'}
              className={activeTab === 'signup' ? 'is-active' : ''}
              onClick={() => handleTabChange('signup')}
            >
              Sign Up
            </button>
          </div>

          {(errorMessage || successMessage) && (
            <div className={`auth-page__status ${errorMessage ? 'is-error' : 'is-success'}`} role="status" aria-live="polite">
              {errorMessage || successMessage}
            </div>
          )}

          {activeTab === 'login' ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="name@email.com"
                autoComplete="email"
                icon={<MailIcon />}
                value={loginForm.email}
                onChange={handleLoginChange}
                disabled={isSubmitting}
              />
              <TextField
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="........"
                autoComplete="current-password"
                icon={<LockIcon />}
                value={loginForm.password}
                onChange={handleLoginChange}
                disabled={isSubmitting}
              />
              <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Log In'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignUpSubmit}>
              <div className="auth-form__name-row">
                <TextField
                  id="first-name"
                  name="firstName"
                  label="First Name"
                  placeholder="Your first name"
                  icon={<UserIcon />}
                  value={signUpForm.firstName}
                  onChange={handleSignUpChange}
                  disabled={isSubmitting}
                />
                <TextField
                  id="last-name"
                  name="lastName"
                  label="Last Name"
                  placeholder="Your last name"
                  icon={<UserIcon />}
                  value={signUpForm.lastName}
                  onChange={handleSignUpChange}
                  disabled={isSubmitting}
                />
              </div>
              <TextField
                id="new-email"
                name="email"
                type="email"
                label="Email"
                placeholder="name@email.com"
                autoComplete="email"
                icon={<MailIcon />}
                value={signUpForm.email}
                onChange={handleSignUpChange}
                disabled={isSubmitting}
              />
              <TextField
                id="new-password"
                name="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                autoComplete="new-password"
                icon={<LockIcon />}
                value={signUpForm.password}
                onChange={handleSignUpChange}
                disabled={isSubmitting}
              />
              <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
