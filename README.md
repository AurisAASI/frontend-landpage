# Frontend Landing Page

Main landing page that is used for web searching and company presentation.

## Project Overview

This is a static website built with HTML, CSS, and JavaScript, using Bootstrap for styling. The project is optimized for deployment to AWS S3 and includes:

- Responsive design using Bootstrap
- Asset optimization (minification, hashing for cache control)
- Compression for faster loading
- SPA-like client-side routing

## Development Setup

### Prerequisites

- Node.js (v14+)
- npm (v7+)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start
```

This will start a development server at http://localhost:3000 with hot reloading.

### Building for Production

```bash
# Build for production
npm run build
```

The build output will be in the `build` directory, ready to be deployed to AWS S3.

### Testing the Build Locally

```bash
# Serve the production build locally
npm run serve
```

## Deployment to AWS S3

To deploy to AWS S3:

1. Create an S3 bucket for your website
2. Enable static website hosting on the bucket
3. Configure bucket permissions for public access
4. Upload the contents of the `build` directory to the S3 bucket

## Project Structure

```
frontend-landpage/
├── src/                  # Source files
│   ├── assets/           # Static assets
│   │   ├── css/          # CSS/SCSS files
│   │   ├── js/           # JavaScript files
│   │   └── images/       # Image files
│   ├── index.html        # Main HTML file
│   ├── index.js          # Main entry point
│   └── robots.txt        # Robots file for SEO
├── webpack.config.js     # Webpack configuration
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```
