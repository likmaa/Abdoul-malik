'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { Button } from '@/frontend/components/ui/Button';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category?: any; // If provided, we are editing
    allCategories: any[]; // For parent selection
}

export function CategoryModal({ isOpen, onClose, onSuccess, category, allCategories }: CategoryModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name_fr: '',
        name_en: '',
        slug: '',
        parentId: '',
        isActive: true,
        order: 0,
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name_fr: category.name?.fr || '',
                name_en: category.name?.en || '',
                slug: category.slug || '',
                parentId: category.parentId || '',
                isActive: category.isActive !== undefined ? category.isActive : true,
                order: category.order || 0,
            });
        } else {
            setFormData({
                name_fr: '',
                name_en: '',
                slug: '',
                parentId: '',
                isActive: true,
                order: 0,
            });
        }
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = category
                ? `/api/admin/categories/${category.id}`
                : '/api/admin/categories';

            const method = category ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: { fr: formData.name_fr, en: formData.name_en },
                    slug: formData.slug,
                    parentId: formData.parentId || null,
                    isActive: formData.isActive,
                    order: Number(formData.order),
                }),
            });

            if (res.ok) {
                alert(category ? 'Catégorie mise à jour' : 'Catégorie créée');
                onSuccess();
                onClose();
            } else {
                const error = await res.json();
                alert(error.error || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Erreur serveur');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to get the full path of a category (e.g., "Parent > Child")
    const getCategoryPath = (cat: any) => {
        const path = [cat.name.fr || cat.name.en || cat.slug];
        let currentParentId = cat.parentId;

        while (currentParentId) {
            const parent = allCategories.find(c => c.id === currentParentId);
            if (parent) {
                path.unshift(parent.name.fr || parent.name.en || parent.slug);
                currentParentId = parent.parentId;
            } else {
                break;
            }
        }
        return path.join(' > ');
    };

    // Flatten categories for select 
    const availableParents = allCategories
        .filter(c => c.id !== (category?.id))
        .map(c => ({
            id: c.id,
            label: getCategoryPath(c)
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">
                            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom (FR) *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name_fr}
                                    onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    placeholder="Électronique"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom (EN)</label>
                                <input
                                    type="text"
                                    value={formData.name_en}
                                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    placeholder="Electronics"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                placeholder="electronique"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie Parente</label>
                            <select
                                value={formData.parentId}
                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                            >
                                <option value="">Aucune (Catégorie Racine)</option>
                                {availableParents.map((parent) => (
                                    <option key={parent.id} value={parent.id}>
                                        {parent.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
