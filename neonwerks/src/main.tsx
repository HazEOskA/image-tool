import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NightshiftSupplyCase from './pages/NightshiftSupplyCase';
import { LangProvider } from './i18n';
import { useRoute } from './router';
import './index.css';

function Root() {
  const route = useRoute();
  if (route === '/cases/nightshift-supply') return <NightshiftSupplyCase />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LangProvider>
      <Root />
    </LangProvider>
  </React.StrictMode>,
);
