import Sidebar from './Sidebar';

interface LayoutProps {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export default function Layout({ activePage, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div style={{ marginLeft: '240px' }} className="min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
