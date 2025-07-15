import { DataTable } from "@/components/DataTable/data-table";
import { Badge } from "@/components/ui/badge";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "Remote" | "In Office" | "On Leave";
    location: string;
    activity: string;
}

const users: User[] = [
    {
        id: "1",
        name: "Jessica Evans",
        email: "jessica.evans@gmail.com",
        role: "Designer",
        status: "Remote",
        location: "Poland",
        activity: "Today, 13:45",
    },
    // Add more users...
];

const columns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role" },
    {
        key: "status",
        title: "Status",
        render: (value: User["status"]) => (
            <Badge
                variant={
                    value === "Remote"
                        ? "secondary"
                        : value === "In Office"
                        ? "success"
                        : "destructive"
                }
            >
                {value}
            </Badge>
        ),
    },
    { key: "location", title: "Location" },
    { key: "activity", title: "Activity" },
];
const formFields = [
    { key: "name", label: "Name", type: "text" as const },
    {
        key: "status",
        label: "Status",
        type: "select" as const,
        options: [
            { value: "PUBLISH", label: "Publish" },
            { value: "DRAFT", label: "Draft" },
        ],
    },
    { key: "parent_id", label: "Category Parent", type: "number" as const },
];

export default function UserPage() {
    return (
        <DataTable
            data={users}
            columns={columns}
            formFields={formFields}
            title="Team Crew"
            subtitle="Manage your team members and their roles"
            onDelete={(ids) => console.log("Delete users:", ids)}
            onAdd={() => console.log("Add new user")}
        />
    );
}
