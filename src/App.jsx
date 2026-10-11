import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FileList from './components/FileList';
import FileDashboard from './components/FileDashboard';
import FileModal from './components/FileModal';
import { loadData, saveData } from './utils/storage';

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [activeFileId, setActiveFileId] = useState(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [useBengaliDigits, setUseBengaliDigits] = useState(false);

  // Sync to localStorage whenever data changes
  const updateData = (newData) => {
    setData(newData);
    saveData(newData);
  };

  // Find the currently active file
  const activeFile = data.files.find((f) => f.id === activeFileId) || null;

  // Handle create or update file
  const handleSaveFile = (fileData) => {
    let updatedFiles;
    if (editingFile) {
      updatedFiles = data.files.map((f) => (f.id === fileData.id ? fileData : f));
    } else {
      updatedFiles = [fileData, ...data.files];
      // Automatically open the newly created file's dashboard
      setActiveFileId(fileData.id);
    }
    updateData({ ...data, files: updatedFiles });
    setEditingFile(null);
  };

  // Handle delete file
  const handleDeleteFile = (fileId) => {
    const targetFile = data.files.find((f) => f.id === fileId);
    const confirmMessage = `আপনি কি নিশ্চিত যে "${targetFile?.name || 'এই ফাইলটি'}" মুছে ফেলতে চান? এতে ফাইলের সকল হিসাবও মুছে যাবে!`;
    if (window.confirm(confirmMessage)) {
      const updatedFiles = data.files.filter((f) => f.id !== fileId);
      updateData({ ...data, files: updatedFiles });
      if (activeFileId === fileId) {
        setActiveFileId(null);
      }
    }
  };

  // Handle updating a single file (when transactions change in FileDashboard)
  const handleUpdateActiveFile = (updatedFile) => {
    const updatedFiles = data.files.map((f) =>
      f.id === updatedFile.id ? updatedFile : f
    );
    updateData({ ...data, files: updatedFiles });
  };

  // Open file modal for edit
  const handleOpenEditFileModal = (file) => {
    setEditingFile(file);
    setIsFileModalOpen(true);
  };

  // Open file modal for new file
  const handleOpenNewFileModal = () => {
    setEditingFile(null);
    setIsFileModalOpen(true);
  };

  // Reload data from storage (e.g. after backup import)
  const handleDataRefresh = () => {
    const fresh = loadData();
    setData(fresh);
    if (activeFileId && !fresh.files.some(f => f.id === activeFileId)) {
      setActiveFileId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeFile={activeFile}
        onBackToFiles={() => setActiveFileId(null)}
        onOpenNewFileModal={handleOpenNewFileModal}
        onDataRefresh={handleDataRefresh}
        useBengaliDigits={useBengaliDigits}
        setUseBengaliDigits={setUseBengaliDigits}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeFile ? (
          <FileDashboard
            file={activeFile}
            onBack={() => setActiveFileId(null)}
            onUpdateFile={handleUpdateActiveFile}
            onEditFileModalOpen={handleOpenEditFileModal}
            useBengaliDigits={useBengaliDigits}
          />
        ) : (
          <FileList
            files={data.files}
            onSelectFile={(file) => setActiveFileId(file.id)}
            onOpenNewFileModal={handleOpenNewFileModal}
            onEditFile={handleOpenEditFileModal}
            onDeleteFile={handleDeleteFile}
            useBengaliDigits={useBengaliDigits}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-700">
            আমার হিসাব করি • ফাইলভিত্তিক সহজ আয় ও ব্যয় হিসাব ড্যাশবোর্ড
          </p>
          <p className="text-slate-400">
            আপনার সকল তথ্য ব্রাউজারে সুরক্ষিত থাকে। প্রয়োজনমতো ব্যাকআপ ডাউনলোড করে রাখতে পারেন।
          </p>
        </div>
      </footer>

      {/* File Create / Edit Modal */}
      <FileModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onSave={handleSaveFile}
        editFile={editingFile}
      />
    </div>
  );
}
