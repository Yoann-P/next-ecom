"use client"

import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {Sun, Moon, SunMoon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

/*const ModeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {/!* Affiche l'icône seulement après le montage pour éviter le flash *!/}
                    {mounted && (resolvedTheme === "dark" ? (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                    ))}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};*/

const ModeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    className={"focus-visible:ring-0 focus-visible:ring-offset-0"}
                >
                    {theme === "system" ? (
                        <SunMoon/>
                    ) : theme === "dark" ? (
                        <Moon/>
                    ) : (
                        <Sun/>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Appearance
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>

                <DropdownMenuCheckboxItem
                    checked={theme === "system"}
                    onClick={() => setTheme("system")}
                >
                    System
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={theme === "dark"}
                    onClick={() => setTheme("dark")}
                >
                    Dark
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={theme === "light"}
                    onClick={() => setTheme("light")}
                >
                    Light
                </DropdownMenuCheckboxItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ModeToggle;
