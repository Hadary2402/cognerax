# CogneraXAI - Nexora Landing Page

A modern, responsive landing page for Nexora, a legal AI copilot specialized in UAE law. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🌐 **Bilingual Support**: English and Arabic with RTL layout support
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Fully Responsive**: Optimized for all screen sizes
- 🎥 **Video Background**: Performance-optimized background video
- 🎨 **Modern UI**: Professional design with smooth animations
- 🚀 **Static Export**: Ready for cPanel/GoDaddy deployment

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository** (or navigate to the project directory):

   ```bash
   cd cognerax-landingpage
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Running the Development Server

To start the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The page will automatically reload when you make changes to the code.

## Building for Production

### Static Export (for cPanel/GoDaddy)

To build a static version of the site:

```bash
npm run export
```

or

```bash
yarn export
```

This will create an `out` folder containing all the static files ready for deployment.

### Production Build

To create an optimized production build:

```bash
npm run build
```

or

```bash
yarn build
```

Then start the production server:

```bash
npm start
```

or

```bash
yarn start
```

## Deployment

### cPanel/GoDaddy Deployment

1. Run the export command:

   ```bash
   npm run export
   ```

2. Upload the contents of the `out` folder to your cPanel public_html directory (or your domain's root directory)

3. Ensure the `.htaccess` file is uploaded (it's included in the `out` folder)

4. Your site should now be live!

### Other Hosting Platforms

The static export can be deployed to:

- **Netlify**: Drag and drop the `out` folder
- **Vercel**: Connect your repository (Vercel will auto-detect Next.js)
- **GitHub Pages**: Upload the `out` folder contents
- **Any static hosting service**: Upload the `out` folder contents

## Project Structure

```
cognerax-landingpage/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── request-demo/      # Request demo page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── KeyFeatures.tsx
│   └── ... (other components)
├── contexts/              # React contexts
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
├── lib/                   # Utilities and translations
│   └── translations/      # i18n translation files
├── public/                # Static assets
│   └── *.mp4             # Video files
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies
```

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run export` - Create static export
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Language Switching

- Click the language toggle button (bottom right)
- Switch between English and Arabic
- Full RTL support for Arabic layout

### Dark Mode

- Click the theme toggle button (bottom right)
- Preference is saved in localStorage
- Automatically detects system preference on first visit

### Navigation

- Smooth scroll to sections
- Responsive mobile menu
- Transparent navbar that becomes solid on scroll

## Customization

### Changing Colors

Edit `tailwind.config.js` to modify the color scheme:

- `primary`: Primary brand colors
- `legal`: Legal industry specific colors

### Adding Translations

Edit files in `lib/translations/`:

- `en.ts` - English translations
- `ar.ts` - Arabic translations

### Modifying Content

Most content is in the component files in the `components/` directory. Each section is a separate component for easy editing.

## Troubleshooting

### Video not playing

- Ensure video files are in the `public/` folder
- Check that the video path in `Hero.tsx` matches the filename

### Build errors

- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Styling issues

- Ensure Tailwind CSS is properly configured
- Check that `globals.css` is imported in `layout.tsx`

## Support

For issues or questions, please check the project documentation or contact the development team.

## License

This project is proprietary software for CogneraXAI.
