import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // In React Native, we don't need to wait for window.frameworkReady
    // This hook can be used to initialize any necessary framework setup
    // For now, we'll keep it empty as it's not being used for any specific purpose
  }, []); // Empty dependency array since we don't have any dependencies
}
