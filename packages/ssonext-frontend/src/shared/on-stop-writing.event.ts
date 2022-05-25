import { debounce } from './throttle.util';

export function stopWriting(node) {
  const handleKeyup = debounce((event: KeyboardEvent) => {
    if (node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent('stopWriting'));
    }
  }, 500);

  document.addEventListener('keyup', handleKeyup, true);

  return {
    destroy() {
      document.removeEventListener('keyup', handleKeyup, true);
    }
  };
}
