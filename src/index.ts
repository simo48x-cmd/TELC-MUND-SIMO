import * as xb from 'xrblocks';
import { TelcSpatialScene } from './xr/TelcSpatialScene';
import { TelcMasterAppUI } from './ui/appUi';

let xrInitialized = false;

export async function ensureXrBooted(spatialScene: TelcSpatialScene): Promise<void> {
  if (xrInitialized) return;
  xrInitialized = true;
  try {
    const options = new xb.Options();
    options.setAppTitle('TELC B2 Mündlich & Karriere Master Pro');
    options.setAppDescription(
      'Interactive 6-Round Ping-Pong Speaking Studio & 3D TELC Examination Arena for Mohammed El Jebouri'
    );
    xb.add(spatialScene);
    await xb.init(options);
  } catch (err) {
    console.warn('XR Blocks simulator initialization skipped or unavailable in current environment:', err);
  }
}

function bootstrapApp(): void {
  const rootEl = document.getElementById('app-studio-root') || document.getElementById('root');
  if (!rootEl) return;

  const spatialScene = new TelcSpatialScene();
  const appUi = new TelcMasterAppUI(rootEl, spatialScene);
  appUi.mount();

  if (new URLSearchParams(window.location.search).get('xr') === '1') {
    void ensureXrBooted(spatialScene);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
