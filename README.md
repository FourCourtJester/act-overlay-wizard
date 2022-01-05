# ACT Overlay: Wizard

A suite of FFXIV related helpful resources aimed at improving user action rotations and status/debuff windows.

# How to use

- Install `OverlayPlugin.dll`
- Ensure `OverlayPlguin WSServer` is on and running. Make note of the `IP Address` and `Port` used in `Stream/Local Overlay`
- On `OverlayPlugin.dll`, click `New` to add a new Overlay
- Name it whatever you want, but ensure Preset is set to `Custom` and Type is `MiniParse`
- For your new overlay, add the URL `https://fourcourtjester.github.io/ACT-Overlay-Wizard/#/?OVERLAY_WS=ws://{IP Address}:{Port}/ws`. Substitute the IP Address and Port from the `OverlayPlugin WSServer` fields

Currently the overlay is 1920x1080, so try to position it as close to the top left of your screen as possible, and extend it to the bottom right on a 1080p resolution. While the overlay is unlocked, you should see a small grey chat bubble. Once you've positioned the bubble to where you want your action reminders to appear, lock the overlay.

It is recommended that you enable clickthrough when you're done setting the overlay up.

# Developer TODO
- Sundial
    - Additional actions to run

- Spellbook

- Dynamis
    - Copy the Spellbook flow
    - Add to Sundial

- Status/Debuff
    - Copy the Spellbook flow
    - Add to Sundial

- Instances
    - Zone ID from `ChangeZone` relates to TerritoryID in XIVAPI
    - Banners only available for Instances
