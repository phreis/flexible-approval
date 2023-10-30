import Link from 'next/link';
import React from 'react';
import styles from './SideBar.module.scss';

export default async function SideBar() {
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
          <Link href="/">Sign up</Link>
          <Link href="/">Login</Link>
        </div>
      </nav>
    </aside>
  );
}
