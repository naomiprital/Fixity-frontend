import { useState } from 'react';
import { FixityWordmark } from '../../../shared/brand/FixityWordmark';
import { LockIcon, MailIcon, UserIcon } from '../../../shared/icons/AuthIcons';
import { TextField } from '../../../shared/ui/TextField';
import './AuthPage.css';

type AuthTab = 'login' | 'signup';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

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
                onClick={() => setActiveTab('login')}
              >
                Log In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'signup'}
                className={activeTab === 'signup' ? 'is-active' : ''}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'login' ? (
              <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
                <TextField
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="name@email.com"
                  autoComplete="email"
                  icon={<MailIcon />}
                />
                <TextField
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="........"
                  autoComplete="current-password"
                  icon={<LockIcon />}
                />
                <button className="auth-form__submit" type="submit">
                  Log In
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
                <div className="auth-form__name-row">
                  <TextField id="first-name" label="First Name" placeholder="Your first name" icon={<UserIcon />} />
                  <TextField id="last-name" label="Last Name" placeholder="Your last name" icon={<UserIcon />} />
                </div>
                <TextField
                  id="new-email"
                  type="email"
                  label="Email"
                  placeholder="name@email.com"
                  autoComplete="email"
                  icon={<MailIcon />}
                />
                <TextField
                  id="new-password"
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  icon={<LockIcon />}
                />
                <button className="auth-form__submit" type="submit">
                  Create Account
                </button>
              </form>
            )}
          </section>
        </div>
    </main>
  );
}
