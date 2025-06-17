import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error tracking service like Sentry
    try {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.log('Error logged to monitoring service:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-obsidian flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center"
          >
            <div className="glass-morphism p-8 md:p-12">
              {/* Error Icon */}
              <div className="w-16 h-16 mx-auto mb-6 border border-red-400 flex items-center justify-center">
                <span className="text-red-400 text-2xl">⚠</span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-arctic mb-4">
                Something Went Wrong
              </h1>
              
              <p className="text-titanium text-lg mb-8">
                We encountered an unexpected error. Our team has been notified and we're working to fix it.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-8 text-left">
                  <summary className="text-champagne cursor-pointer mb-4 font-mono text-sm">
                    Technical Details (Development Only)
                  </summary>
                  <div className="bg-carbon p-4 rounded border text-xs font-mono text-racing-silver overflow-auto max-h-40">
                    <p className="text-red-400 mb-2">{this.state.error.message}</p>
                    <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                    {this.state.errorInfo && (
                      <pre className="mt-4 pt-4 border-t border-graphite">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="btn-performance"
                >
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="btn-ghost"
                >
                  Reload Page
                </button>
                
                <a
                  href="#contact"
                  className="btn-ghost"
                  onClick={() => window.location.hash = 'contact'}
                >
                  Report Issue
                </a>
              </div>

              {/* Additional Help */}
              <div className="mt-8 pt-8 border-t border-graphite">
                <p className="text-racing-silver text-sm">
                  If this issue persists, please{' '}
                  <a 
                    href="#contact" 
                    className="text-champagne hover:text-electric transition-colors"
                    onClick={() => window.location.hash = 'contact'}
                  >
                    contact us directly
                  </a>
                  {' '}or try refreshing the page.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping individual components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Hook for error reporting in functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: string) => {
    console.error('Manual error report:', error, errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      try {
        // Example: Sentry.captureException(error, { extra: { errorInfo } });
        console.log('Error reported:', {
          message: error.message,
          stack: error.stack,
          additionalInfo: errorInfo,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        });
      } catch (loggingError) {
        console.error('Failed to log error:', loggingError);
      }
    }
  };
};