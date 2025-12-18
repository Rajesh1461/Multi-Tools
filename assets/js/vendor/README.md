# Vendor JavaScript Libraries

This directory contains third-party JavaScript libraries used by the Multi-Tools application.

## QR Code Library

**File**: `qrcode.min.js`  
**Source**: [node-qrcode](https://github.com/soldair/node-qrcode)  
**Version**: 1.5.1  
**License**: MIT  
**CDN**: https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js

### Usage

The QR Code Generator tool (`/tools/qr-code-generator.html`) uses this library with automatic CDN fallback. The page will:

1. First attempt to load from local copy (works offline)
2. If local fails, try CDN #1 (jsDelivr)
3. If CDN #1 fails, try CDN #2 (unpkg)
4. If all fail, display an error message to the user

### Updating

To update the QR code library to a newer version:

```powershell
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/qrcode@VERSION/build/qrcode.min.js" -OutFile "assets\js\vendor\qrcode.min.js" -UseBasicParsing
```

Replace `VERSION` with the desired version number (e.g., `1.5.3`).

### API Reference

This library provides the following main methods:

- `QRCode.toCanvas(canvas, text, options, callback)` - Generate QR code to canvas element
- `QRCode.toDataURL(text, options, callback)` - Generate QR code as Data URL
- `QRCode.toString(text, options, callback)` - Generate QR code as SVG string

For full documentation, visit: https://github.com/soldair/node-qrcode

### File Size

- **qrcode.min.js**: 23,738 bytes (minified)
