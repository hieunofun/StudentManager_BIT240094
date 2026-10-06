import { OperationError } from '@/types/student';

// A data URL survives reloads; a browser blob URL does not.
export function chooseAvatar(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    function cleanup() { input.remove(); }
    input.addEventListener('cancel', () => { cleanup(); resolve(null); }, { once: true });
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) { cleanup(); resolve(null); return; }
      if (!file.type.startsWith('image/')) { cleanup(); reject(new OperationError('photoSaveFailed')); return; }
      const reader = new FileReader();
      reader.onload = () => { cleanup(); resolve(String(reader.result)); };
      reader.onerror = () => { cleanup(); reject(new OperationError('photoSaveFailed')); };
      reader.readAsDataURL(file);
    }, { once: true });
    input.click();
  });
}
