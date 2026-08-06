import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ---------------------------------------------------------------------------
// GitHub Pages deployment
// ---------------------------------------------------------------------------
// GitHub Pages serves a project site from https://<username>.github.io/<repo>/,
// so the built app needs to know that "/<repo>/" prefix in production. Update
// REPO_NAME below if the repository is ever renamed — that's the only thing
// that needs to change (no GitHub username needed anywhere in this file).
const REPO_NAME = 'rehi-s_portfolio'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${REPO_NAME}/` : '/',
}))
