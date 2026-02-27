'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Placeholder } from '@/components/ui/placeholder';
import { Wireframe } from '@/components/ui/wireframe';

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      {/* <h1 className="text-3xl font-bold">Login Page</h1> */}

      {/* <Button variant="link" onClick={() => alert("Clicked")}>
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
      </DropdownMenu> */}
      {/* <Card className="p-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Card Header</h2>
        </CardHeader>
        <CardTitle>
          <p className="text-xl font-semibold">Card Title</p>
        </CardTitle>
        <CardDescription>
          <p>This is a card component.</p>
        </CardDescription>
      </Card> */}
      <Wireframe
        label="Login Form"
        className="flex h-auto w-3xl justify-center"
      >
        <div className="flex w-full flex-col justify-between gap-4">
          <Placeholder label="Email Input" size="sm" />
          <Placeholder label="Password Input" size="sm" />
          <Placeholder label="Submit Button" size="sm" />
        </div>
      </Wireframe>
    </div>
  );
};

export default Login;
