"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import useSWR from "swr";
import axiosInstance from "@/configs/axios";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/DataTable/data-table";
import { Badge } from "@/components/ui/badge";

export default function ListUser() {
    const [pageIndex, setPageIndex] = useState(0);
    const { notify } = useToast();
    const userPerPage = 10;

    interface CategoryProduct {
        id: string;
        name: string;
        parent_id: string;
        status: "PUBLISH" | "DRAFT";
        activity: string;
    }

    const categories: CategoryProduct[] = [
        {
            id: "1",
            name: "Jessica Evans",
            parent_id: "111",
            status: "PUBLISH",
            activity: "Today, 13:45",
        },
        // Add more users...
    ];

    const columns = [
        { key: "name", title: "Name" },
        { key: "parent_id", title: "Parent ID" },
        {
            key: "status",
            title: "Status",
            render: (value: CategoryProduct["status"]) => (
                <Badge variant={value == "PUBLISH" ? "success" : "warning"}>
                    {value}
                </Badge>
            ),
        },
        { key: "activity", title: "Activity" },
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
        data: dataUserList,
        error,
        mutate,
    } = useSWR(
        token
            ? [`admin/services?limit=${userPerPage}&page=${pageIndex}`, token]
            : null,
        ([url, token]) => fetcher(url, token)
    );

    const data = dataUserList?.data?.info.items.map((data: any) => ({
        id: data.id,
        name: data.name,
        parent_id: data.parent_id,
        status: data.status,
        activity: new Date(data.created_at).toLocaleDateString("en-GB"),
    }));

    const formFields = [
        { key: "title", label: "Title", type: "text" as const },
        {
            key: "status",
            label: "Status",
            type: "select" as const,
            options: [
                { value: "PUBLISH", label: "Publish" },
                { value: "DRAFT", label: "Draft" },
            ],
        },
        { key: "icon", label: "Icon", type: "text" as const },
    ];

    const handleDelete = async (id: number) => {
        try {
            await axiosApi.delete(`users/${id}`);
            mutate();
            toast.success("");
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSaveOrUpdate = async (data: Partial<CategoryProduct>) => {
        console.log(data);

        if (data.id) {
            const response = await axiosInstance.put(
                `/api/v1/products/categories/${data.id}`,
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
                    `/api/v1/products/categories`,
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
    };

    return (
        <DataTable
            data={data ?? categories}
            columns={columns}
            title="Page Product Category"
            subtitle="Manage your product category"
            formFields={formFields}
            onDelete={handleDelete}
            onSave={handleSaveOrUpdate}
        />
    );
}
