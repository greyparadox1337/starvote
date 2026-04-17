import React from 'react';
import { Header } from './components/layout/Header';
import { ParticleBackground } from './components/layout/ParticleBackground';
import { PollCard } from './components/poll/PollCard';
import { TxStatusBar } from './components/transaction/TxStatusBar';
import { TxHistory } from './components/transaction/TxHistory';
import { Github } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 bg-white p-10 text-xl font-bold">ERROR: {this.state.error?.message}</div>;
    }
    return this.props.children || null; 
  }
}

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col relative text-white selection:bg-accent/30 font-sans">
        <ParticleBackground />
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 lg:py-16 relative z-10 flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-8 flex flex-col">
            <PollCard />
            <TxHistory />
          </div>

        </main>

        <TxStatusBar />
        
        <footer className="mt-auto border-t border-white/10 p-6 bg-dark-900/80 backdrop-blur-md relative z-10">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-white/50 text-sm">
            <span>&copy; {new Date().getFullYear()} StarVote Stellar DApp. Built with Soroban.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-accent transition-colors flex items-center gap-1">
                <Github className="w-4 h-4" /> Github
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
