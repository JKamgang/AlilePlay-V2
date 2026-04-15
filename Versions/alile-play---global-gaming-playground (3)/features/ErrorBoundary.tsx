import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Removed 'public' access modifier
  state: State = {
    hasError: false,
  };

  // FIX: Removed 'public' access modifier
  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // FIX: Removed 'public' access modifier
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  // FIX: Removed 'public' access modifier
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg text-dark-text p-4">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
          <p className="text-lg text-center">An unexpected error occurred. Please refresh the page to continue.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;