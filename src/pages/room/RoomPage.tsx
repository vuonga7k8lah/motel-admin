"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import useSWR from "swr";
import axiosInstance from "@/configs/axios";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/DataTable/data-table";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/DataTable/image-gallery";

export default function RoomPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const { notify } = useToast();
    const userPerPage = 10;

    interface Room {
        id: number;
        user_id: number;
        title: string;
        address: string;
        description: string;
        status: string;
        phone: string;
        price: string;
        images: string;
    }
    const initialProducts: Room[] = [
        {
            id: 1,
            title: "Premium Laptop",
            description: "High-performance laptop for professionals",
            status: "In Stock",
            images: "https://res.cloudinary.com/dsvoluvt6/image/upload/v1740553305/upload/file_mhf46f.jpg,https://res.cloudinary.com/dsvoluvt6/image/upload/v1740553305/upload/file_xpskni.jpg",
            address: "van quan",
            price: "1299.99",
            phone: "022276622",
            user_id: 2,
        },
    ];

    const columns = [
        {
            key: "title",
            title: "Title",
            cell: { className: "text-center" },
            header: { className: "text-center" },
        },
        {
            key: "images",
            title: "Thumbnail",
            render: (value: Room["images"]) => {
                console.log("Room images:", value);
                return <ImageGallery images={value} aspectRatio={2} />;
            },
            cell: { className: "text-center flex justify-center" },
            header: { className: "text-center" },
        },
        {
            key: "status",
            title: "Status",
            cell: { className: "text-center" },
            header: { className: "text-center" },
            render: (value: Room["status"]) => (
                <div className="flex justify-center">
                    <Badge
                        variant={
                            value === "PUBLISH" ? "success" : "destructive"
                        }
                    >
                        {value}
                    </Badge>
                </div>
            ),
        },
        { key: "price", title: "Price" },
        { key: "phone", title: "Phone" },
    ];
    const handlePageChange = useCallback((newPage: number) => {
        setPageIndex(newPage);
    }, []);
    const token = useSelector((state: RootState) => state.auth.accessToken);

    const fetcher = (url: string, token: string) =>
        axiosInstance.get<any>(url, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });

    const {
        data: dataList,
        error: errorDataList,
        isLoading,
        mutate: mutateDataList,
    } = useSWR(
        token
            ? [`/admin/rooms?limit=${userPerPage}&page=${pageIndex}`, token]
            : null,
        ([url, token]) => fetcher(url, token)
    );

    const data =
        dataList?.data?.data !== undefined
            ? dataList?.data?.data.data.map((data: any) => ({
                  id: data.id,
                  user_id: data.user_id,
                  title: data.title,
                  address: data.address,
                  description: data.description,
                  status: data.status,
                  phone: data.phone,
                  price: data.price,
                  images: data.images,
              }))
            : null;
    useEffect(() => {
        console.log(data);
    }, []);

    const formFields = [
        { key: "title", label: "title", type: "text" as const },
        {
            key: "images",
            label: "Product Gallery",
            type: "multipleImages" as const,
        },
        {
            key: "price",
            label: "Price",
            type: "text" as const,
        },
        {
            key: "status",
            label: "Status",
            type: "select" as const,
            options: [
                { value: "PUBLISH", label: "Publish" },
                { value: "DRAFT", label: "Draft" },
            ],
        },
        {
            key: "category",
            label: "Building",
            type: "select" as const,
            options: [
                { value: "PUBLISH", label: "Publish" },
                { value: "DRAFT", label: "Draft" },
            ],
        },
    ];
    const handleDelete = async (id: number) => {
        try {
            await axiosApi.delete(`users/${id}`);
            mutate();
            toast.success("사용자를 삭제했습니다.");
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSaveOrUpdate = async (data: Partial<Room>) => {
        if (data.id) {
            const response = await axiosInstance.put(
                `/api/v1/products/${data.id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }
            );

            mutate();
            notify(response.data.message || "Login successful!", {
                type: "success",
            });
        } else {
            try {
                const response = await axiosInstance.post(
                    `/api/v1/products`,
                    data,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token ? `Bearer ${token}` : "",
                        },
                    }
                );

                mutate();
                notify(response.data.message || "Login successful!", {
                    type: "success",
                });
            } catch (error) {
                console.error("Error updating data:", error);
            }
        }
        mutateDataList();
    };

    return isLoading ? (
        <p>Loading...</p>
    ) : (
        <DataTable
            data={data ?? initialProducts}
            columns={columns}
            title="Page List Room"
            subtitle="Manage List Room"
            formFields={formFields}
            onDelete={handleDelete}
            onSave={handleSaveOrUpdate}
        />
    );
}
