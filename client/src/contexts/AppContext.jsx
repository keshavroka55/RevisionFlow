import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// App-level UI/data state (folders, notes, selections, loading flags).
// This depends on auth state, so AppProvider must be inside AuthProvider.
export const AppContext = createContext(null);

export function useApp() {
  // Safe access helper for AppContext consumers.
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  // Read auth status from AuthContext to reset app data after logout.
  const { isAuthenticated } = useAuth();
  
  // Global app state
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Reset state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setFolders([]);
      setNotes([]);
      setSelectedFolder(null);
      setSelectedNote(null);
    }
  }, [isAuthenticated]);

  const value = {
    // Folders state
    folders,
    setFolders,
    selectedFolder,
    setSelectedFolder,
    isLoadingFolders,
    setIsLoadingFolders,

    // Notes state
    notes,
    setNotes,
    selectedNote,
    setSelectedNote,
    isLoadingNotes,
    setIsLoadingNotes,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
