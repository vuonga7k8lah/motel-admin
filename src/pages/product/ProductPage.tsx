"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import useSWR from "swr";
import axiosInstance from "@/configs/axios";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/DataTable/data-table";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function ListUser() {
    const [pageIndex, setPageIndex] = useState(0);
    const { notify } = useToast();
    const userPerPage = 10;

    interface Product {
        id: string;
        name: string;
        description: string;
        richDescription: string;
        status: "In Stock" | "Out of Stock" | "Low Stock";
        category: string;
        thumbnail: string;
        gallery: string;
        price: string;
        stock_quantity: string;
    }
    const initialProducts: Product[] = [
        {
            id: "1",
            name: "Premium Laptop",
            description: "High-performance laptop for professionals",
            richDescription: `
        <h2>Premium Laptop Specifications</h2>
        <p>This high-performance laptop is designed for professionals who demand the best. It comes with the following features:</p>
        <ul>
          <li>Latest generation Intel Core i9 processor</li>
          <li>32GB DDR4 RAM</li>
          <li>1TB NVMe SSD</li>
          <li>NVIDIA RTX 3080 Graphics Card</li>
          <li>15.6" 4K OLED Display</li>
          <li>Thunderbolt 4 ports</li>
          <li>Wi-Fi 6E and Bluetooth 5.2</li>
          <li>Backlit keyboard with numpad</li>
          <li>Large precision touchpad</li>
          <li>HD webcam with privacy shutter</li>
          <li>All-day battery life</li>
          <li>Fingerprint reader and facial recognition</li>
          <li>Premium aluminum chassis</li>
          <li>Advanced cooling system</li>
          <li>Pre-installed productivity software suite</li>
        </ul>
        <p>This laptop is perfect for:</p>
        <ul>
          <li>Video editing and 3D rendering</li>
          <li>Software development</li>
          <li>Data analysis and visualization</li>
          <li>Virtual machine hosting</li>
          <li>High-end gaming</li>
        </ul>
        <p>With its powerful specifications and versatile features, this premium laptop is the ultimate tool for professionals who need uncompromising performance in a portable package.</p>
      `,
            status: "In Stock",
            category: "Electronics",
            thumbnail: "",
            gallery: "",
            price: "1299.99",
            stock_quantity: "10",
        },
    ];

    const columns = [
        { key: "name", title: "Name" },
        {
            key: "thumbnail",
            title: "Thumbnail",
            render: (value: Product["thumbnail"]) => (
                <AspectRatio ratio={5 / 5} className="bg-muted">
                    <img
                        src={value ?? ""}
                        alt="Photo by Drew Beamer"
                        className="h-full w-full rounded-md object-cover"
                    />
                </AspectRatio>
            ),
        },
        {
            key: "status",
            title: "Status",
            render: (value: Product["status"]) => (
                <Badge
                    variant={value === "PUBLISH" ? "success" : "destructive"}
                >
                    {value}
                </Badge>
            ),
        },
        { key: "price", title: "Price" },
        { key: "qty", title: "Quantity" },
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
        mutate: mutateDataList,
    } = useSWR(
        token
            ? [`/api/v1/products?limit=${userPerPage}&page=${pageIndex}`, token]
            : null,
        ([url, token]) => fetcher(url, token)
    );
    const {
        data: categoryOption,
        error,
        mutate,
    } = useSWR(
        token
            ? [
                  `/api/v1/products/categories?limit=${userPerPage}&page=${pageIndex}`,
                  token,
              ]
            : null,
        ([url, token]) => fetcher(url, token)
    );

    const data =
        dataList?.data?.info !== undefined
            ? dataList?.data?.info.items.map((data: any) => ({
                  id: data.id,
                  name: data.name,
                  description: data.description,
                  thumbnail: data.thumbnail,
                  price: data.price + "$",
                  qty: data.stockQuantity,
                  status: data.status,
                  gallery: data.images,
                  categories: data.categories,
                  activity: new Date(data.created_at).toLocaleDateString(
                      "en-GB"
                  ),
              }))
            : null;

    const formFields = [
        { key: "name", label: "Name", type: "text" as const },
        { key: "stock_quantity", label: "Quantity", type: "text" as const },
        {
            key: "description",
            label: "Detailed Description",
            type: "richText" as const,
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
            label: "Category",
            type: "select" as const,
            options: categoryOption?.data?.info.items.map((category: any) => {
                return {
                    value: category.id.toString(),
                    label: category.name,
                };
            }) ?? [
                { value: "PUBLISH", label: "Publish" },
                { value: "DRAFT", label: "Draft" },
            ],
        },
        { key: "price", label: "Price", type: "text" as const },
        {
            key: "thumbnail",
            label: "Product Thumbnail",
            type: "image" as const,
        },
        {
            key: "images",
            label: "Product Gallery",
            type: "multipleImages" as const,
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

    const handleSaveOrUpdate = async (data: Partial<Product>) => {
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

    return (
        <DataTable
            data={data ?? initialProducts}
            columns={columns}
            title="Page List Product"
            subtitle="Manage List Product"
            formFields={formFields}
            onDelete={handleDelete}
            onSave={handleSaveOrUpdate}
        />
    );
}
