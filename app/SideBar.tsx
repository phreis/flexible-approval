import Link from 'next/link';
import React from 'react';
import { logout } from './lib/actions';
import { getUserLoggedIn } from './lib/utils';
import styles from './SideBar.module.scss';

export default async function SideBar() {
  const user = await getUserLoggedIn();
  return (
    <aside>
      <div className={styles.sideBarTopLogo}>topLogo</div>
      <nav className={styles.nav}>
        <div className={styles.sideBarTop}>
          <Link href="/">Home</Link>
          <Link href="/team">Team</Link>
          <Link href="/scenarios">Scenarios</Link>
        </div>
        <div className={styles.sideBarBottom}>
          {user ? (
            <span className={styles.loginLogout}>
              {user.username}
              <form action={logout}>
                <button className={styles.logoutButton}>Logout </button>
              </form>
            </span>
          ) : (
            <span className={styles.loginLogout}>
              <Link href="/register">Sign up</Link>
              <Link href="/login">Login</Link>{' '}
            </span>
          )}
        </div>
      </nav>
    </aside>
  );
}
