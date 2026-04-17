# EduLearn - Educational Platform Frontend

This is a modern, responsive frontend for an educational learning management system (LMS) built with Next.js 16, React 19, and Tailwind CSS.

## Features

### ✅ Implemented Pages

1. **Login/Register** (`/`)
   - User authentication form
   - Support for Students, Teachers, and Admins
   - Toggle between login and registration modes

2. **Dashboard** (`/dashboard`)
   - Overview of enrolled courses
   - Course progress tracking
   - Quick access to course materials
   - Mobile-responsive layout

3. **Course Detail** (`/course/[id]`)
   - Course information and description
   - Assignment list with status tracking
   - File upload for assignment submission
   - Grade display for submitted assignments
   - Two-column responsive layout

4. **Grades** (`/grades`)
   - Overall grade statistics
   - Per-course filtering
   - Grade table with letter grades
   - Download report functionality
   - Grade distribution visualization

5. **Messages** (`/messages`)
   - Conversation list with unread indicators
   - Real-time chat interface
   - Message history
   - Typing indicator support

## Demo Credentials for Testing

Use these test accounts to log in and test the application with your PHP backend:

### Student Account
- **Email:** student@example.com
- **Password:** password123

### Teacher Account
- **Email:** teacher@example.com
- **Password:** password123

### Admin Account
- **Email:** admin@example.com
- **Password:** password123

You can also create new test accounts using the "Sign up" option on the login page.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A PHP backend server with the API endpoints listed below

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   Update `http://localhost:8000/api` to your PHP backend API URL

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

All API calls are made to your PHP backend. The frontend uses the `lib/api.ts` utility module for consistent AJAX requests with automatic authentication headers.

### Required PHP Backend Endpoints

The frontend expects these API endpoints on your PHP backend:

#### Authentication
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, userId, role }`

- `POST /api/auth/register`
  - Body: `{ email, password, name, role }`
  - Response: `{ token, userId, role }`

#### Courses
- `GET /api/courses`
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ courses: [...] }`

- `GET /api/courses/{id}`
  - Headers: `Authorization: Bearer {token}`
  - Response: Course with assignments array

#### Assignments
- `POST /api/assignments/submit`
  - Headers: `Authorization: Bearer {token}`
  - Body: FormData with `file` and `assignmentId`
  - Response: `{ success, message }`

#### Grades
- `GET /api/grades`
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ grades: [...] }`

#### Messages
- `GET /api/messages/conversations`
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ conversations: [...] }`

- `GET /api/messages/{conversationId}`
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ messages: [...] }`

- `POST /api/messages/send`
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ conversationId, content }`
  - Response: `{ success, message }`

## API Response Formats

### Course Object
```json
{
  "id": "course-1",
  "title": "Web Development 101",
  "description": "Learn web development basics",
  "instructor": "John Doe",
  "progress": 65,
  "assignments": [...]
}
```

### Assignment Object
```json
{
  "id": "assignment-1",
  "title": "HTML & CSS Project",
  "dueDate": "2024-05-15",
  "status": "pending|submitted|graded",
  "grade": 95
}
```

### Grade Object
```json
{
  "id": "grade-1",
  "courseTitle": "Web Development 101",
  "assignmentTitle": "HTML & CSS Project",
  "score": 95,
  "maxScore": 100,
  "submittedDate": "2024-05-10T14:30:00Z",
  "gradedDate": "2024-05-12T09:15:00Z"
}
```

### Message Object
```json
{
  "id": "msg-1",
  "senderId": "user-123",
  "senderName": "Alice",
  "content": "Hello!",
  "timestamp": "2024-05-15T10:30:00Z",
  "isOwn": true
}
```

### Conversation Object
```json
{
  "id": "conv-1",
  "participantName": "Alice",
  "participantAvatar": "A",
  "lastMessage": "Thanks for the help!",
  "lastMessageTime": "2 hours ago",
  "unread": 1
}
```

## Using the API Utility

The `lib/api.ts` module provides helper functions for making API calls:

```typescript
import { get, post, put, del, uploadFile } from '@/lib/api';

// GET request
const courses = await get('/courses');

// POST request
const result = await post('/auth/login', { email, password });

// File upload
await uploadFile('/assignments/submit', file, { assignmentId: '123' });
```

Authentication tokens are automatically attached to all requests.

## Authentication Flow

1. User logs in at the home page (`/`)
2. Frontend sends credentials to `POST /api/auth/login`
3. Backend returns `token`, `userId`, and `role`
4. Token is stored in `localStorage`
5. Token is automatically included in all subsequent API requests
6. If token expires (401 response), user is redirected to login

## Features Configuration

### Environment Variables

Create a `.env.local` file:

```
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=
```

### Customization

**Change the app name/branding:**
- Update the title in `app/layout.tsx`
- Change "EduLearn" text throughout components
- Replace the BookOpen icon with your preferred icon from lucide-react

**Change colors:**
- Update the gradient colors in components
- Modify the Tailwind color classes (currently using blue/indigo theme)

**Add new features:**
- Create new pages in the `app/` directory
- Use the `lib/api.ts` helpers for API calls
- Import components from `components/ui/`

## Project Structure

```
├── app/
│   ├── page.tsx              # Login/Register page
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page
│   ├── course/
│   │   └── [id]/
│   │       └── page.tsx      # Course detail page
│   ├── grades/
│   │   └── page.tsx          # Grades page
│   ├── messages/
│   │   └── page.tsx          # Messages page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/ui/            # Shadcn UI components
├── lib/
│   ├── api.ts               # API utilities
│   └── utils.ts             # Helper functions
└── public/                   # Static assets
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality React components
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Create a new project from your GitHub repository
4. Set environment variables in the Vercel dashboard
5. Deploy!

### Deploy Elsewhere

Any Node.js hosting platform works:
- Netlify
- Railway
- Render
- DigitalOcean
- AWS Amplify

## Troubleshooting

### 401 Unauthorized Errors
- Check that your token is being sent correctly in the Authorization header
- Verify your backend is validating tokens properly
- Check that the token hasn't expired

### CORS Issues
- Your PHP backend needs CORS headers if running on a different domain
- Add to your PHP backend:
  ```php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  ```

### API Not Responding
- Verify `NEXT_PUBLIC_API_URL` points to the correct backend URL
- Check that the PHP backend is running
- Look at browser network tab (DevTools) to see what URL is being called

## Support

For issues or questions:
1. Check the API response formats above
2. Look at browser DevTools Network tab for API errors
3. Verify PHP backend is returning proper JSON responses
4. Check that authorization tokens are included in requests

## License

This project is part of the educational platform project and is available for educational use.
