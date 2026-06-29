# Concrete Quote Pro

A Progressive Web App (PWA) for quoting concrete jobs on-site from an iPhone (or any mobile device).

## Features

- Create and manage concrete job quotes
- Auto-calculate cubic yards from length × width × thickness
- Multiple sections per job (driveway + apron, multiple slabs, etc.)
- Material cost breakdown: concrete, rebar, forms, admixtures
- Labor lines with hours × rate
- Markup/overhead percentage
- Share quote via iPhone's native Share Sheet (Messages, Email, etc.)
- Works offline — saves quotes to device storage
- Installable on iPhone home screen via Safari

## Install on iPhone

1. Open Safari and navigate to the deployed URL
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. The app installs like a native app — no App Store needed

## Development

```bash
cd concrete-quotes
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build for production

```bash
cd concrete-quotes
npm run build
npm run preview
```

Deploy the `concrete-quotes/dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).

## How to Use

1. Tap **+** to create a new quote
2. **Customer tab** — enter customer name, phone, address, job type
3. **Areas tab** — add one or more sections (length × width × thickness); cubic yards calculated automatically
4. **Pricing tab** — enter concrete price per yard, rebar, forms, and set your markup %
5. **Labor tab** — add labor lines with hours and hourly rate
6. **Summary tab** — review the full cost breakdown and tap **Share Quote** to send via text/email
