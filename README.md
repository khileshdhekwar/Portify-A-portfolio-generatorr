# Portify AI — Your Resume, Your Identity, Your Portfolio.

> Production-grade MERN application that transforms PDF/DOCX resumes into beautiful, editable, and publicly accessible personal portfolio websites with AI precision, 5 custom themes, QR code sharing, and offline-compatible standalone ZIP exports.

---

## 🌟 Key Features

1. **Intelligent Resume Text Extraction**:
   - Native parsing of both **PDF** and **DOCX** files with zero external cloud dependencies.
   - Preserves exact career timeline, degree records, contact information, and project highlights.

2. **Dual-Engine AI & Deterministic Parsing**:
   - **Google Gemini AI (`gemini-1.5-flash`)**: High-speed, structured JSON schema extraction and ATS optimization.
   - **Deterministic Fallback Engine**: Proprietary rule-based NLP parser that operates with 100% fidelity even when API keys are absent or rate limits are reached.
   - **Factual Integrity Guarantee**: Strict system grounding rules prevent fabrication of qualifications, metrics, companies, or dates.

3. **Five Handcrafted Portfolio Themes**:
   - 🎯 **Minimal Pro**: Ultra-clean typography, generous whitespace, monochrome & slate accents, editorial structure.
   - 💻 **Dark Developer**: Deep terminal header (`#0B0F19`), code-block snippets, git-commit timeline with branch lines, tech stack pills.
   - 🎨 **Creative Gradient**: Restrained pastel mesh accents, dynamic project cards with subtle hover lift, expressive headings.
   - 🏛️ **Corporate Elite**: Executive presence, navy/charcoal tones, structured split layout, formal credential badges.
   - 💎 **Modern Glass**: Frosted glassmorphism (`backdrop-blur-xl bg-white/[0.04]`), 1px hairline borders, dark ambient space.

4. **Automatic Theme Rotation**:
   - Every consecutive resume upload automatically cycles to the next theme in the sequence:
     `Minimal Pro` → `Dark Developer` → `Creative Gradient` → `Corporate Elite` → `Modern Glass`.

5. **Split-Screen Studio with Live Device Viewports**:
   - Real-time updates as you type.
   - One-click viewport switcher: **Desktop** (100%), **Tablet** (768px frame), and **Mobile** (375px frame).
   - In-studio AI assistants: "AI Enhance Summary" and "AI Polish Highlights" for punchy action verbs.

6. **Instant Sharing & Exports**:
   - **Unique Public URLs**: `/p/:slug` with custom slug editing and database collision prevention.
   - **Digital Identity QR Code**: Scan with any smartphone camera to immediately view or share.
   - **Offline Standalone ZIP Export**: Generates self-contained static HTML/CSS/assets ready for local opening or free hosting on GitHub Pages, Netlify, or Vercel.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React, QRCode |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Multer |
| **Parsing** | `pdf-parse`, `mammoth` (DOCX extraction), Regex Rule Engine |
| **AI Integration** | Google Gemini API (`@google/generative-ai`), Structured Output |
| **Packaging** | `jszip` (Static standalone website builder), `qrcode` |
| **Testing** | Vitest, React Testing Library, Supertest, Playwright (E2E) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `127.0.0.1:27017` or a MongoDB Atlas URI)

### 1. Installation

Clone and install dependencies across the monorepo:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment Configuration

Copy the example environment file in `server/`:

```bash
# In server/
copy .env.example .env
```

Default configuration (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/portify_ai
JWT_SECRET=portify_ai_jwt_secret_token_key_change_in_production
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here  # Optional: Deterministic engine runs automatically if empty
CLIENT_URL=http://localhost:5173
```

> **Note on Gemini AI**: If you provide a free `GEMINI_API_KEY` from Google AI Studio, Gemini will power resume analysis and summary enhancements. If left empty, Portify seamlessly runs in deterministic mode with transparent status indicators.

### 3. Launch Development Mode

From the project root:

```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🧪 Automated Testing Suite

All tests can be executed with automated npm scripts:

```bash
# Run all unit and integration tests (Server + Client)
npm test

# Run backend API & extraction tests only
npm run test:server

# Run frontend component & theme tests only
npm run test:client

# Run Playwright End-to-End browser tests
npm run test:e2e
```

---

## 📁 Project Structure

```
Portify/
├── package.json               # Root scripts (concurrently dev, test, build)
├── playwright.config.js       # Playwright E2E configuration
├── e2e/
│   └── portify.spec.js        # Complete E2E user journey tests
├── server/
│   ├── package.json
│   ├── vitest.config.js
│   ├── src/
│   │   ├── app.js             # Express app setup, helmet, cors, rate-limiter
│   │   ├── server.js          # Server entry point & DB connection
│   │   ├── config/            # DB connection & typed env
│   │   ├── models/            # User & Portfolio Mongoose schemas
│   │   ├── controllers/       # Auth, Resume, Portfolio, AI controllers
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # JWT auth, upload validation, error handling
│   │   ├── services/
│   │   │   ├── pdfService.js          # PDF text extraction
│   │   │   ├── docxService.js         # DOCX text extraction
│   │   │   ├── deterministicParser.js # NLP rule-based parser
│   │   │   ├── aiService.js           # Gemini AI service abstraction
│   │   │   ├── zipService.js          # Standalone HTML ZIP generator
│   │   │   └── qrService.js           # QR code generation
│   │   └── utils/                     # Slugify & helpers
│   └── tests/
│       ├── api.test.js        # Auth, Portfolio CRUD, Public, QR, ZIP tests
│       └── upload.test.js     # Upload & Theme Rotation tests
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── src/
    │   ├── main.jsx           # App entry point
    │   ├── App.jsx            # Route definitions
    │   ├── context/           # AuthContext
    │   ├── services/          # Axios API service abstractions
    │   ├── components/
    │   │   ├── common/        # Navbar, Footer, Button, Input, Modal, Badge
    │   │   ├── preview/       # DeviceSwitcher (Desktop/Tablet/Mobile)
    │   │   ├── dashboard/     # QRCodeModal, DeleteConfirmModal
    │   │   └── themes/        # 5 Portfolio Themes + ThemeRenderer
    │   └── pages/             # Home, Login, Register, Dashboard, Upload, Editor, Public
```

---

## 🔒 Security Architecture

- **Password Hashing**: Bcrypt with 10 salt rounds.
- **Access Control**: Strict owner authorization middleware ensuring users only access and modify their private records.
- **Safe Public Exposure**: Public routes (`/p/:slug`) expose only intentionally published portfolios.
- **Sanitized Uploads**: In-memory buffer processing for PDF/DOCX with file size limits (10MB) and MIME validation.
- **Security Headers & Protection**: Helmet security headers and IP rate limiting on API routes.
