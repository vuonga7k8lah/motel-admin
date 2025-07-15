"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    MoreVertical,
    ChevronDown,
    Search,
    Minus,
    Plus,
    Upload,
    X,
    Bold,
    Italic,
    List,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function debounce<F extends (...args: any[]) => any>(
    func: F,
    wait: number
): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

interface Column<T> {
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    isImage?: boolean;
}

interface FormField<T> {
    key: keyof T;
    label: string;
    type:
        | "text"
        | "email"
        | "select"
        | "radio"
        | "checkbox"
        | "image"
        | "multipleImages"
        | "richText";
    options?: { value: string; label: string }[];
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    formFields: FormField<T>[];
    modalFields?: FormField<T>[];
    title: string;
    subtitle?: string;
    onDelete?: (ids: string[]) => void;
    onSave: (item: Partial<T>) => void;
}

const RichTextEditor = ({
    defaultValue,
    onChange,
}: {
    defaultValue?: string;
    onChange: (value: string) => void;
}) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: defaultValue,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-md">
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
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={editor.isActive("bulletList") ? "bg-muted" : ""}
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-4"
            />
        </div>
    );
};

export function DataTable<T extends { id: string }>({
    data,
    columns,
    formFields,
    modalFields,
    title,
    subtitle,
    onDelete,
    onSave,
}: DataTableProps<T>) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<T> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [uploadedImages, setUploadedImages] = useState<{
        [key: string]: string[];
    }>({});
    const [richTextValues, setRichTextValues] = useState<{
        [key: string]: string;
    }>({});
    const token = useSelector((state: RootState) => state.auth.accessToken);

    const debouncedSearch = useCallback(
        debounce((value: string) => setDebouncedSearchTerm(value), 300),
        []
    );

    const handleSelectAll = () => {
        if (selectedItems.length === data.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(data.map((item) => item.id));
        }
    };

    const handleSelectItem = (itemId: string) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const fieldsToRender = modalFields || formFields;

    const handleDeleteSelected = () => {
        if (onDelete) {
            onDelete(selectedItems);
            setSelectedItems([]);
        }
    };

    const handleOpenModal = (item?: T) => {
        setEditingItem(item || {});
        setIsModalOpen(true);
        setUploadedImages({});
        setRichTextValues({});
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
        setUploadedImages({});
        setRichTextValues({});
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItem: Partial<T> = {};
        formFields.forEach((field) => {
            if (field.type === "image" || field.type === "multipleImages") {
                newItem[field.key] = uploadedImages[
                    field.key as string
                ] as unknown as T[keyof T];
            } else if (field.type === "richText") {
                newItem[field.key] = richTextValues[
                    field.key as string
                ] as T[keyof T];
            } else {
                newItem[field.key] = formData.get(
                    field.key as string
                ) as T[keyof T];
            }
        });
        if (editingItem?.id) {
            newItem.id = editingItem.id;
        }
        onSave(newItem);
        handleCloseModal();
    };

    const filteredData = data.filter((item) =>
        Object.values(item).some(
            (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
    );

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    const ImageDropzone = ({
        fieldKey,
        multiple,
    }: {
        fieldKey: string;
        multiple: boolean;
    }) => {
        const url = import.meta.env.VITE_API_URL || "http://localhost:8083/";
        const onDrop = useCallback(
            async (acceptedFiles: File[]) => {
                const uploadPromises = acceptedFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("image", file);

                    const response = await fetch(url + "admin/image", {
                        method: "POST",
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    return data.data.url; // Get the first URL from the response
                });

                const urls = await Promise.all(uploadPromises);

                setUploadedImages((prev) => ({
                    ...prev,
                    [fieldKey]: multiple
                        ? [...(prev[fieldKey] || []), ...urls]
                        : [urls[0]],
                }));
            },
            [fieldKey, multiple]
        );

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            multiple,
        });

        return (
            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer"
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>
                        Drag &apos;n&apos; drop {multiple ? "some" : "an"} image
                        {multiple ? "s" : ""} here, or click to select{" "}
                        {multiple ? "files" : "a file"}
                    </p>
                )}
                <Upload className="mx-auto mt-2" />
            </div>
        );
    };

    const ImagePreview = ({ fieldKey }: { fieldKey: string }) => {
        const images = uploadedImages[fieldKey] || [];
        return (
            <div className="mt-2 flex flex-wrap gap-2">
                {images.map((url, index) => (
                    <div key={index} className="relative">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            width={100}
                            height={100}
                            className="object-cover rounded-md"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setUploadedImages((prev) => ({
                                    ...prev,
                                    [fieldKey]: prev[fieldKey].filter(
                                        (_, i) => i !== index
                                    ),
                                }));
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                {subtitle && (
                    <div className="text-sm text-muted-foreground">
                        {subtitle}
                    </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        Showing {paginatedData.length} of {filteredData.length}{" "}
                        items
                    </div>
                    {selectedItems.length > 0 && onDelete && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={handleDeleteSelected}
                        >
                            <Minus className="h-4 w-4" />
                            Delete Selected
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search items"
                            className="pl-8 w-[250px]"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Filter
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Option 1</DropdownMenuItem>
                            <DropdownMenuItem>Option 2</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {onDelete && (
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={
                                            selectedItems.length ===
                                            paginatedData.length
                                        }
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                            )}
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key as string}
                                    className={column.header?.className}
                                >
                                    {column.title}
                                </TableHead>
                            ))}
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item) => (
                            <TableRow key={item.id}>
                                {onDelete && (
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedItems.includes(
                                                item.id
                                            )}
                                            onCheckedChange={() =>
                                                handleSelectItem(item.id)
                                            }
                                        />
                                    </TableCell>
                                )}
                                {columns.map((column) => (
                                    <TableCell key={column.key as string}>
                                        {column.isImage ? (
                                            <img
                                                src={item[column.key] as string}
                                                alt={`Image for ${column.title}`}
                                                width={50}
                                                height={50}
                                                className="object-cover rounded-md"
                                            />
                                        ) : column.render ? (
                                            column.render(
                                                item[column.key],
                                                item
                                            )
                                        ) : (
                                            (item[
                                                column.key
                                            ] as React.ReactNode)
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onSelect={() =>
                                                    handleOpenModal(item)
                                                }
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() =>
                                                    onDelete &&
                                                    onDelete([item.id])
                                                }
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between px-4 py-2 border-t">
                    <div className="flex items-center gap-2 text-sm">
                        Show
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={handleItemsPerPageChange}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                        per page
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from(
                                { length: pageCount },
                                (_, i) => i + 1
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === currentPage
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    className="w-8"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pageCount}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
                    <div className="flex-grow overflow-y-auto pr-6">
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem?.id ? "Edit Item" : "Add New Item"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="space-y-4">
                            {fieldsToRender.map((field) => (
                                <div
                                    key={field.key as string}
                                    className="space-y-2"
                                >
                                    <Label htmlFor={field.key as string}>
                                        {field.label}
                                    </Label>
                                    {field.type === "select" ? (
                                        <Select
                                            name={field.key as string}
                                            defaultValue={
                                                editingItem?.[
                                                    field.key
                                                ] as string
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={`Select ${field.label}`}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    ) : field.type === "radio" ? (
                                        <RadioGroup
                                            defaultValue={
                                                editingItem?.[
                                                    field.key
                                                ] as string
                                            }
                                        >
                                            {field.options?.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <RadioGroupItem
                                                        value={option.value}
                                                        id={`${field.key}-${option.value}`}
                                                        name={
                                                            field.key as string
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`${field.key}-${option.value}`}
                                                    >
                                                        {option.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    ) : field.type === "image" ||
                                      field.type === "multipleImages" ? (
                                        <>
                                            <ImageDropzone
                                                fieldKey={field.key as string}
                                                multiple={
                                                    field.type ===
                                                    "multipleImages"
                                                }
                                            />
                                            <ImagePreview
                                                fieldKey={field.key as string}
                                            />
                                            <input
                                                type="hidden"
                                                name={field.key as string}
                                                value={uploadedImages[
                                                    field.key as string
                                                ]?.join(",")}
                                            />
                                        </>
                                    ) : field.type === "richText" ? (
                                        <RichTextEditor
                                            defaultValue={
                                                editingItem?.[
                                                    field.key
                                                ] as string
                                            }
                                            onChange={(value) => {
                                                setRichTextValues((prev) => ({
                                                    ...prev,
                                                    [field.key as string]:
                                                        value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        <Input
                                            type={field.type}
                                            id={field.key as string}
                                            name={field.key as string}
                                            defaultValue={
                                                editingItem?.[
                                                    field.key
                                                ] as string
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                            <Button type="submit" className="w-full">
                                {editingItem?.id ? "Save Changes" : "Add Item"}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
