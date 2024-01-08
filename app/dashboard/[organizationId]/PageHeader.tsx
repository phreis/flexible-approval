import { PropsWithChildren } from 'react';
import styles from './PageHeader.module.scss';

type Props = {
  heading: string;
  toolBox?: React.ReactNode;
};

export default function PageHeader(props: PropsWithChildren<Props>) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTop}>
        <h1>{props.heading}</h1>
        {props.toolBox}
      </div>
      <div className={styles.headerBottom}>{props.children}</div>
    </div>
  );
}
