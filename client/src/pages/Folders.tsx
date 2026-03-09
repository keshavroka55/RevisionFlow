import { useState } from 'react';
import { Plus, Folder as FolderIcon, MoreVertical, Edit, Trash2, FileText, Clock } from 'lucide-react';

interface Folder {
  id: number;
  name: string;
  notesCount: number;
  lastUpdated: string;
  color: string;
}

export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([
    { id: 1, name: 'Physics', notesCount: 12, lastUpdated: '2 hours ago', color: 'primary' },
    { id: 2, name: 'Computer Science', notesCount: 18, lastUpdated: '1 day ago', color: 'secondary' },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const isPremium = false; // Mock - in real app would check user subscription

  const handleCreateFolder = () => {
    if (newFolderName.trim() && (folders.length < 2 || isPremium)) {
      const newFolder: Folder = {
        id: Date.now(),
        name: newFolderName,
        notesCount: 0,
        lastUpdated: 'Just now',
        color: ['primary', 'secondary', 'accent', 'warning'][folders.length % 4],
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  const handleDeleteFolder = (id: number) => {
    setFolders(folders.filter(f => f.id !== id));
  };

  const canCreateFolder = isPremium || folders.length < 2;

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">Folders</h1>
          <button
            onClick={() => setIsCreating(true)}
            disabled={!canCreateFolder}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Folder</span>
          </button>
        </div>
        <p className="text-muted-foreground">Organize your notes into folders</p>
      </div>

      {/* Free Tier Warning */}
      {!isPremium && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-warning/20 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FolderIcon className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Free Plan Limit</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You can create only 2 folders in the free plan. Upgrade to Premium for unlimited folders.
              </p>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {isCreating && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Create New Folder</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="flex-1 px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') setIsCreating(false);
              }}
            />
            <button
              onClick={handleCreateFolder}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewFolderName('');
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
                <div className={`bg-${folder.color}/10 w-14 h-14 rounded-lg flex items-center justify-center`}>
                  <FolderIcon className={`w-7 h-7 text-${folder.color}`} style={{ color: `var(--color-${folder.color})` }} />
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded-lg">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{folder.name}</h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {folder.notesCount} notes
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {folder.lastUpdated}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <button className="flex-1 bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
          <p className="text-muted-foreground mb-6">Create your first folder to organize your notes</p>
          <button
            onClick={() => setIsCreating(true)}
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
