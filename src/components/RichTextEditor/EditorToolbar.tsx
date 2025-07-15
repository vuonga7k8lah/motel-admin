import { Editor } from "@tiptap/react";
import { Bold, Italic, List } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    editor: Editor;
};

export const EditorToolbar = ({ editor }: Props) => {
    if (!editor) return null;

    return (
        <div className="border-b p-2 flex gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-muted" : ""}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-muted" : ""}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-muted" : ""}
            >
                <List className="h-4 w-4" />
            </Button>
        </div>
    );
};
