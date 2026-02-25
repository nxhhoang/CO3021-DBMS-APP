import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = DropdownMenuPrimitive.Content
export const DropdownMenuItem = DropdownMenuPrimitive.Item
export const DropdownMenuLabel = DropdownMenuPrimitive.Label
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuDemo = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => alert("Item 1 selected")}>
                    Item 1
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => alert("Item 2 selected")}>
                    Item 2
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => alert("Item 3 selected")}>
                    Item 3
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropdownMenuDemo;