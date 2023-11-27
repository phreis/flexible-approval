import React from 'react';
import styles from './PageHeader.module.scss';

export type TabType = {
  tabTitle: string;
  tabId: string;
  href: string;
};

type Props = {
  tabs: TabType[];
  activeTab?: string;
};

export default function PageHeadeTabs(props: Props) {
  // we take the first tab as active, in case there is not active-tab passed over
  let activeTab: TabType['tabId'];
  if (!props.activeTab) {
    activeTab = props.tabs[0]?.tabId || '';
  } else {
    activeTab = props.activeTab;
  }

  return (
    <>
      {props.tabs.map((tab) => {
        return (
          <a
            key={`key-${tab.tabId}`}
            className={`${styles.navLink} ${
              tab.tabId === activeTab && styles.navLinkActive
            }`}
            href={tab.href}
          >
            {tab.tabTitle}
          </a>
        );
      })}
    </>
  );
}
