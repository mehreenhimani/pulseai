import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FeedbackFeed from './pages/FeedbackFeed';
import SignalAnalysis from './pages/SignalAnalysis';
import PriorityMatrix from './pages/PriorityMatrix';
import PRDGenerator from './pages/PRDGenerator';

type Page = 'dashboard' | 'feedback' | 'signals' | 'priority' | 'prd';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'feedback': return <FeedbackFeed />;
      case 'signals': return <SignalAnalysis />;
      case 'priority': return <PriorityMatrix />;
      case 'prd': return <PRDGenerator />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={(page) => setActivePage(page as Page)}>
      {renderPage()}
    </Layout>
  );
}
