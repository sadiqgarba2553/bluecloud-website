# Tooldeck

BlueCloud's local utility app. Fifteen tools: JSON, Base64, URL, text, password, UUID, SHA-256, QR, PDF merge/extraction/rotation, images to PDF, image resize/conversion, color and timestamps.

From the BlueCloud root: `npm run build:tooldeck`, `npm run desktop:tooldeck`, `npm run package:tooldeck`.

The desktop build bundles dependencies and makes no network requests. Files remain in memory; downloads are saved when selected. Input limits: 100 MB/file, 200 MB total, 2,000 PDF pages/file, 50 MP decoded images. PDF page copying can discard interactive document metadata/forms/signatures. No PDF password removal, OCR or office conversion is advertised. Cancellation discards results; synchronous library work finishes before the event loop can process cancellation.

The previous 57-page implementation is preserved in `archive/tooldeck-original/` for future work. It is excluded from deployment and packaging.
