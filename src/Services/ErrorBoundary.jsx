/* eslint-disable */
import { Component } from 'react';
import Error from '../Components/Mobile/Error/Error';

class ErrorBoundary extends Component {
  
  state = {
    hasError: false,
    error: { message: '', stack: '' },
    info: { componentStack: '' },
  };
  
  static getDerivedStateFromError = () => {
    return { hasError: true };
  };
  
  componentDidCatch = (error, info) => {
    this.setState({ error, info });
  };
  
  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? <Error/>: children;
  }
}

export default ErrorBoundary;
