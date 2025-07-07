import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

// Error boundary for the entire app
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ color: '#DC2626', marginBottom: '16px' }}>Something went wrong</h1>
          <p style={{ color: '#6B7280', marginBottom: '16px', textAlign: 'center' }}>
            The application encountered an error. Please refresh the page or check the console for more details.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1E40AF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', maxWidth: '600px' }}>
              <summary style={{ cursor: 'pointer', color: '#6B7280' }}>Error Details</summary>
              <pre style={{ 
                backgroundColor: '#F3F4F6', 
                padding: '12px', 
                borderRadius: '6px', 
                fontSize: '12px',
                overflow: 'auto',
                marginTop: '8px'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found. Make sure there's a div with id='root' in your HTML.");
}

const root = createRoot(container);

root.render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);