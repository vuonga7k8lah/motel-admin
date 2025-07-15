import {
    BatteryChargingIcon,
    BeefIcon,
    Building,
    Calendar,
    ChevronUp,
    CopyPlus,
    Home,
    Hourglass,
    HouseIcon,
    Inbox,
    List,
    Rocket,
    Search,
    ServerIcon,
    Settings,
    TableProperties,
    User2,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { logout } from "@/redux/slice/authSlice";

const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Building",
        url: "#",
        icon: Building,
        sub: [
            {
                title: "Add Building",
                url: "/admin/building",
                icon: CopyPlus,
            },
        ],
    },
    {
        title: "Service",
        url: "#",
        icon: ServerIcon,
        sub: [
            {
                title: "Add Service",
                url: "/admin/service",
                icon: CopyPlus,
            },
        ],
    },
    // {
    //     title: "Product",
    //     url: "#",
    //     icon: Rocket,
    //     sub: [
    //         {
    //             title: "List Product",
    //             url: "/admin/products",
    //             icon: TableProperties,
    //         },
    //         {
    //             title: "Add Product",
    //             url: "/admin/products/add",
    //             icon: CopyPlus,
    //         },
    //     ],
    // },
    {
        title: "Rooms",
        url: "#",
        icon: BatteryChargingIcon,
        sub: [
            {
                title: "List Rooms",
                url: "/admin/rooms",
                icon: List,
            },
            {
                title: "Add Rooms",
                url: "/admin/rooms/create",
                icon: CopyPlus,
            },
        ],
    },
    {
        title: "User",
        url: "users",
        icon: User2,
        sub: [
            {
                title: "Add User",
                url: "/admin/users",
                icon: CopyPlus,
            },
        ],
    },

    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];
import { useDispatch, useSelector } from "react-redux";
import { NavUser } from "../Layout/nav-user";
import { RootState } from "@/redux/store";

export function AppSidebar() {
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const dispatch = useDispatch();
    const logoutAction = () => {
        // Logic for logging out, like dispatching an action
        dispatch(logout());
    };

    // @ts-ignore
    const toggleSubmenu = (title) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a
                                            href={item.url}
                                            onClick={() =>
                                                item.sub &&
                                                toggleSubmenu(item.title)
                                            }
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                            {item.sub && (
                                                <ChevronUp
                                                    className={`ml-auto ${
                                                        openSubmenu ===
                                                        item.title
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                    {item.sub && openSubmenu === item.title && (
                                        <div className="pl-4">
                                            {item.sub.map((subItem) => (
                                                <SidebarMenuItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuButton asChild>
                                                        <a href={subItem.url}>
                                                            <subItem.icon />
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </div>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={{
                        name: user?.username || "John Doe",
                        email: user?.email || "johndoe",
                        avatar: "https://github.com/shadcn.png",
                    }}
                    handleLogout={logoutAction}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
