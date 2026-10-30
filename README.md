# KeepIdleOnReturn for Vencord

When Discord puts you **Idle** on its own after a few minutes without activity (10 minutes by default), you stay **Idle** when you come back. Discord no longer switches you back to **Online** just because you moved the mouse.

## How it works

1. Discord shows the automatic Idle only when your chosen status is **Online**. At the moment Discord turns you Idle, the plugin saves **Idle** as your chosen status, the same as picking it in the status menu.
2. When you come back, Discord would normally go back to Online. Since your chosen status is now Idle, you stay Idle.
3. A banner at the top of Discord tells you that you stayed Idle, with a **Go back Online** button. Close the banner with the X to stay Idle. You can also change your status yourself at any time in the status menu.
4. If you change your status some other way (status menu, phone, another Discord app), the banner closes by itself, and the plugin forgets that it put you Idle. An Idle you pick yourself never shows the banner.

The plugin does nothing when your status is Do Not Disturb, Invisible or already Idle. Because Idle is saved as your real status, it also shows on your other devices (phone, browser) and stays after restarting Discord, until you pick another status.

## Settings

- **Show return notice** (on by default): show the banner with the Go back Online button when you come back. Turn it off to stay Idle silently.

## Notes

- No Discord code is patched: the plugin listens to Discord's own "idle" event and changes your status through Vencord's settings API. It should survive Discord updates well.
- Vencord's built-in **CustomIdle** plugin has a similar "remain in idle" option and lets you change the 10 minute delay. Both can be on at the same time.

## Installation

This is a user plugin, so it needs Vencord [built from source](https://docs.vencord.dev/installing/).

1. From the Vencord folder, clone this repo into `src/userplugins` (the folder is created if it doesn't exist yet):

   ```bash
   cd Vencord
   git clone https://github.com/TheUnknownMurda/KeepIdleOnReturn-Vencord src/userplugins/KeepIdleOnReturn
   ```

2. Build Vencord:

   ```bash
   pnpm build
   ```

3. If Discord doesn't load Vencord from this folder yet, inject it:

   ```bash
   pnpm inject
   ```

4. Fully quit Discord (from the system tray) and start it again, then enable **KeepIdleOnReturn** in Settings > Vencord > Plugins. It works right away, no second restart needed.

### Updating

```bash
cd Vencord/src/userplugins/KeepIdleOnReturn
git pull
```

Then run `pnpm build` again and restart Discord.

## Credits

Made by [TheUnknownMurda](https://github.com/TheUnknownMurda), for [Vencord](https://github.com/Vendicated/Vencord).

## License

GPL-3.0-or-later, like Vencord. See [LICENSE](LICENSE).
