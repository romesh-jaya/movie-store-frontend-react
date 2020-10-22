/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component, ReactNode } from 'react';

const MISSING_ERROR = 'Unknown Error';

interface IProps {
  children: ReactNode;
}

interface IState {
  readonly error: Error | null | undefined;
}

class ErrorBoundary extends Component<IProps, IState> {
  constructor(props : any) {
    super(props);
    this.state = { error: undefined };
  }
  
  componentDidCatch(error :Error | null) : void {    
    // You can also log the error to an error reporting service    
    this.setState({ error: error || new Error(MISSING_ERROR) });
  }

  render() : ReactNode {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {      // You can render any custom fallback UI      
      return (
        <>
          <h1>
            Something went wrong. See details below:
          </h1>
          <div className="error-text">
            { error.message}
          </div>
        </>
      );
    }
    return children; 
  }
}

export default ErrorBoundary;

