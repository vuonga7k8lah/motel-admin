import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { create } from "../../services/categoryProductActions";
interface FormCategoryData {
    name: string;
    status: string;
    parent_id: number;
}

export function DialogCreateOrUpdate({ buttonName, title }): JSX.Element {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(
        (state) => state.productCategory
    );
    const [data, setData] = useState<FormCategoryData>({
        name: "",
        status: "",
        parent_id: 0,
    });
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async () => {
        try {
            //setLoading(true);
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("status", data.status);
            formData.append("parent_id", data.parent_id);
            dispatch(create(formData));
            // if (idBlog) {
            //     // Update existing blog
            //     const response = await axiosApi.put(
            //         `/blogs/${idBlog}`,
            //         formData,
            //         {
            //             headers: {
            //                 "Content-Type": "multipart/form-data",
            //             },
            //         }
            //     );
            //     if (response.status === 201) {
            //         toast.success("Blog Update successfully!");
            //         matchMutate(/^\/api\/blogs/);
            //         setLoading(false);
            //         setOpenDialog(false);
            //     }
            // } else {
            // // Create new blog
            // const response = await axiosApi.post("blogs", formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            // });

            //     if (response.status === 201) {
            //         toast.success("Blog created successfully!");
            //         matchMutate(/^\/api\/blogs/);
            //         setLoading(false);
            //         setOpenDialog(false);
            //     }
            // }
        } catch (error) {
            // toast.error("Error saving blog");
            // console.error("Error saving blog:", error);
        }
    };
    console.log(data);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{buttonName}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-6 space-y-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Please fill out the information below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="name"
                            className="text-right text-gray-700"
                        >
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleInputChange}
                            className="col-span-3 border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="status"
                            className="text-right text-gray-700"
                        >
                            Status
                        </Label>
                        <Input
                            id="status"
                            name="status"
                            value={data.status}
                            onChange={handleInputChange}
                            className="col-span-3 border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="parentId"
                            className="text-right text-gray-700"
                        >
                            Parent Id
                        </Label>
                        <Input
                            id="parentId"
                            name="parent_id"
                            type="number"
                            value={data.parent_id}
                            onChange={handleInputChange}
                            className="col-span-3 border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        onClick={() => handleSubmit()}
                        className="bg-black text-white"
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
