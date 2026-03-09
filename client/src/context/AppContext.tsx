import { createContext, useContext, useState, ReactNode } from 'react';

export type RevisionStage = 'new' | 'day3' | 'day7' | 'day14' | 'day28' | 'mastered';
export type RevisionStatus = 'due' | 'scheduled' | 'overdue' | 'mastered';

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  revisionStage: RevisionStage;
  revisionStatus: RevisionStatus;
  nextRevision: string; // ISO date string
  lastRevised?: string;
  createdAt: string;
  updatedAt: string;
  flashcards?: Flashcard[];
  mockTests?: MockTest[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  noteId: string;
}

export interface MockTest {
  id: string;
  noteId: string;
  questions: MockQuestion[];
}

export interface MockQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  noteCount: number;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  isStudent: boolean;
  streak: number;
  totalNotes: number;
  dueToday: number;
  mastered: number;
}

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: '1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    isPremium: false,
    isStudent: false,
    streak: 7,
    totalNotes: 24,
    dueToday: 8,
    mastered: 12,
  });

  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: 'Computer Science', color: '#4F46E5', noteCount: 12, lastUpdated: '2026-03-08' },
    { id: '2', name: 'Mathematics', color: '#0D9488', noteCount: 8, lastUpdated: '2026-03-07' },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Data Structures - Arrays & Linked Lists',
      content: '# Arrays\n\nArrays are contiguous blocks of memory...\n\n# Linked Lists\n\nLinked lists consist of nodes...',
      folderId: '1',
      revisionStage: 'day7',
      revisionStatus: 'due',
      nextRevision: '2026-03-09',
      lastRevised: '2026-03-02',
      createdAt: '2026-02-23',
      updatedAt: '2026-03-02',
      flashcards: [
        { id: 'f1', question: 'What is the time complexity of array access?', answer: 'O(1) - constant time', noteId: '1' },
        { id: 'f2', question: 'What is the advantage of linked lists over arrays?', answer: 'Dynamic size and efficient insertions/deletions', noteId: '1' },
      ],
      mockTests: [{
        id: 'm1',
        noteId: '1',
        questions: [
          {
            id: 'q1',
            question: 'What is the time complexity of inserting at the beginning of a linked list?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
            correctAnswer: 0,
            explanation: 'Inserting at the beginning of a linked list only requires updating the head pointer, which is O(1).',
          },
        ],
      }],
    },
    {
      id: '2',
      title: 'Binary Search Trees',
      content: '# Binary Search Trees\n\nA BST is a tree data structure where each node has at most two children...',
      folderId: '1',
      revisionStage: 'day3',
      revisionStatus: 'due',
      nextRevision: '2026-03-09',
      createdAt: '2026-03-06',
      updatedAt: '2026-03-06',
    },
    {
      id: '3',
      title: 'Calculus - Derivatives',
      content: '# Derivatives\n\nThe derivative represents the rate of change...',
      folderId: '2',
      revisionStage: 'mastered',
      revisionStatus: 'mastered',
      nextRevision: '2026-04-06',
      createdAt: '2026-02-10',
      updatedAt: '2026-03-06',
    },
  ]);

  const addNote = (note: Note) => {
    setNotes(prev => [...prev, note]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, ...updates } : note));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const addFolder = (folder: Folder) => {
    setFolders(prev => [...prev, folder]);
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders(prev => prev.map(folder => folder.id === id ? { ...folder, ...updates } : folder));
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        folders,
        setFolders,
        notes,
        setNotes,
        addNote,
        updateNote,
        deleteNote,
        addFolder,
        updateFolder,
        deleteFolder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
