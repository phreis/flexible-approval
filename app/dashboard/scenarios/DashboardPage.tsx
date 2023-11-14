import React from 'react';
import PageContent from '../PageContent';
import PageHeader from '../PageHeader';
import PageHeaderTabs, { TabType } from '../PageHeaderTabs';

type Props = {
  heading: string;
  tabs: TabType[];
  activeTab: string | undefined;
  children: React.ReactNode;
};

export default function DashboardPage(props: Props) {
  return (
    <>
      <PageHeader heading={props.heading}>
        <PageHeaderTabs tabs={props.tabs} activeTab={props.activeTab} />
      </PageHeader>
      <PageContent>{props.children}</PageContent>
    </>
  );
}
