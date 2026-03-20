import { useState, useEffect } from "react";
import {
  Plus,
  Folder as FolderIcon,
  Edit,
  Trash2,
  FileText,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFolderStore, useFolderLoading } from "../store/folder.store";
import { useAuthStore } from "../store/auth.store";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Folders() {
  const navigate = useNavigate();

  const { folders, error, fetchFolders, createFolder, updateFolder, deleteFolder, clearError } =
    useFolderStore();
  const { user } = useAuthStore();

  const isFetching = useFolderLoading("folder.fetchAll");
  const isCreating = useFolderLoading("folder.create");
  const isDeleting = useFolderLoading("folder.delete");
  const isUpdating = useFolderLoading("folder.update");


  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#4F46E5");
  // folder edit and save one. 
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#4F46E5");
  const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null);

  // Check premium — replace with real user.role or subscription check
  const isPremium = user?.role === "ADMIN";
  const canCreateFolder = isPremium || folders.length < 10;

  // Fetch folders when page loads
  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder({ name: newFolderName, color: newFolderColor });
      setNewFolderName("");
      setNewFolderColor("#4F46E5");
      setShowCreateForm(false);
    } catch {
      // error is already in store
    }
  };

  const startEdit = (id: string, name: string, color: string) => {
    setEditingId(id);
    setEditName(name);
    setEditColor(color);
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    await updateFolder(editingId, { name: editName.trim(), color: editColor });
    setEditingId(null);
  };

  const handleDeleteFolder = async (id: string) => {
    await deleteFolder(id);
    setFolderToDelete(null);
  };

  if (isFetching) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      <ConfirmDialog
        open={Boolean(folderToDelete)}
        title="Delete folder?"
        description={
          folderToDelete
            ? `This will delete "${folderToDelete.name}" and all notes inside it. This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmText="Delete Folder"
        isLoading={isDeleting}
        onClose={() => setFolderToDelete(null)}
        onConfirm={() => {
          if (!folderToDelete) return;
          handleDeleteFolder(folderToDelete.id);
        }}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">Folders</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            disabled={!canCreateFolder || isCreating}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Folder</span>
          </button>
        </div>
        <p className="text-muted-foreground">Organize your notes into folders</p>
      </div>

      {/* Store error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Free tier warning */}
      {!isPremium && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-warning/20 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <FolderIcon className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Free Plan Limit</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You can create only 10 folders in the free plan. Upgrade to Premium for unlimited folders.
              </p>
              <button
                onClick={() => navigate("/dashboard/upgrade")}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Create New Folder</h3>
          <div className="flex gap-3 items-center">
            {/* Color picker */}
            <input
              type="color"
              value={newFolderColor}
              onChange={(e) => setNewFolderColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-border"
              title="Pick folder color"
            />
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="flex-1 px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") setShowCreateForm(false);
              }}
            />
            <button
              onClick={handleCreateFolder}
              disabled={isCreating || !newFolderName.trim()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewFolderName("");
              }}
              className="bg-muted text-foreground px-6 py-2 rounded-lg hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Folders Grid */}
      {folders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${folder.color}20` }}
                >
                  <FolderIcon
                    className="w-7 h-7"
                    style={{ color: folder.color }}
                  />
                </div>
              </div>

              {editingId === folder.id ? (
                <div className="mb-3 space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Folder name..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Color</label>
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-border"
                    />
                  </div>
                </div>
              ) : (
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {folder.name}
                </h3>
              )}

              {folder.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {folder.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {folder.isDefault ? "Default" : "Custom"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(folder.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                {editingId === folder.id ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEdit();
                      }}
                      disabled={isUpdating || !editName.trim()}
                      className="flex-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(folder.id, folder.name, folder.color);
                      }}
                      className="flex-1 bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFolderToDelete({ id: folder.id, name: folder.name });
                      }}
                      disabled={isDeleting || folder.isDefault}
                      className="px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={folder.isDefault ? "Cannot delete default folder" : "Delete folder"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No folders yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first folder to organize your notes
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create your first folder
          </button>
        </div>
      )}
    </div>
  );
}