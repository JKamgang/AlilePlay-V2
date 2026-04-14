
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  // Make children optional to resolve potential 'missing children' errors.
  children?: ReactNode;
}

interface State {
  // Define state interface for the error boundary.
  hasError: boolean;
}

// Fixed: Explicitly extending Component from 'react' ensures correct inheritance of React class properties like setState and props.
class ErrorBoundary extends Component<Props, State> {
  // Explicitly define state for better type inference.
  public state: State = {
    hasError: false
  };

  // Update state so the next render will show the fallback UI when an error is thrown.
  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // Lifecycle method for logging error information.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console for debugging.
    console.error('Uncaught error:', error, errorInfo);
  }

  // Method to reset the error state, using the inherited setState.
  handleReset = () => {
    // Fixed: Correctly accessing inherited setState from the Component base class.
    this.setState({ hasError: false });
  };

  render() {
    // state is inherited from the base Component class.
    if (this.state.hasError) {
      // Render fallback UI when an error is caught.
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg text-dark-text p-4">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
          <p className="text-lg text-center">An unexpected error occurred. Please try again to continue.</p>
          <button
            onClick={this.handleReset}
            className="mt-6 px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Fixed: Correctly accessing inherited props from the Component base class.
    return this.props.children;
  }
}

export default ErrorBoundary;
