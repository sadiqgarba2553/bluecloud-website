# BLUECLOUD API Third-Party Integration Test Client

This dedicated test suite demonstrates how external client applications (mobile apps, web apps, enterprise software) authenticate with BLUECLOUD using API Keys.

## How It Works
1. Open [index.html](./index.html) in your browser (or visit `/api-test/index.html` on the website).
2. Enter any API Key generated from your [BLUECLOUD Developer Portal](/developers).
3. Click **"Send Live API Request"**.
4. The test app queries your live **Firebase Cloud Firestore** database (`api_keys` collection):
   - **Valid Key**: Increments request count in Firestore, returns HTTP 200 JSON payload with AI execution data.
   - **Invalid Key**: Rejects request with HTTP 401 Unauthorized API error.
