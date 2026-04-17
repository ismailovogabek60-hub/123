import { NextRequest, NextResponse } from 'next/server';

let MOCK_COURSES = [
  {
    id: 'course-1',
    title: 'Web Development 101',
    description: 'Learn web development basics',
    instructor: 'John Doe',
    progress: 65,
    assignments: [
      { id: 'assignment-1', title: 'HTML & CSS Project', dueDate: '2024-05-15', status: 'pending', grade: null },
      { id: 'assignment-2', title: 'JS Basics', dueDate: '2024-05-01', status: 'graded', grade: 95 }
    ]
  },
  {
    id: 'course-2',
    title: 'Advanced React',
    description: 'Master React and Next.js',
    instructor: 'Jane Smith',
    progress: 15,
    assignments: []
  }
];

const MOCK_GRADES = [
  { id: 'grade-1', courseTitle: 'Web Development 101', assignmentTitle: 'JS Basics', score: 95, maxScore: 100, submittedDate: '2024-05-01T10:00:00Z', gradedDate: '2024-05-02T10:00:00Z' }
];

const MOCK_CONVERSATIONS = [
  { id: 'conv-1', participantName: 'Alice', participantAvatar: 'A', lastMessage: 'Thanks for the help!', lastMessageTime: '2 hours ago', unread: 1 },
  { id: 'conv-2', participantName: 'Bob', participantAvatar: 'B', lastMessage: 'See you tomorrow', lastMessageTime: '1 day ago', unread: 0 }
];

const MOCK_MESSAGES = [
  { id: 'msg-1', senderId: 'user-123', senderName: 'Alice', content: 'Hello!', timestamp: '2024-05-15T10:30:00Z', isOwn: false },
  { id: 'msg-2', senderId: 'me', senderName: 'Me', content: 'Hi Alice, how can I help?', timestamp: '2024-05-15T10:31:00Z', isOwn: true }
];

export async function GET(req: NextRequest, { params }: { params: Promise<{ route: string[] }> | { route: string[] } }) {
  // Await params first to satisfy Next.js NextRequest requirements
  const p = await params;
  const route = p.route || [];
  const path = route.join('/');

  if (path === 'courses') {
    return NextResponse.json({ courses: MOCK_COURSES });
  }

  if (path.startsWith('courses/') && route.length === 2) {
    const course = MOCK_COURSES.find(c => c.id === route[1]) || MOCK_COURSES[0];
    return NextResponse.json(course);
  }

  if (path === 'grades') {
    return NextResponse.json({ grades: MOCK_GRADES });
  }

  if (path === 'messages/conversations') {
    return NextResponse.json({ conversations: MOCK_CONVERSATIONS });
  }

  if (path.startsWith('messages/') && route.length === 2 && route[1] !== 'conversations' && route[1] !== 'send') {
    return NextResponse.json({ messages: MOCK_MESSAGES });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ route: string[] }> | { route: string[] } }) {
  const p = await params;
  const route = p.route || [];
  const path = route.join('/');

  if (path === 'auth/login') {
    const body = await req.json();
    return NextResponse.json({
      token: 'mock-jwt-token-123',
      userId: body.email === 'teacher@example.com' ? 'teacher-1' : 'student-1',
      role: body.email === 'teacher@example.com' ? 'teacher' : (body.email === 'admin@example.com' ? 'admin' : 'student')
    });
  }

  if (path === 'auth/register') {
    return NextResponse.json({
      token: 'mock-jwt-token-123',
      userId: 'new-user-1',
      role: 'student'
    });
  }

  if (path === 'assignments/submit') {
    return NextResponse.json({ success: true, message: 'Assignment submitted successfully' });
  }

  if (path === 'messages/send') {
    return NextResponse.json({ success: true, message: 'Message sent' });
  }

  if (path === 'courses') {
    const body = await req.json();
    const newCourse = {
      id: `course-${Date.now()}`,
      title: body.title,
      description: body.description || '',
      instructor: body.instructor || 'Unknown',
      progress: 0,
      assignments: []
    };
    MOCK_COURSES.push(newCourse);
    return NextResponse.json(newCourse);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ route: string[] }> | { route: string[] } }) {
  const p = await params;
  const route = p.route || [];
  const path = route.join('/');

  if (path.startsWith('courses/') && route.length === 2) {
    const id = route[1];
    MOCK_COURSES = MOCK_COURSES.filter(c => c.id !== id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true });
}
