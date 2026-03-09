import { useState } from 'react';
import { Plus, FileText, Search, Calendar, Folder as FolderIcon } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  folder: string;
  content: string;
  createdAt: string;
  nextRevision: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Quantum Mechanics - Wave Functions',
      folder: 'Physics',
      content: 'Wave functions describe the quantum state of a particle...',
      createdAt: '2 days ago',
      nextRevision: 'Tomorrow',
    },
    {
      id: 2,
      title: 'Binary Search Trees',
      folder: 'Computer Science',
      content: 'A binary search tree is a data structure where each node has at most two children...',
      createdAt: '5 days ago',
      nextRevision: 'In 2 days',
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    folder: 'Physics',
    content: '',
  });

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now(),
        title: newNote.title,
        folder: newNote.folder,
        content: newNote.content,
        createdAt: 'Just now',
        nextRevision: 'In 3 days',
      };
      setNotes([note, ...notes]);
      setSelectedNote(note);
      setNewNote({ title: '', folder: 'Physics', content: '' });
      setIsCreating(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Notes List */}
      <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border bg-white flex flex-col max-h-[50vh] lg:max-h-none">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Notes</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-background transition-colors ${
                  selectedNote?.id === note.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{note.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{note.content}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FolderIcon className="w-3 h-3" />
                    {note.folder}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {note.nextRevision}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notes found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Note Editor/Viewer */}
      <div className="flex-1 bg-background overflow-y-auto pb-20 lg:pb-8">
        {isCreating ? (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Create New Note</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm mb-2 text-foreground">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Note title..."
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="folder" className="block text-sm mb-2 text-foreground">Folder</label>
                <select
                  id="folder"
                  value={newNote.folder}
                  onChange={(e) => setNewNote({ ...newNote, folder: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Physics">Physics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Languages">Languages</option>
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm mb-2 text-foreground">Content</label>
                <textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Write your note content here..."
                  rows={12}
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">📅 Automatic Revision Schedule</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  After saving, this note will be scheduled for revision on:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="font-semibold text-primary">Day 3</div>
                    <div className="text-xs text-muted-foreground">First review</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="font-semibold text-secondary">Day 7</div>
                    <div className="text-xs text-muted-foreground">Second review</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="font-semibold text-accent">Day 14</div>
                    <div className="text-xs text-muted-foreground">Third review</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <div className="font-semibold text-warning">Day 28</div>
                    <div className="text-xs text-muted-foreground">Final review</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateNote}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Note
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNote({ title: '', folder: 'Physics', content: '' });
                  }}
                  className="bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : selectedNote ? (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FolderIcon className="w-4 h-4" />
                  {selectedNote.folder}
                </span>
                <span>•</span>
                <span>Created {selectedNote.createdAt}</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{selectedNote.title}</h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Next revision: {selectedNote.nextRevision}
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="bg-white rounded-lg border border-border p-6 min-h-[300px] whitespace-pre-wrap text-foreground">
                {selectedNote.content}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Edit Note
              </button>
              <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors">
                Start Revision
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No note selected</h3>
              <p className="text-muted-foreground mb-6">Select a note from the list or create a new one</p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
