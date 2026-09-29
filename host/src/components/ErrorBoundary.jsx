import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="app-error" role="alert">
          <h1>Unable to load this section</h1>
          <p>Please make sure the remote application is running, then refresh this page.</p>
        </section>
      );
    }

    return this.props.children;
  }
}
