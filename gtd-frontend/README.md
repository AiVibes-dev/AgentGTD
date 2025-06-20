# GTD Frontend

A React Native/Expo app for Getting Things Done (GTD) task management, built with TypeScript and modern best practices.

## 🏗️ Architecture

The app follows a clean, scalable architecture with proper separation of concerns:

```
gtd-frontend/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── constants/          # App-wide constants and design tokens
├── hooks/              # Custom React hooks
├── services/           # API services and business logic
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main app component
```

## 🎯 Features

- **Goals List**: Display and manage goals from the backend API
- **Create Goals**: Add new goals with a beautiful modal interface
- **Modern UI**: Clean, card-based design with consistent styling
- **Error Handling**: Graceful error states with retry functionality
- **Loading States**: Professional loading indicators
- **Pull-to-Refresh**: Swipe down to refresh the goals list
- **Toast Notifications**: Success and error feedback
- **TypeScript**: Fully typed for better development experience
- **Responsive**: Works on different screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- Expo CLI
- Expo Go app on your device

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with Expo Go app

## 📱 Configuration

The app reads configuration from `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://127.0.0.1:4000",
      "environment": "development"
    }
  }
}
```

## 🏛️ Project Structure

### Components (`/components`)
Reusable UI components that follow the single responsibility principle.

- `GoalsList.tsx`: Main component for displaying goals
- `CreateGoalModal.tsx`: Modal for creating new goals
- `Toast.tsx`: Toast notification component

### Configuration (`/config`)
Centralized configuration management.

- `api.ts`: API configuration and URL utilities

### Constants (`/constants`)
Design tokens and app-wide constants.

- `index.ts`: Colors, spacing, typography, shadows, and border radius

### Hooks (`/hooks`)
Custom React hooks for state management and business logic.

- `useGoals.ts`: Goals management with CRUD operations

### Services (`/services`)
API services and business logic layer.

- `api.ts`: Base API service with error handling and timeout management
- `goalsService.ts`: Goals-specific API operations

### Types (`/types`)
TypeScript type definitions.

- `goal.ts`: Goal interface and related types

### Utils (`/utils`)
Utility functions for common operations.

- `dateUtils.ts`: Date formatting and manipulation utilities

## 🎨 Design System

The app uses a consistent design system with:

- **Colors**: Primary, secondary, success, warning, error, and text colors
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, xxl)
- **Typography**: Font sizes and weights
- **Shadows**: Elevation and depth
- **Border Radius**: Consistent corner rounding

## 🔧 Best Practices

### Code Organization
- **Separation of Concerns**: Each file has a single responsibility
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Proper loading indicators for better UX

### API Layer
- **Centralized Configuration**: API base URL from app.json
- **Service Layer**: Dedicated services for different entities
- **Error Handling**: Timeout management and retry functionality
- **Type Safety**: Fully typed API responses

### State Management
- **Custom Hooks**: Reusable state management with useGoals hook
- **Optimistic Updates**: Immediate UI updates with error rollback
- **Loading States**: Proper loading and refreshing states

### UI/UX
- **Consistent Design**: Design tokens for consistent styling
- **Accessibility**: Proper touch targets and contrast ratios
- **Error States**: User-friendly error messages with retry options
- **Empty States**: Helpful messages when no data is available
- **Toast Notifications**: Immediate feedback for user actions

## 🔄 API Integration

The app integrates with the GTD backend API:

- **Base URL**: Configurable via app.json
- **Endpoints**: 
  - `GET /goals` - Fetch all goals
  - `POST /goals` - Create new goal
- **Error Handling**: Comprehensive error handling with retry
- **Timeout**: 10-second request timeout
- **Headers**: Proper Content-Type and Accept headers

### API Response Formats

**GET /goals**
```json
{
  "goals": [
    {
      "id": 1,
      "title": "Create GTD App",
      "createdAt": "2025-06-21T01:59:36.387868+05:30"
    }
  ]
}
```

**POST /goals**
```json
{
  "id": 2,
  "title": "New Goal",
  "createdAt": "2025-06-21T03:04:27.339845+05:30"
}
```

## 📦 Dependencies

- **Expo**: React Native development platform
- **React Native**: Mobile app framework
- **TypeScript**: Type safety
- **Expo Constants**: Configuration management
- **React Native Safe Area Context**: Safe area handling
- **Expo Vector Icons**: Icon library

## 🚀 Development

### Adding New Features
1. Create types in `/types`
2. Add API methods in `/services`
3. Create custom hooks in `/hooks`
4. Build UI components in `/components`
5. Use constants from `/constants`

### Styling Guidelines
- Use design tokens from `/constants`
- Follow the spacing and typography scales
- Maintain consistent shadows and border radius
- Use semantic color names

### Error Handling
- Always provide user-friendly error messages
- Include retry functionality where appropriate
- Log errors for debugging
- Handle network timeouts gracefully

## 🎯 User Experience

### Creating Goals
1. Tap the "+" button in the header
2. Enter a goal title (required, max 100 characters)
3. Tap "Create" to save
4. Success toast notification appears
5. Goal is immediately added to the list

### Viewing Goals
- Goals are displayed in cards with title and creation date
- Pull down to refresh the list
- Tap a goal to view details (future feature)
- Loading states show during API calls

### Error Handling
- Network errors show retry options
- Validation errors prevent form submission
- Toast notifications provide immediate feedback
- Graceful fallbacks for all error states

## 📝 TODO

- [x] Goal creation functionality
- [ ] Goal details screen
- [ ] Task management within goals
- [ ] Goal editing and deletion
- [ ] Search and filtering
- [ ] Offline support
- [ ] Push notifications
- [ ] User authentication
- [ ] Data persistence 