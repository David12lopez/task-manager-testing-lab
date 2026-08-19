import type { AccessibilityState } from 'react-native';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveAccessibilityState(state: AccessibilityState): R;
    }
  }
}

export {};
