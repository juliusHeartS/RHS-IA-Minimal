# Bundled Extensions

VSIX files in this directory are installed as built-in desktop extensions on every supported operating system. VSIX files in `mac/` are included only in macOS builds, and files in `windows/` are included only in Windows builds.

Use stable filenames so an extension can be updated by replacing one file. The build reads the extension ID and version from `extension/package.json`, calculates the SHA-256 checksum, and rejects duplicate extension IDs.

Run `npm run validate-bundled-extensions` on the target build machine before compiling RHS-IA. To inspect another operating system explicitly, pass its Node.js platform name, for example `npm run validate-bundled-extensions -- --platform win32`. Large VSIX files are tracked with Git LFS.
