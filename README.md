# Better Island Living v2.1
Configurable replacements. Defaults:
- Bridge -> Chocolate Milk
- Car Park -> Fairy Floss
- Car Parking -> Fairy Floss
- Parking -> Fairy Floss

## Install
chrome://extensions > Developer mode > Load unpacked > select this folder

## Configure
Click extension icon > Edit replacements, or right-click > Options.
Add / edit / delete rows, Save. Changes apply live to open tabs.
Reset to defaults button restores the 4 defaults above.

## How it works
- Longest phrase first (Car Parking beats Parking)
- Case preserved: bridge->chocolate milk, Bridge->Chocolate Milk, BRIDGE->CHOCOLATE MILK
- Plurals: Bridges -> Chocolate Milks, Car Parks -> Fairy Flosses
- Stored in chrome.storage.sync, so it syncs across your Chrome profiles.

## Toggles
Each replacement has an on/off toggle (default: on). Turn one off in Options or in the popup - it stops applying instantly, without deleting it. Disabled rows are greyed out. Old saved settings without a toggle are treated as on.
