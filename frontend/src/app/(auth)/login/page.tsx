"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardContent, CardFooter, CardMedia, CardDescription, CardTitle } from "@/components/ui/card";


const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Login Page</h1>

      <Button variant="outline" onClick={() => alert("Clicked")}>
        Click me
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => alert("Option 1")}>Option 1</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => alert("Option 2")}>Option 2</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => alert("Option 3")}>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Card className="p-4">
        <CardMedia
          src=""
          alt="Products"
        />
        <CardHeader>
          <h2 className="text-xl font-semibold">Card Header</h2>
        </CardHeader>
        <CardTitle>
          <p className="text-xl font-semibold">Card Title</p>
        </CardTitle>
        <CardDescription>
          <p>This is a card component.</p>
        </CardDescription>
      </Card>
    </div>
  );
};

export default Login;