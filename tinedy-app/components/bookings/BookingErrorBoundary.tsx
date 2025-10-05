'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component for Booking Module
 *
 * Catches JavaScript errors anywhere in the booking component tree
 * and displays a fallback UI instead of crashing the whole application.
 *
 * Usage:
 * ```tsx
 * <BookingErrorBoundary>
 *   <BookingComponent />
 * </BookingErrorBoundary>
 * ```
 */
export class BookingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('BookingErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">
                  เกิดข้อผิดพลาด
                </h3>
                <p className="text-sm text-red-800 mb-4">
                  ขออภัย เกิดข้อผิดพลาดในระหว่างการดำเนินการ
                  กรุณาลองใหม่อีกครั้งหรือติดต่อทีมสนับสนุนหากปัญหายังคงเกิดขึ้น
                </p>
                {this.state.error && (
                  <details className="text-xs text-red-700 mb-4">
                    <summary className="cursor-pointer font-medium mb-1">
                      รายละเอียดข้อผิดพลาด
                    </summary>
                    <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={this.handleReset}
                  className="w-full"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  ลองใหม่อีกครั้ง
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BookingErrorBoundary;
