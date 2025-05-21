import router from "next/router";
import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";

const EmptyCollection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Tokens Found</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Your collection is empty. Create a new token to get started!
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push("/create-mint")}>
          Create New Token
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyCollection;
