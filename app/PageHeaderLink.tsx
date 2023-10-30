'use client';
import { useState } from 'react';
import styles from './PageHeader.module.scss';

type Props = {
  active?: boolean;
  href: string;
  title: string;
  tab: string;
  onClick: (title: string) => void;
};

export default function PageHeaderLink(props: Props) {
  const [isClicked, setIsClicked] = useState(false);

  function onClickHandler(e: React.MouseEvent<HTMLAnchorElement>) {
    // e.preventDefault();
    props.onClick(props.tab);
  }

  return (
    <a
      className={`${styles.navLink} ${props.active && styles.navLinkActive}`}
      href={props.href}
      onClick={onClickHandler}
    >
      {props.title}
    </a>
  );
}
