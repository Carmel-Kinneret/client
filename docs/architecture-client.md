---
id: architecture-client
title: Client Architecture
sidebar_label: Client Architecture
---

# Carmel Kinneret Trail App - Client Architecture

## User Story
As an outdoor enthusiast, I want to view my current location on a high-performance trail map, interact with a community feed, and manage my profile within a lightweight, inviting interface.

## Dev Implementation

### Tech Stack
- **Framework:** React Native / Expo
- **Routing:** Expo Router
- **Styling/UI:** NativeWindUI & TailwindCSS (Adhering to the "Clarified Air" design system)
- **Maps:** MapLibre GL Native (`@maplibre/maplibre-react-native`)
- **State Management:** Native Hooks + Context (will migrate to React Query or Zustand as needed)
- **Networking:** Axios for server endpoints
- **Authentication:** Clerk (`@clerk/clerk-expo`)

### Directory Structure
- `app/`: Contains file-based routing.
- `app/(tabs)/`: Main bottom tab navigation (Map, Feed, Profile).
- `components/`: Reusable, generic UI components (e.g. `TrailMap`).
- `constants/`: Configuration files like `theme.ts` holding the high-contrast color palette, heavy whitespace, and diffuse shadows.
- `services/`: API abstractions using Axios.
- `store/`: Global state if applicable.
- `docs/`: Docusaurus Markdown files.

### Design System: "Clarified Air"
We've enforced weightless drop-shadows, pill-shaped action buttons, and a clean off-white background (`#F8F9FA`). Deep green and blue accents lead user action without cluttering the map.

## Next Steps / Known Limits
- **Map Rendering:** Need to provide valid tilesets to MapLibre.
- **Clerk Auth:** Secure endpoints using standard middleware once the backend is linked. The Client Clerk wrapper will handle the three core states: Guest, User, Admin.
