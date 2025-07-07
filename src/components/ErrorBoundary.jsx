import React from "react";
import Icon from "./AppIcon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // You can add error reporting here (e.g., Sentry)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="text-center p-8 max-w-md w-full">
            <div className="flex justify-center items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 32 33" fill="none">
                <path d="M16 28.5C22.6274 28.5 28 23.1274 28 16.5C28 9.87258 22.6274 4.5 16 4.5C9.37258 4.5 4 9.87258 4 16.5C4 23.1274 9.37258 28.5 16 28.5Z" stroke="#DC2626" strokeWidth="2" strokeMiterlimit="10" />
                <path d="M11.5 15.5C12.3284 15.5 13 14.8284 13 14C13 13.1716 12.3284 12.5 11.5 12.5C10.6716 12.5 10 13.1716 10 14C10 14.8284 10.6716 15.5 11.5 15.5Z" fill="#DC2626" />
                <path d="M20.5 15.5C21.3284 15.5 22 14.8284 22 14C22 13.1716 21.3284 12.5 20.5 12.5C19.6716 12.5 19 13.1716 19 14C19 14.8284 19.6716 15.5 20.5 15.5Z" fill="#DC2626" />
                <path d="M21 22.5C19.9625 20.7062 18.2213 19.5 16 19.5C13.7787 19.5 12.0375 20.7062 11 22.5" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col gap-2 text-center mb-6">
              <h1 className="text-2xl font-medium text-neutral-800">Something went wrong</h1>
              <p className="text-neutral-600 text-base">
                The application encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="RefreshCw" size={18} color="#fff" />
                Refresh Page
              </button>
              
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="Home" size={18} color="#fff" />
                Go Home
              </button>
            </div>

            {/* Error Details for Development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                  <div className="text-red-600 font-semibold mb-2">Error:</div>
                  <div className="mb-2">{this.state.error.toString()}</div>
                  {this.state.errorInfo && (
                    <>
                      <div className="text-red-600 font-semibold mb-2">Component Stack:</div>
                      <div>{this.state.errorInfo.componentStack}</div>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;