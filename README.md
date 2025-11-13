# Marble WorldLabs Extension

A browser extension for the Marble WorldLabs website that displays detailed information about generated 3D worlds in a sidebar, including prompts, images, and downloadable assets.

**中文文档**: [README_CN.md](./README_CN.md)

## Project Management

**⚠️ Important**: This project is managed using **Bun** as the package manager and runtime. All commands should use `bun` instead of `npm`.

### Requirements

- **Bun**: v1.3.1 or higher (see `.bun-version` file)
- **Node.js**: Compatible with WXT framework requirements
- **Chrome/Chromium**: For extension development and testing

### Why Bun?

- **Faster installs**: Up to 20x faster than npm
- **Reducuced disk space**: Single binary with built-in package manager
- **TypeScript support**: Built-in TypeScript compilation
- **Modern JavaScript**: Native support for latest ES features

## Features

- **🌍 Internationalization**: Supports both English and Simplified Chinese
- **📋 World Details Sidebar**: Displays comprehensive information about 3D worlds
- **📝 Prompt Copy**: Copy world generation prompts with one click
- **🖼️ Image Downloads**: Download input images used for generation
- **📦 Asset Downloads**: Download 3D model files in different qualities
- **🎨 Modern UI**: Clean, responsive design with smooth animations
- **🚀 Performance Optimized**: Fast loading and minimal resource usage

## How it Works

1. **Automatic Detection**: The extension automatically detects when you're on a Marble WorldLabs world page
2. **Data Extraction**: Extracts the world ID from the URL and fetches detailed data from the WorldLabs API
3. **Interactive Sidebar**: Displays comprehensive world information in a slide-out sidebar

## Installation

### Development

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start development server:
   ```bash
   bun run dev
   ```
4. Load the extension in your browser:
   - Chrome: Go to `chrome://extensions/`, enable Developer mode, and click "Load unpacked"
   - Select the `dist/chrome-mv3` folder

### Production Build

1. Build the extension:
   ```bash
   bun run build
   ```
2. Load the built extension from `dist/chrome-mv3` folder

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run compile` - Type check without building
- `bun run zip` - Create distribution ZIP file

## Usage

1. Navigate to any Marble WorldLabs world page (e.g., `https://marble.worldlabs.ai/world/[world-id]`)
2. Click the blue 📋 button in the top-right corner
3. View world details in the sidebar:
   - **Title & Creator**: World name and author information
   - **Stats**: Like count and engagement metrics
   - **Prompt**: Full text prompt with copy functionality
   - **Input Image**: Reference image used for generation
   - **Model**: AI model version used
   - **Export Files**: Download 3D models in various qualities

### SPA Navigation Support

The extension automatically detects when you navigate between different worlds on the Marble WorldLabs website without page refresh. The floating button and data will update automatically when you:

- Click on different world links
- Use browser back/forward buttons
- Navigate through the site's single-page application

**Smart Sidebar Updates**: If you keep the sidebar open while navigating between worlds, it will automatically refresh to show the new world's data with a loading indicator, providing a seamless browsing experience.

The extension monitors URL changes in real-time and fetches fresh data for each world you visit.

## Supported Languages

- **English** (default)
- **简体中文** (Simplified Chinese)

The extension automatically detects your browser's language and displays the appropriate translation.

## Technical Details

- **Framework**: Built with WXT framework for browser extension development
- **Frontend**: React with TypeScript
- **Styling**: Custom CSS with WXT's automatic CSS injection
- **API Integration**: Fetches data from `https://marble2-kgw-prod-iac1.wlt-ai.art/api/v1/worlds/`
- **Permissions**: Only requires access to marble.worldlabs.ai domains

## Development

The extension consists of:

- `entrypoints/content.ts`: Main content script that injects the UI and handles data fetching
- `entrypoints/style.css`: Custom styles for the modern UI (automatically injected by WXT)
- `locales/en.yml`: English translations
- `locales/zh_CN.yml`: Simplified Chinese translations
- `wxt.config.ts`: WXT configuration with i18n module

### Adding New Languages

1. Create a new YAML file in the `locales/` directory (e.g., `fr.yml` for French)
2. Add all required translation keys from the English file
3. Rebuild the extension: `bun run build`

### Translation Keys

All UI text is externalized to translation files:

- Extension metadata: `extName`, `extDescription`
- UI elements: `worldDetails`, `stats`, `prompt`, etc.
- User messages: `loadingWorldData`, `copied`, `failedToLoadWorldData`
- Dynamic content: `likes`, `by`, `downloadQuality` (with placeholders)

## License

MIT License
