import React from "react";
import {Outlet} from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/App-Sidebar/AppSidebar"
const layout: React.FC = () => {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <SidebarTrigger />
                    <Outlet/>
                </main>
            </SidebarProvider>
        </>
    );
}
export default layout;
