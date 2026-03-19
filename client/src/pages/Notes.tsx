import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  FileText,
  Search,
  Calendar,
  Folder as FolderIcon,
  Trash2,
  Tag,
  PanelLeftClose,
  PanelLeftOpen,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Type,
  Minus,
  ChevronDown,
  Pencil,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNoteStore, useNoteLoading } from "../store/note.store";
import { useFolderStore } from "../store/folder.store";
import { MasteryLevel } from "../types/note.types";
import ConfirmDialog from "../components/ConfirmDialog";

/* ─── Mastery badge styles ─────────────────────────────────────────────── */
const masteryColors: Record<MasteryLevel, string> = {
  NEW: "bg-slate-100 text-slate-500 border border-slate-200",
  LEARNING: "bg-blue-50 text-blue-600 border border-blue-200",
  REVIEWING: "bg-amber-50 text-amber-600 border border-amber-200",
  MASTERED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
};

const masteryDot: Record<MasteryLevel, string> = {
  NEW: "bg-slate-400",
  LEARNING: "bg-blue-500",
  REVIEWING: "bg-amber-500",
  MASTERED: "bg-emerald-500",
};

/* ─── Quill config ──────────────────────────────────────────────────────── */
const quillModules = {
  toolbar: {
    container: "#quill-toolbar",
  },
};

const quillFormats = [
  "header",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "list",
  "align",
  "indent",
  "blockquote",
  "code-block",
  "link",
];

/* ─── Highlight colours ────────────────────────────────────────────────── */
const highlights = [
  { label: "Yellow", bg: "#FEF08A", text: "#713F12" },
  { label: "Green", bg: "#BBF7D0", text: "#14532D" },
  { label: "Blue", bg: "#BAE6FD", text: "#0C4A6E" },
  { label: "Pink", bg: "#FBCFE8", text: "#831843" },
  { label: "Orange", bg: "#FED7AA", text: "#7C2D12" },
  { label: "Purple", bg: "#E9D5FF", text: "#581C87" },
];

