'use client';

import { useState, useRef, useCallback } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}

// Icônes communes pour les descriptions de produits
const ICONS = [
    { icon: '✓', label: 'Check' },
    { icon: '✗', label: 'Cross' },
    { icon: '★', label: 'Étoile' },
    { icon: '●', label: 'Point' },
    { icon: '→', label: 'Flèche' },
    { icon: '⚡', label: 'Éclair' },
    { icon: '🔥', label: 'Feu' },
    { icon: '💎', label: 'Diamant' },
    { icon: '🎯', label: 'Cible' },
    { icon: '🚀', label: 'Fusée' },
    { icon: '💡', label: 'Idée' },
    { icon: '⭐', label: 'Étoile 2' },
    { icon: '📦', label: 'Colis' },
    { icon: '🛡️', label: 'Protection' },
    { icon: '♻️', label: 'Recyclage' },
    { icon: '🌿', label: 'Écologique' },
];

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Entrez la description...',
    rows = 6
}: RichTextEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showIcons, setShowIcons] = useState(false);

    const insertText = useCallback((before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        const newValue =
            value.substring(0, start) +
            before + selectedText + after +
            value.substring(end);

        onChange(newValue);

        // Repositionner le curseur
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + before.length + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    }, [value, onChange]);

    const insertIcon = useCallback((icon: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newValue = value.substring(0, start) + icon + ' ' + value.substring(start);
        onChange(newValue);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + icon.length + 1, start + icon.length + 1);
        }, 0);

        setShowIcons(false);
    }, [value, onChange]);

    const formatBold = () => insertText('**', '**');
    const formatItalic = () => insertText('*', '*');
    const formatList = () => insertText('\n• ');
    const formatNewLine = () => insertText('\n');

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-electric focus-within:border-transparent">
            {/* Barre d'outils */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap">
                <button
                    type="button"
                    onClick={formatBold}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Gras (**texte**)"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={formatItalic}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Italique (*texte*)"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
                    </svg>
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={formatList}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Liste à puces"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={formatNewLine}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Nouvelle ligne"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
                    </svg>
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Sélecteur d'icônes */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowIcons(!showIcons)}
                        className={`p-2 hover:bg-gray-200 rounded-lg transition-colors ${showIcons ? 'bg-gray-200' : ''}`}
                        title="Insérer une icône"
                    >
                        <span className="text-lg">😀</span>
                    </button>

                    {showIcons && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 grid grid-cols-4 gap-1 min-w-[160px]">
                            {ICONS.map((item) => (
                                <button
                                    key={item.icon}
                                    type="button"
                                    onClick={() => insertIcon(item.icon)}
                                    className="p-2 text-lg hover:bg-gray-100 rounded transition-colors"
                                    title={item.label}
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1"></div>

                <span className="text-xs text-gray-500">
                    Markdown supporté: **gras**, *italique*
                </span>
            </div>

            {/* Zone de texte */}
            <textarea
                ref={textareaRef}
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 resize-none border-0 focus:outline-none focus:ring-0"
            />

            {/* Prévisualisation si du texte est présent */}
            {value && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2">Aperçu :</p>
                    <div
                        className="text-sm text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: value
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/\n/g, '<br />')
                        }}
                    />
                </div>
            )}
        </div>
    );
}
