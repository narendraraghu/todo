# Eisenhower Matrix Quadrant Todo App

A modern, full-stack, cross-platform desktop application for task management using the Eisenhower Matrix (4-quadrant system). Built with React, Node.js, Electron, and Material-UI.

---

## Project Structure

```
quadrant-todo-app/
├── package.json         # Root (Electron & build scripts)
├── client/              # React frontend
├── server/              # Node.js backend
├── electron/            # Electron main process
├── assets/              # Icons and resources
└── scripts/             # Build and start scripts
```

---

## Setup & Development

### **Quick Start (Recommended)**

```sh
./scripts/start-app.sh
```
- Installs all dependencies (root, client, server)
- Starts both client and server concurrently

### **Manual Setup**

```sh
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### **Start Development Servers**

```sh
npm start
```
- Runs client and server concurrently (client: http://localhost:3000, server: http://localhost:3100)

### **Start Electron App (Dev)**

```sh
npm run start:electron
```
- Runs Electron app with backend and frontend in development mode

### **Build for Production**

```sh
npm run build
npm run package
```
- Builds React app and packages Electron app for distribution (macOS DMG, ARM64 supported)

---

## Scripts

- `npm start` — Run client and server concurrently
- `npm run start:client` — Start React frontend only
- `npm run start:server` — Start Node.js backend only
- `npm run start:electron` — Start Electron app (dev)
- `npm run build` — Build React frontend
- `npm run package` — Build distributable Electron app

---

## Features
- Eisenhower Matrix (4 quadrants) for task prioritization
- Drag-and-drop tasks between quadrants
- Add, edit, delete, and complete tasks
- Due date management and overdue highlighting
- Responsive Material-UI design
- Electron desktop packaging (macOS, ARM64)
- Real-time sync between frontend and backend
- Optimistic UI updates and error handling

---

## Requirements
- Node.js 18+
- npm 9+
- macOS (for DMG build; cross-platform support possible)

---

## License
MIT 