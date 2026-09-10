import { WorkItem } from '../types/workItem';

const now = new Date();
const todayISO = now.toISOString();

const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowISO = tomorrow.toISOString();

const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 5);
const nextWeekISO = nextWeek.toISOString();

export const INITIAL_SAMPLE_ITEMS: WorkItem[] = [
  {
    id: 'wp-1',
    title: 'Finish DBMS assignment',
    content: 'Complete normalization problems (1NF to BCNF) and submit relational algebra queries on Canvas before midnight.',
    type: 'task',
    priority: 'high',
    status: 'active',
    dueDate: todayISO,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    tags: ['college', 'dbms', 'urgent'],
    metadata: {
      source: 'manual',
    },
  },
  {
    id: 'wp-2',
    title: 'npm install express cors dotenv',
    content: 'npm install express cors dotenv\nnpm install -D typescript @types/express @types/node tsx',
    type: 'code',
    priority: 'medium',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    tags: ['backend', 'node', 'setup'],
    metadata: {
      language: 'bash',
    },
  },
  {
    id: 'wp-3',
    title: 'Read Supabase documentation',
    content: 'Look into Supabase Row Level Security (RLS) policies and Auth helpers for next project.',
    type: 'task',
    priority: 'medium',
    status: 'active',
    dueDate: tomorrowISO,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    tags: ['learning', 'supabase'],
  },
  {
    id: 'wp-4',
    title: 'Supabase Architecture Guide',
    content: 'https://supabase.com/docs/guides/architecture',
    type: 'link',
    priority: 'low',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    tags: ['docs', 'bookmarks'],
    metadata: {
      url: 'https://supabase.com/docs/guides/architecture',
    },
  },
  {
    id: 'wp-5',
    title: 'System Design: Rate Limiter Algorithms',
    content: 'Token Bucket vs Leaky Bucket:\n- Token bucket allows bursts of traffic up to capacity.\n- Leaky bucket smooths out requests at a constant rate.\n- Redis sorted sets work well for sliding window log.',
    type: 'note',
    priority: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    tags: ['interviews', 'architecture'],
  },
  {
    id: 'wp-6',
    title: 'Docker Compose for Postgres & Redis',
    content: `version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: workpocket_dev
    ports:
      - "5432:5432"
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"`,
    type: 'code',
    priority: 'low',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    tags: ['docker', 'devops'],
    metadata: {
      language: 'yaml',
    },
  },
  {
    id: 'wp-7',
    title: 'CS301_Distributed_Systems_Syllabus.pdf',
    content: 'Midterm date: Nov 14th. Final Project presentation requires 3-node raft cluster demonstration.',
    type: 'file',
    priority: 'medium',
    status: 'active',
    dueDate: nextWeekISO,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    tags: ['coursework', 'pdf'],
    metadata: {
      fileName: 'CS301_Distributed_Systems_Syllabus.pdf',
      fileSize: '1.4 MB',
      fileType: 'application/pdf',
    },
  },
];
