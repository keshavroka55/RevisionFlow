import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Search,
  Calendar,
  Folder as FolderIcon,
  Trash2,
  Tag,
} from "lucide-react";
import { useNoteStore, useNoteLoading } from "../store/note.store";
import { useFolderStore } from "../store/folder.store";
import { MasteryLevel } from "../types/note.types";

// Badge color per mastery level — matches your Prisma enum
const masteryColors: Record<MasteryLevel, string> = {
  NEW: "bg-gray-100 text-gray-600",
  LEARNING: "bg-blue-100 text-blue-600",
  REVIEWING: "bg-yellow-100 text-yellow-600",
  MASTERED: "bg-green-100 text-green-600",
};

export default function Notes() {
  const {
    notes,
    selectedNote,
    error,
    fetchNotes,
    createNote,
    deleteNote,
    setSelectedNote,
    clearError,
  } = useNoteStore();

  const { folders, fetchFolders } = useFolderStore();

  const isFetching = useNoteLoading("note.fetchAll");
  const isCreating = useNoteLoading("note.create");
  const isDeleting = useNoteLoading("note.delete");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({
    title: "",
    folderId: "",
    content: "",  // plain text — convert to TipTap JSON on submit
    tags: [] as string[],
  });

  // Fetch notes and folders on mount
  useEffect(() => {
    fetchNotes();
    fetchFolders();
  }, []);

  // Search — debounced call to backend with q param
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchNotes({ q: searchQuery });
    }, 400); // wait 400ms after user stops typing

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Set default folderId once folders load
  useEffect(() => {
    if (folders.length > 0 && !newNote.folderId) {
      setNewNote((prev) => ({ ...prev, folderId: folders[0].id }));
    }
  }, [folders]);

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      await createNote({
        folderId: newNote.folderId,
        title: newNote.title,
        // Convert plain text to minimal TipTap JSON format
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: newNote.content }],
            },
          ],
        },
        tags: newNote.tags,
      });
      setNewNote({ title: "", folderId: folders[0]?.id || "", content: "", tags: [] });
      setShowCreateForm(false);
    } catch {
      // error is already in store
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    await deleteNote(id);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">

      {/* Left Panel — Notes List */}
      <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border bg-white flex flex-col max-h-[50vh] lg:max-h-none">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Notes</h2>
            <button
              onClick={() => setShowCreateForm(true)}
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

        {/* Error */}
        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-xs text-red-600">{error}</p>
            <button onClick={clearError} className="text-red-400">✕</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {isFetching ? (
            <div className="p-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-background transition-colors ${
                  selectedNote?.id === note.id
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-foreground line-clamp-1 flex-1">
                    {note.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${masteryColors[note.mastery]}`}>
                    {note.mastery}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {note.contentText || "No preview available"}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FolderIcon className="w-3 h-3" />
                    {folders.find((f) => f.id === note.folderId)?.name || "Unknown"}
                  </span>
                  {note.tags?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {note.tags[0]}
                      {note.tags.length > 1 && ` +${note.tags.length - 1}`}
                    </span>
                  )}
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

      {/* Right Panel — Note Editor / Viewer */}
      <div className="flex-1 bg-background overflow-y-auto pb-20 lg:pb-8">

        {/* Create Note Form */}
        {showCreateForm ? (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Create New Note</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-foreground">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Note title..."
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground">Folder</label>
                <select
                  value={newNote.folderId}
                  onChange={(e) => setNewNote({ ...newNote, folderId: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground">Content</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Write your note content here..."
                  rows={12}
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Revision schedule info */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">📅 Automatic Revision Schedule</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  {["Day 3", "Day 7", "Day 14", "Day 28"].map((day, i) => (
                    <div key={i} className="bg-white rounded-lg p-2 text-center">
                      <div className="font-semibold text-primary">{day}</div>
                      <div className="text-xs text-muted-foreground">Review {i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateNote}
                  disabled={isCreating || !newNote.title.trim() || !newNote.content.trim()}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Note"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewNote({ title: "", folderId: folders[0]?.id || "", content: "", tags: [] });
                  }}
                  className="bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

        ) : selectedNote ? (
          // View Note
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FolderIcon className="w-4 h-4" />
                  {folders.find((f) => f.id === selectedNote.folderId)?.name}
                </span>
                <span>•</span>
                <span>Created {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${masteryColors[selectedNote.mastery]}`}>
                  {selectedNote.mastery}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                {selectedNote.title}
              </h1>

              {selectedNote.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {selectedNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {selectedNote.lastRevisedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Last revised: {new Date(selectedNote.lastRevisedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-border p-6 min-h-[300px] whitespace-pre-wrap text-foreground">
              {selectedNote.contentText || "No content preview available."}
            </div>

            <div className="mt-6 flex gap-3">
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Edit Note
              </button>
              <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors">
                Start Revision
              </button>
              <button
                onClick={() => handleDeleteNote(selectedNote.id)}
                disabled={isDeleting}
                className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg hover:bg-destructive/20 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

        ) : (
          // Empty state
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No note selected</h3>
              <p className="text-muted-foreground mb-6">
                Select a note from the list or create a new one
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
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