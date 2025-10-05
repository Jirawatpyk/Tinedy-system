'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FilterErrorBoundaryProps {
  children: React.ReactNode;
}

interface FilterErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class FilterErrorBoundary extends React.Component<
  FilterErrorBoundaryProps,
  FilterErrorBoundaryState
> {
  constructor(props: FilterErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): FilterErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Filter Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>เกิดข้อผิดพลาดในการกรองข้อมูล</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm mb-3">
              {this.state.error?.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                className="bg-white hover:bg-slate-50"
              >
                ลองอีกครั้ง
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="bg-white hover:bg-slate-50"
              >
                โหลดหน้าใหม่
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
