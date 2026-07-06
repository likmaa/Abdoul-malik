'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { CategoryModal } from '@/admin-panel/components/admin/CategoryModal';

interface Category {
    id: string;
    name: { [key: string]: string };
    slug: string;
    parentId: string | null;
    isActive: boolean;
    order: number;
    children?: Category[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [flatCategories, setFlatCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (data.categories) {
                setCategories(data.categories);
            }
            if (data.flatCategories) {
                setFlatCategories(data.flatCategories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Erreur lors du chargement des catégories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleExpand = (id: string) => {
        const newExpandedIds = new Set(expandedIds);
        if (newExpandedIds.has(id)) {
            newExpandedIds.delete(id);
        } else {
            newExpandedIds.add(id);
        }
        setExpandedIds(newExpandedIds);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok) {
                alert('Catégorie supprimée');
                fetchCategories();
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Erreur serveur');
        }
    };

    const renderCategoryRow = (category: Category, depth = 0) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedIds.has(category.id);

        return (
            <div key={category.id}>
                <div
                    className="flex items-center py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
                >
                    <div className="flex items-center gap-2 flex-1">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                        ) : (
                            <div className="w-6" /> // Spacer
                        )}
                        <span className="font-medium text-gray-900">
                            {category.name.fr || category.name.en || category.slug}
                        </span>
                        {!category.isActive && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                Inactif
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 mr-4">/{category.slug}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            onClick={() => {
                                setEditingCategory(category);
                                setIsModalOpen(true);
                            }}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="p-2 text-red-600 border-red-100 hover:bg-red-50"
                            onClick={() => handleDelete(category.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="animate-in slide-in-from-top-1 duration-200">
                        {category.children!.map(child => renderCategoryRow(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
                    <p className="text-gray-600 mt-1">Organisez vos produits avec des catégories et sous-catégories</p>
                </div>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => {
                        setEditingCategory(null);
                        setIsModalOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4" />
                    <span>Nouvelle Catégorie</span>
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Chargement...</div>
                    ) : categories.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Aucune catégorie trouvée. Commencez par en créer une.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            <div className="flex items-center py-3 px-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="flex-1 pl-6">Nom / Hiérarchie</div>
                                <div className="flex items-center gap-2">
                                    <span className="mr-24">Slug</span>
                                    <span>Actions</span>
                                </div>
                            </div>
                            {categories.map(category => renderCategoryRow(category))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCategories}
                category={editingCategory}
                allCategories={flatCategories}
            />
        </div>
    );
}
