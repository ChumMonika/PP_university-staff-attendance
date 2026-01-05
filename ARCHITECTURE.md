# Project Architecture

## Overview
This project follows Clean Architecture principles with clear separation between domain logic, infrastructure, and presentation layers.

## Backend Structure
- **core/**: Domain layer (entities, use cases, interfaces)
- **infrastructure/**: External concerns (database, HTTP)
- **presentation/**: User interface layer (controllers, routes)

## Frontend Structure
- **features/**: Feature modules (auth, attendance, users, leaves)
- **shared/**: Shared utilities and components
- **pages/**: Routing pages (thin wrappers)

## Adding New Features
1. Create use case in `server/core/use-cases/`
2. Create controller in `server/presentation/controllers/`
3. Add routes in `server/presentation/routes.ts`
4. Create feature module in `client/src/features/`
5. Add page in `client/src/pages/`

## Running the Project
- Development: `npm run dev`
- Build: `npm run build`
- Test: `npm test`