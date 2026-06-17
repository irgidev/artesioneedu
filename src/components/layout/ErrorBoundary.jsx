import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Oops, ada masalah
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Aplikasi mengalami error. Coba muat ulang halaman.
            </p>
            {this.state.error && (
              <pre className="text-xs text-left bg-gray-100 dark:bg-gray-800 p-3 rounded-xl mb-6 overflow-auto max-h-32 text-gray-600 dark:text-gray-400">
                {this.state.error.message}
              </pre>
            )}
            <Button icon={RotateCcw} onClick={this.handleReset}>
              Muat Ulang Aplikasi
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