/* ─── Custom toolbar component ─────────────────────────────────────────── */
function EditorToolbar({ quillRef }: { quillRef: React.MutableRefObject<any> }) {
  const [showHighlights, setShowHighlights] = useState(false);
  const [showHeadings, setShowHeadings] = useState(false);
  const [activeFmts, setActiveFmts] = useState<Record<string, any>>({});

  // Track active formats
  useEffect(() => {
    const interval = setInterval(() => {
      const editor = quillRef.current?.getEditor?.();
      if (editor) {
        const range = editor.getSelection();
        if (range) setActiveFmts(editor.getFormat(range));
      }
    }, 200);
    return () => clearInterval(interval);
  }, [quillRef]);

  const applyFormat = (format: string, value: any) => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    editor.focus();
    const range = editor.getSelection(true);
    if (range) editor.formatText(range.index, range.length, format, value);
  };

  const applyBlockFormat = (format: string, value: any) => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    editor.focus();
    const range = editor.getSelection(true);
    if (range) editor.formatLine(range.index, range.length, format, value);
  };

  const btn = (
    active: boolean,
    onClick: () => void,
    children: React.ReactNode,
    title: string
  ) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`
        relative p-1.5 rounded-md text-sm transition-all duration-150 select-none
        ${active
          ? "bg-indigo-100 text-indigo-700 shadow-inner"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
      `}
    >
      {children}
    </button>
  );

  const divider = () => (
    <div className="w-px h-5 bg-slate-200 mx-1 self-center" />
  );

  return (
    <div
      id="quill-toolbar"
      className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-slate-50/80 rounded-t-xl"
    >
      {/* Headings dropdown */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); setShowHeadings(s => !s); setShowHighlights(false); }}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-slate-600 hover:bg-slate-100 transition-all"
        >
          <Type className="w-3.5 h-3.5" />
          <span className="text-xs font-medium min-w-8">
            {activeFmts.header === 1 ? "H1" : activeFmts.header === 2 ? "H2" : activeFmts.header === 3 ? "H3" : "Text"}
          </span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
        {showHeadings && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 min-w-32">
            {[
              { label: "Normal", value: false, cls: "text-sm" },
              { label: "Heading 1", value: 1, cls: "text-xl font-bold" },
              { label: "Heading 2", value: 2, cls: "text-lg font-semibold" },
              { label: "Heading 3", value: 3, cls: "text-base font-medium" },
            ].map((h) => (
              <button
                key={String(h.value)}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyBlockFormat("header", h.value);
                  setShowHeadings(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${h.cls}`}
              >
                {h.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {divider()}

      {/* Bold / Italic / Underline / Strike */}
      {btn(!!activeFmts.bold, () => applyFormat("bold", !activeFmts.bold), <Bold className="w-3.5 h-3.5" />, "Bold (Ctrl+B)")}
      {btn(!!activeFmts.italic, () => applyFormat("italic", !activeFmts.italic), <Italic className="w-3.5 h-3.5" />, "Italic (Ctrl+I)")}
      {btn(!!activeFmts.underline, () => applyFormat("underline", !activeFmts.underline), <Underline className="w-3.5 h-3.5" />, "Underline (Ctrl+U)")}
      {btn(!!activeFmts.strike, () => applyFormat("strike", !activeFmts.strike), <Strikethrough className="w-3.5 h-3.5" />, "Strikethrough")}

      {divider()}

      {/* Highlight picker */}
      <div className="relative">
        <button
          type="button"
          title="Highlight"
          onMouseDown={(e) => { e.preventDefault(); setShowHighlights(s => !s); setShowHeadings(false); }}
          className="flex items-center gap-1 p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-all"
        >
          <Highlighter className="w-3.5 h-3.5" />
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
        {showHighlights && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-2">
            <p className="text-xs text-slate-400 font-medium mb-2 px-1">Highlight Colour</p>
            <div className="grid grid-cols-3 gap-1.5">
              {highlights.map((h) => (
                <button
                  key={h.label}
                  type="button"
                  title={h.label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyFormat("background", h.bg);
                    applyFormat("color", h.text);
                    setShowHighlights(false);
                  }}
                  className="w-8 h-8 rounded-md border border-slate-200 hover:scale-110 transition-transform shadow-sm"
                  style={{ backgroundColor: h.bg }}
                />
              ))}
              <button
                type="button"
                title="Remove highlight"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFormat("background", false);
                  applyFormat("color", false);
                  setShowHighlights(false);
                }}
                className="w-8 h-8 rounded-md border border-dashed border-slate-300 hover:scale-110 transition-transform flex items-center justify-center text-slate-400 text-xs"
              >
                <Minus className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {divider()}

      {/* Lists */}
      {btn(activeFmts.list === "bullet", () => applyBlockFormat("list", activeFmts.list === "bullet" ? false : "bullet"), <List className="w-3.5 h-3.5" />, "Bullet List")}
      {btn(activeFmts.list === "ordered", () => applyBlockFormat("list", activeFmts.list === "ordered" ? false : "ordered"), <ListOrdered className="w-3.5 h-3.5" />, "Numbered List")}

      {divider()}

      {/* Alignment */}
      {btn(!activeFmts.align || activeFmts.align === "left", () => applyBlockFormat("align", false), <AlignLeft className="w-3.5 h-3.5" />, "Align Left")}
      {btn(activeFmts.align === "center", () => applyBlockFormat("align", "center"), <AlignCenter className="w-3.5 h-3.5" />, "Align Center")}
      {btn(activeFmts.align === "right", () => applyBlockFormat("align", "right"), <AlignRight className="w-3.5 h-3.5" />, "Align Right")}

      {divider()}

      {/* Blockquote */}
      {btn(!!activeFmts.blockquote, () => applyBlockFormat("blockquote", !activeFmts.blockquote),
        <span className="text-xs font-bold font-serif px-0.5">"</span>, "Blockquote"
      )}
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const htmlToPlainText = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function Notes() {
  const navigate = useNavigate();
  const createQuillRef = useRef<any>(null);
  const editQuillRef = useRef<any>(null);

  const {
    notes, selectedNote, error,
    fetchNotes, fetchNoteById, createNote, updateNote, deleteNote,
    setSelectedNote, clearError,
  } = useNoteStore();

  const { folders, fetchFolders } = useFolderStore();

  const isFetching = useNoteLoading("note.fetchAll");
  const isCreating = useNoteLoading("note.create");
  const isUpdating = useNoteLoading("note.update");
  const isDeleting = useNoteLoading("note.delete");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeToolbar, setActiveToolbar] = useState<"create" | "edit">("create");
  const [newNote, setNewNote] = useState({ title: "", folderId: "", content: "", tags: [] as string[], tagsInput: "" });
  const [editNote, setEditNote] = useState({ title: "", folderId: "", content: "", tagsInput: "" });
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; title: string } | null>(null);

  /* word / char counter */
  const wordCount = (html: string) => htmlToPlainText(html).split(/\s+/).filter(Boolean).length;
  const charCount = (html: string) => htmlToPlainText(html).length;

  const extractTextFromContent = (node: any): string => {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractTextFromContent).join(" ");
    if (typeof node === "object") {
      return [typeof node.text === "string" ? node.text : "", extractTextFromContent(node.content)]
        .filter(Boolean).join(" ");
    }
    return "";
  };

  const getNotePreviewText = (note: any): string => {
    const plain = (note?.contentText ?? "").trim();
    if (plain) return plain;
    return extractTextFromContent(note?.content).replace(/\s+/g, " ").trim() || "No preview available";
  };

  /* ── data fetch ── */
  useEffect(() => { fetchNotes(); fetchFolders(); }, []);
  useEffect(() => {
    const t = setTimeout(() => fetchNotes({ q: searchQuery }), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);
  useEffect(() => {
    if (folders.length > 0 && !newNote.folderId)
      setNewNote(p => ({ ...p, folderId: folders[0].id }));
  }, [folders]);

  /* ── handlers ── */
  const handleCreateNote = async () => {
    const plain = htmlToPlainText(newNote.content);
    if (!newNote.title.trim() || !plain) return;
    const tags = newNote.tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    try {
      await createNote({
        folderId: newNote.folderId,
        title: newNote.title,
        content: { type: "rich-text", html: newNote.content },
        contentText: plain,
        tags,
      });
      setNewNote({ title: "", folderId: folders[0]?.id || "", content: "", tags: [], tagsInput: "" });
      setShowCreateForm(false);
    } catch { /* error in store */ }
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    setNoteToDelete(null);
  };

  const handleSelectNote = useCallback(async (note: any) => {
    setSelectedNote(note);
    setShowCreateForm(false);
    setIsEditMode(false);

    try {
      await fetchNoteById(note.id);
    } catch {
      // keep selected list note if full fetch fails
    }
  }, [fetchNoteById, setSelectedNote]);

  const handleStartEdit = () => {
    if (!selectedNote) return;
    setIsEditMode(true);
    setShowCreateForm(false);
    setActiveToolbar("edit");
    setEditNote({
      title: selectedNote.title || "",
      folderId: selectedNote.folderId || folders[0]?.id || "",
      content: selectedNote.content?.html || getNotePreviewText(selectedNote),
      tagsInput: selectedNote.tags?.join(", ") || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedNote || !editNote.title.trim() || !editNote.content.trim()) return;
    const tags = editNote.tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    await updateNote(selectedNote.id, {
      title: editNote.title.trim(),
      folderId: editNote.folderId,
      content: { type: "rich-text", html: editNote.content },
      contentText: htmlToPlainText(editNote.content),
      tags,
    });
    setIsEditMode(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isSaveShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
      if (!isSaveShortcut) return;

      if (showCreateForm) {
        e.preventDefault();
        const canSaveCreate = !isCreating && !!newNote.title.trim() && !!htmlToPlainText(newNote.content);
        if (canSaveCreate) void handleCreateNote();
        return;
      }

      if (isEditMode) {
        e.preventDefault();
        const canSaveEdit = !isUpdating && !!editNote.title.trim() && !!editNote.content.trim();
        if (canSaveEdit) void handleSaveEdit();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    showCreateForm,
    isEditMode,
    isCreating,
    isUpdating,
    newNote.title,
    newNote.content,
    editNote.title,
    editNote.content,
    handleCreateNote,
    handleSaveEdit,
  ]);

  const processQuillHtml = (html: string): string => {
  if (!html) return "";
  return html
    // Empty paragraphs (blank lines) → visible spacer
    .replace(/<p><br\s*\/?><\/p>/gi, '<p style="min-height:1.6em;margin:0 0 0.2em 0;">&nbsp;</p>')
    // Normal paragraphs → add bottom margin
    .replace(/<p(\s[^>]*)?>/gi, '<p$1 style="margin:0 0 0.75em 0; padding:0;">')
    // Standalone <br> inside content → keep as line break
    .replace(/<br\s*\/?>/gi, '<br style="display:block;"/>');
};

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Quill global overrides */}
      <style>{`
        .ql-container { font-family: 'Georgia', serif; font-size: 15px; border: none !important; }
        .ql-editor { padding: 20px 24px; min-height: 320px; line-height: 1.8; color: #1e293b; }
        .ql-editor.ql-blank::before { color: #94a3b8; font-style: italic; }
        .ql-editor h1 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
        .ql-editor h2 { font-size: 1.35rem; font-weight: 600; color: #1e293b; margin-bottom: 6px; }
        .ql-editor h3 { font-size: 1.1rem; font-weight: 600; color: #334155; margin-bottom: 4px; }
        .ql-editor blockquote { border-left: 4px solid #6366f1; padding-left: 16px; color: #475569; font-style: italic; background: #f8f7ff; border-radius: 0 8px 8px 0; margin: 12px 0; padding: 10px 16px; }
        .ql-editor ul li, .ql-editor ol li { margin-bottom: 4px; }
        .ql-editor code { background: #f1f5f9; border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 0.9em; }
        .ql-toolbar { display: none; }

        /* ── Note view mode ── */
        .note-content {
          overflow-x: hidden;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: normal;
        }
        .note-content * { box-sizing: border-box; }
        .note-content p { margin: 0 0 0.75em 0 !important; padding: 0; line-height: 1.8; }
        .note-content p:last-child { margin-bottom: 0 !important; }
        .note-content h1 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin: 1em 0 0.5em 0 !important; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
        .note-content h2 { font-size: 1.35rem; font-weight: 600; color: #1e293b; margin: 0.8em 0 0.4em 0 !important; }
        .note-content h3 { font-size: 1.1rem; font-weight: 600; color: #334155; margin: 0.6em 0 0.3em 0 !important; }
        .note-content blockquote { border-left: 4px solid #6366f1; padding: 10px 16px; color: #475569; font-style: italic; background: #f8f7ff; border-radius: 0 8px 8px 0; margin: 12px 0 !important; }
        .note-content ul { list-style-type: disc; padding-left: 1.5em; margin: 0 0 1em 0 !important; }
        .note-content ol { list-style-type: decimal; padding-left: 1.5em; margin: 0 0 1em 0 !important; }
        .note-content li { margin-bottom: 4px; display: list-item; }
        .note-content .ql-align-center { text-align: center; }
        .note-content .ql-align-right { text-align: right; }
        .note-content .ql-align-justify { text-align: justify; }
        .note-content strong { font-weight: 700; }
        .note-content em { font-style: italic; }
        .note-content u { text-decoration: underline; }
        .note-content s { text-decoration: line-through; }
        .note-content a { color: #6366f1; text-decoration: underline; }
        .note-content .ql-indent-1 { padding-left: 2em; }
        .note-content .ql-indent-2 { padding-left: 4em; }
        .note-content .ql-indent-3 { padding-left: 6em; }
        .note-content code { background: #f1f5f9; border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 0.9em; }
        .note-content pre {
          background: #f1f5f9;
          border-radius: 8px;
          padding: 12px 16px;
          overflow-x: auto;
          margin-bottom: 1em !important;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .note-content img,
        .note-content video,
        .note-content iframe,
        .note-content table {
          max-width: 100%;
          height: auto;
        }
      `}</style>

      <div className="h-screen flex overflow-hidden bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <ConfirmDialog
          open={Boolean(noteToDelete)}
          title="Delete note?"
          description={noteToDelete ? `Permanently delete "${noteToDelete.title}"? This cannot be undone.` : ""}
          confirmText="Delete"
          isLoading={isDeleting}
          onClose={() => setNoteToDelete(null)}
          onConfirm={() => noteToDelete && handleDeleteNote(noteToDelete.id)}
        />

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
        <aside className={`
          shrink-0 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden
          ${sidebarCollapsed ? "w-0" : "w-72 xl:w-80"}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-slate-800 text-sm">My Notes</span>
              {notes.length > 0 && (
                <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{notes.length}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setShowCreateForm(true); setIsEditMode(false); setActiveToolbar("create"); }}
                className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
                title="New note"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="w-7 h-7 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-3 mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-xs text-red-600">{error}</p>
              <button onClick={clearError} className="text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto py-1">
            {isFetching ? (
              <div className="p-8 flex justify-center">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notes.length > 0 ? notes.map(note => (
              <button
                key={note.id}
                onClick={() => { void handleSelectNote(note); }}
                className={`
                  w-full text-left px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-colors relative group
                  ${selectedNote?.id === note.id ? "bg-indigo-50/70 border-l-2 border-l-indigo-500" : "border-l-2 border-l-transparent"}
                `}
              >
                <div className="flex items-start justify-between mb-1 gap-2">
                  <h3 className="font-medium text-slate-800 text-sm leading-tight line-clamp-1 flex-1">
                    {note.title}
                  </h3>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${masteryColors[note.mastery]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${masteryDot[note.mastery]}`} />
                    {note.mastery}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  {getNotePreviewText(note)}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FolderIcon className="w-3 h-3" />
                    {folders.find(f => f.id === note.folderId)?.name || "—"}
                  </span>
                  {note.tags?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {note.tags[0]}{note.tags.length > 1 && ` +${note.tags.length - 1}`}
                    </span>
                  )}
                </div>
              </button>
            )) : (
              <div className="p-8 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No notes found</p>
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN PANEL ───────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">

          {/* Collapsed sidebar button */}
          {sidebarCollapsed && (
            <div className="px-4 pt-4 pb-0 flex items-center gap-3">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                <PanelLeftOpen className="w-4 h-4" />
                Show Notes
              </button>
            </div>
          )}

          {/* ── CREATE FORM ── */}
          {showCreateForm ? (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-6">
                {/* Page header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Create New Note</h2>
                    <p className="text-xs text-slate-400">Start writing — your revision schedule will be set automatically</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Meta fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-b border-slate-200">
                    <div className="p-4 border-r border-slate-200 sm:col-span-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Title</label>
                      <input
                        type="text"
                        value={newNote.title}
                        onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="Note title..."
                        autoFocus
                        className="w-full text-base font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </div>
                    <div className="p-4 border-r border-slate-200">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Folder</label>
                      <select
                        value={newNote.folderId}
                        onChange={e => setNewNote({ ...newNote, folderId: e.target.value })}
                        className="w-full text-sm text-slate-700 bg-transparent outline-none cursor-pointer"
                      >
                        {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                    <div className="p-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Tags</label>
                      <input
                        type="text"
                        value={newNote.tagsInput}
                        onChange={e => setNewNote({ ...newNote, tagsInput: e.target.value })}
                        placeholder="e.g. biology, ch-1"
                        className="w-full text-sm text-slate-700 bg-transparent outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Toolbar + Editor */}
                  <EditorToolbar quillRef={createQuillRef} />
                  <ReactQuill
                    ref={createQuillRef}
                    theme="snow"
                    value={newNote.content}
                    onChange={v => setNewNote({ ...newNote, content: v })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Start writing your note here…"
                  />

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{wordCount(newNote.content)} words</span>
                      <span>·</span>
                      <span>{charCount(newNote.content)} chars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setShowCreateForm(false); setNewNote({ title: "", folderId: folders[0]?.id || "", content: "", tags: [], tagsInput: "" }); }}
                        className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateNote}
                        disabled={isCreating || !newNote.title.trim() || !htmlToPlainText(newNote.content)}
                        className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isCreating ? (
                          <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                        ) : (
                          <><Sparkles className="w-3.5 h-3.5" />Save Note</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Revision schedule hint */}
                <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-indigo-800 mb-1">Spaced Repetition Schedule</p>
                    <div className="flex gap-2 flex-wrap">
                      {["Day 3", "Day 7", "Day 14", "Day 28"].map((d, i) => (
                        <span key={i} className="text-xs bg-white border border-indigo-200 text-indigo-600 px-2.5 py-1 rounded-full">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          ) : selectedNote ? (
            /* ── VIEW / EDIT NOTE ── */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-6">
                {isEditMode ? (
                  /* EDIT MODE */
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Pencil className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Edit Note</h2>
                        <p className="text-xs text-slate-400">Changes will update your note immediately</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Meta fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-b border-slate-200">
                        <div className="p-4 border-r border-slate-200">
                          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Title</label>
                          <input
                            type="text"
                            value={editNote.title}
                            onChange={e => setEditNote({ ...editNote, title: e.target.value })}
                            className="w-full text-base font-semibold text-slate-900 bg-transparent outline-none"
                          />
                        </div>
                        <div className="p-4 border-r border-slate-200">
                          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Folder</label>
                          <select
                            value={editNote.folderId}
                            onChange={e => setEditNote({ ...editNote, folderId: e.target.value })}
                            className="w-full text-sm text-slate-700 bg-transparent outline-none cursor-pointer"
                          >
                            {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                          </select>
                        </div>
                        <div className="p-4">
                          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Tags</label>
                          <input
                            type="text"
                            value={editNote.tagsInput}
                            onChange={e => setEditNote({ ...editNote, tagsInput: e.target.value })}
                            placeholder="e.g. biology, ch-1"
                            className="w-full text-sm text-slate-700 bg-transparent outline-none placeholder:text-slate-300"
                          />
                        </div>
                      </div>

                      <EditorToolbar quillRef={editQuillRef} />
                      <ReactQuill
                        ref={editQuillRef}
                        theme="snow"
                        value={editNote.content}
                        onChange={v => setEditNote({ ...editNote, content: v })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Write your note…"
                      />

                      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{wordCount(editNote.content)} words</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditMode(false)}
                            className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={isUpdating || !editNote.title.trim() || !editNote.content.trim()}
                            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isUpdating ? "Saving…" : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* VIEW MODE */
                  <>
                    {/* Note header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <FolderIcon className="w-3.5 h-3.5" />
                            {folders.find(f => f.id === selectedNote.folderId)?.name || "—"}
                          </span>
                          <span>·</span>
                          <span>{new Date(selectedNote.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span>·</span>
                          <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${masteryColors[selectedNote.mastery]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${masteryDot[selectedNote.mastery]}`} />
                            {selectedNote.mastery}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleStartEdit}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/revision?noteId=${selectedNote.id}`)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Start Revision
                          </button>
                          <button
                            onClick={() => setNoteToDelete({ id: selectedNote.id, title: selectedNote.title })}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-3">
                        {selectedNote.title}
                      </h1>

                      {selectedNote.tags?.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-3">
                          {selectedNote.tags.map(tag => (
                            <span key={tag} className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {selectedNote.lastRevisedAt && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          Last revised {new Date(selectedNote.lastRevisedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Note content */}
                    <div
                      className="note-content bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-7 min-h-64"
                      style={{ fontFamily: "Georgia, serif", lineHeight: 1.8, color: "#1e293b" }}
                      dangerouslySetInnerHTML={{
                        __html: processQuillHtml(
                          selectedNote.content?.html || `<p>${getNotePreviewText(selectedNote)}</p>`
                        )
                      }}
                    />
                  </>
                )}
              </div>
            </div>

          ) : (
            /* ── EMPTY STATE ── */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <FileText className="w-9 h-9 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No note selected</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Pick a note from the sidebar or create a new one to get started.
                </p>
                <button
                  onClick={() => { setShowCreateForm(true); setIsEditMode(false); }}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Note
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}