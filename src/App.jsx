import { useState, useEffect } from 'react';
import OrderPage from './components/OrderPage';
import BaristaPage from './components/BaristaPage';
import WaiterPage from './components/WaiterPage';
import TeaLadyPage from './components/TeaLadyPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', handleLocationChange);

    // Override pushState and replaceState to detect navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Simple routing
  if (currentPath === '/barista') {
    return <BaristaPage />;
  }

  if (currentPath === '/tealady') {
    return <TeaLadyPage />;
  }

  if (currentPath === '/waiter') {
    return <WaiterPage />;
  }

  return <OrderPage />;
}

export default App;
