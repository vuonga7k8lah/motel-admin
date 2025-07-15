import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToolbar } from "./EditorToolbar";

type Props = {
    defaultValue?: string;
    onChange: (value: string) => void;
};

export const RichTextEditor = ({ defaultValue, onChange }: Props) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: defaultValue,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div className="border rounded-md">
            <EditorToolbar editor={editor} />
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-4"
            />
        </div>
    );
};
