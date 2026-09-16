import fs from 'fs';
import path from 'path';

const destDir = 'c:/Users/admin/Desktop/Nova/frontend/public/assets';
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(
  'C:/Users/admin/.gemini/antigravity-ide/brain/652ce1e0-d009-4fd1-8f6e-001156fe40fc/nova_logo_1789582952676.jpg',
  path.join(destDir, 'nova-logo.jpg')
);
fs.copyFileSync(
  'C:/Users/admin/.gemini/antigravity-ide/brain/652ce1e0-d009-4fd1-8f6e-001156fe40fc/nova_assistant_1789582971379.jpg',
  path.join(destDir, 'nova-assistant.jpg')
);
fs.copyFileSync(
  'C:/Users/admin/.gemini/antigravity-ide/brain/652ce1e0-d009-4fd1-8f6e-001156fe40fc/nova_login_1789582992423.jpg',
  path.join(destDir, 'nova-login.jpg')
);

console.log('Assets copied successfully!');
