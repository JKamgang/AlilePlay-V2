import React, { Component, ErrorInfo, ReactNode } from "react";
import { TRANSLATIONS } from '@/shared/lib/i18n/translations';

interface Props {
  children: ReactNode;
  t: (key: keyof typeof TRANSLATIONS.en | string) => string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // fix: Cast 'this' to any to resolve "Property 'props' does not exist on type 'ErrorBoundary'" in some TS environments
      const { t } = (this as any).props;
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
          <div className="text-center p-4">
            <h1 className="text-2xl font-bold mb-4">{t('error_boundary_title')}</h1>
            <p>{t('error_boundary_message')}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {t('refresh')}
            </button>
          </div>
        </div>
      );
    }

    // fix: Cast 'this' to any to resolve "Property 'props' does not exist on type 'ErrorBoundary'"
    return (this as any).props.children;
  }
}

export default ErrorBoundary;