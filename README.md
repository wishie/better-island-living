# Bridge to Chocolate Milk - Chrome Extension

## Install (Developer Mode)
1. Open Chrome -> chrome://extensions/
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the folder containing these files
5. Visit any site - every "bridge" becomes "chocolate milk"

## Files
- manifest.json - Manifest V3 config
- content.js - Does the replacing, watches for new content loading in

## What it does
- bridge -> chocolate milk
- Bridge -> Chocolate Milk
- BRIDGE -> CHOCOLATE MILK
- bridges -> chocolate milks
- Also updates the page title
- Skips <script>, <style>, <input>, <textarea> so it won't break sites
