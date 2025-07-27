# vsc-event-sound

Play a custom sound every time a breakpoint is hit in Visual Studio Code.

[!WARNING]
This extension is fully vibe-coded.  Use at your own risk.  Windows presentation works on *my* machine, but may not work on yours.  Mac and Linux features fully untested and may not work.


## Features

- Plays a configurable sound when hitting a breakpoint.
- Works with Windows; attempted compatibility for macOS, and Linux.
- Not part of the Visual Studio marketplace, must be installed from the .package folder.

## Requirements

No additional setup required, but on Windows, Media Player must be installed and sound files must be playable.

## Extension Settings

- `eventSound.soundPath`: Absolute path to the sound file to be played.
- To configure new sound, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>: Select Debug Stop Sound

## Known Issues

- Default sounds may not exist on all OSes.
- Some sound formats may not be supported by the default media player.
- VibeCode fought for hours on the Windos version; Mac and Linux fully untested

## To Instal (Windows)

- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and type `Extensions: Install from VSIX`
- Select the packaged .vsix
- Wait for successful installation

## Release Notes

### 1.0.0

- Initial release.
