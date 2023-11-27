import { PropsWithChildren } from 'react';
import styles from './PageHeader.module.scss';

type Props = {
  heading: string;
};

export default function PageHeader(props: PropsWithChildren<Props>) {
  return (
    <section>
      <div className={styles.headerContainer}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopLeft}>
            <h1>{props.heading}</h1>
          </div>
        </div>
        <div className={styles.headerBottom}>{props.children}</div>
      </div>
    </section>
  );
}
