# Chrome Pro — Third-Party Notices

Chrome Pro is an independent application. The Chrome Pro-owned application code is licensed separately under the project `LICENSE` file.

Chrome Pro also uses third-party software. Those components are not owned by the Chrome Pro project and remain subject to their respective licenses.

## Electron

The desktop browser uses Electron. Electron provides the desktop application runtime and embeds Chromium, Node.js, and related components.

The current desktop package declares Electron `^37.0.0` in `desktop/package.json`.

Electron release information and component versions:
- Electron releases: https://releases.electronjs.org/
- Electron: https://www.electronjs.org/

Electron 37 is based on Chromium 138, according to the official Electron release information.

## Chromium

Chrome Pro uses Chromium through Electron's runtime. Chromium is an open-source browser project and is separate from Google Chrome.

Chromium project:
- https://www.chromium.org/
- https://chromium.googlesource.com/chromium/src/

Chromium and its bundled third-party components have their own copyright and license notices. When distributing Electron applications, retain the applicable notices supplied by the Electron distribution and do not remove third-party license information.

## electron-builder

The desktop packaging configuration uses `electron-builder` to produce installers/packages. Its license and notices are governed by the package distributed through npm.

## npm dependencies

Additional npm packages may be used by the web application and desktop application. Their licenses are determined by their respective package metadata and lockfiles. Before a production redistribution, generate and review a complete dependency license report for the exact build being shipped.

## Important ownership distinction

The use of Electron, Chromium, electron-builder, Node.js, React/Next.js, or other third-party dependencies does not mean Chrome Pro owns those projects. Chrome Pro owns only the original code, assets, branding, documentation, and other materials created for Chrome Pro to the extent permitted by applicable law.

Likewise, this notice does not grant permission to copy or redistribute third-party software beyond the rights provided by each component's own license.

## Distribution checklist

Before publishing a production installer:

1. Keep the Electron/Chromium license and credits information shipped with the Electron runtime.
2. Generate a dependency license report from the exact lockfile/build used for release.
3. Review all direct and transitive dependency licenses.
4. Preserve required copyright and attribution notices.
5. Do not describe Chrome Pro as Google Chrome or as a Google product.
6. Have a qualified legal professional review redistribution requirements if Chrome Pro will be commercially distributed.
