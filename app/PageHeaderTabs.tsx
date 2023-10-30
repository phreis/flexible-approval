import React, { useState } from 'react';
import styles from './PageHeader.module.scss';

export type TabType = {
  tabTitle: string;
  tabId: string;
};

type Props = {
  tabs: TabType[];
  activeTab?: string;
};

export default function PageHeadeTabs(props: Props) {
  return (
    <>
      {props.tabs.map((tab) => {
        return (
          <a
            key={`key-${tab.tabId}`}
            className={`${styles.navLink} ${
              tab.tabId === props.activeTab && styles.navLinkActive
            }`}
            href={`?tab=${tab.tabId}`}
          >
            {tab.tabTitle}
          </a>
        );
      })}
    </>
  );
}
