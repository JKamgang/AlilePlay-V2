
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  // Make children optional to resolve potential 'missing children' errors.
  children?: ReactNode;
}

interface State {
  // Define state interface for the error boundary.
  hasError: boolean;
}

// Explicitly extend React.Component to ensure that 'state', 'setState', and 'props'
// are correctly recognized as inherited members by the TypeScript compiler.
class ErrorBoundary extends React.Component<Props, State> {
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

  // Method to reset the error state, using the inherited setState from React.Component.
  handleReset = () => {
    // Fix: Explicitly use setState which is available on React.Component.
    this.setState({ hasError: false });
  };

  render() {
    // state is inherited from the base React.Component class.
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

    // Fix: Access children via this.props which is inherited from React.Component.
    return this.props.children;
  }
}

export default ErrorBoundary;
