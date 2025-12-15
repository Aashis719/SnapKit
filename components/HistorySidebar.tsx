import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getUserHistory, deleteGeneration } from '../services/supabaseService';
import { Icons } from './ui/Icons';
import { SocialKitResult } from '../types';

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    onSelect: (result: SocialKitResult, imageUrl: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, userId, onSelect }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            loadHistory();
        }
    }, [isOpen, userId]);

    const loadHistory = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await getUserHistory(userId);
            setHistory(data || []);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            await deleteGeneration(id);
            setHistory(prev => prev.filter(item => item.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting generation:', error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 right-0 w-80 bg-surface border-l border-surfaceHighlight z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-surfaceHighlight">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Icons.History className="w-5 h-5 text-primary" /> History
                    </h2>
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-60px)] p-4 space-y-4">
                    {!userId ? (
                        <div className="text-center text-text-muted mt-10">
                            Please sign in to view history.
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center mt-10 text-primary">
                            <Icons.RefreshCw className="w-6 h-6 animate-spin" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center text-text-muted mt-10">
                            No generations yet.
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="bg-surfaceHighlight rounded-xl overflow-hidden border border-transparent hover:border-primary transition-all relative group"
                            >
                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm(item.id);
                                    }}
                                    className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete"
                                >
                                    <Icons.X className="w-4 h-4 text-white" />
                                </button>

                                <div
                                    onClick={() => onSelect(item.results, item.image?.cloudinary_url)}
                                    className="cursor-pointer"
                                >
                                    <div className="aspect-video relative bg-black/20">
                                        {item.image?.cloudinary_url && (
                                            <img
                                                src={item.image.cloudinary_url}
                                                alt="History Item"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                            <p className="text-xs text-white font-medium truncate">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs text-text-muted line-clamp-2">
                                            {item.results?.analysis?.summary || "No summary available"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <>
                    <div
                        className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
                        onClick={() => setDeleteConfirm(null)}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-surface border border-surfaceHighlight rounded-2xl p-6 w-80 shadow-2xl">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                <Icons.AlertCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Delete this kit?</h3>
                            <p className="text-sm text-text-muted">
                                Are you sure you want to delete this generation? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 bg-surfaceHighlight hover:bg-surface text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Icons.RefreshCw className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
