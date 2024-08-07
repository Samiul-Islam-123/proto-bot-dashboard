import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = `pk_test_dmFsaWQtZHJhZ29uLTgxLmNsZXJrLmFjY291bnRzLmRldiQ`

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </Router>
);
