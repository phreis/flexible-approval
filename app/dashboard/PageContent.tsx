import styles from './PageContent.module.scss';

type Props = { children: React.ReactNode };

export default function PageContent(props: Props) {
  return <div className={styles.contentContainer}>{props.children}</div>;
}
