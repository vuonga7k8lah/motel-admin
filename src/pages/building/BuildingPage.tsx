"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import useSWR, { mutate } from "swr";
import axiosInstance from "@/configs/axios";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/DataTable/data-table";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/DataTable/image-gallery";
import dayjs from "dayjs";

export default function BuildingPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const { notify } = useToast();
    const userPerPage = 10;

    interface Building {
        id: number;
        user_id: number;
        title: string;
        address: string;
        description: string;
        status: string;
        phone: string;
        price: string;
        images: string;
        created_at: string;
    }
    const initialProducts: Building[] = [
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
            created_at: "2023-08-01T10:00:00Z",
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
            render: (value: Building["images"]) => {
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

        {
            key: "created_at",
            title: "Created at",
            render: (value: Building["created_at"]) => {
                return (
                    <div className="text-center">
                        {dayjs(value).format("DD/MM/YYYY")}
                    </div>
                );
            },
            cell: { className: "text-center flex justify-center" },
            header: { className: "text-center" },
        },
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
            ? [`/admin/buildings?limit=${userPerPage}&page=${pageIndex}`, token]
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
                  status: "active",
                  phone: data.phone,
                  price: data.price,
                  images: data.images,
              }))
            : null;
    useEffect(() => {
        console.log(data);
    }, []);

    const formFields = [
        { key: "title", label: "Title building", type: "text" as const },
        { key: "address", label: "Address building", type: "text" as const },
        {
            key: "imgs",
            label: "Building gallery",
            type: "multipleImages" as const,
        },
        {
            key: "description",
            label: "Description",
            type: "richText" as const,
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

    const handleSaveOrUpdate = async (data: Partial<Building>) => {
        
        
        if (data.id) {
            const response = await axiosInstance.put(
                `/api/v1/buildings/${data.id}`,
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
                    `/admin/buildings`,
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
            title="Page List Building"
            subtitle="Manage List Building"
            formFields={formFields}
            onDelete={handleDelete}
            onSave={handleSaveOrUpdate}
        />
    );
}
