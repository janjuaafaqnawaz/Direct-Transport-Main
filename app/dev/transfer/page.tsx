"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transferCollectionAndReuploadImages } from "@/app/actions/transferAndReupload";

export default function Home() {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await transferCollectionAndReuploadImages(formData);
    setResult(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mt-6 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Firebase Collection Transfer with Image Re-upload
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="sourceApiKey">Source API Key</Label>
          <Input type="text" id="sourceApiKey" name="sourceApiKey" required />
        </div>
        <div>
          <Label htmlFor="sourceProjectId">Source Project ID</Label>
          <Input
            type="text"
            id="sourceProjectId"
            name="sourceProjectId"
            required
          />
        </div>
        <div>
          <Label htmlFor="targetApiKey">Target API Key</Label>
          <Input type="text" id="targetApiKey" name="targetApiKey" required />
        </div>
        <div>
          <Label htmlFor="targetProjectId">Target Project ID</Label>
          <Input
            type="text"
            id="targetProjectId"
            name="targetProjectId"
            required
          />
        </div>
        <div>
          <Label htmlFor="sourceCollection">Source Collection</Label>
          <Input
            type="text"
            id="sourceCollection"
            name="sourceCollection"
            required
          />
        </div>
        <div>
          <Label htmlFor="targetCollection">Target Collection</Label>
          <Input
            type="text"
            id="targetCollection"
            name="targetCollection"
            required
          />
        </div>
        <br />
        <Label htmlFor="targetStorageBucket">(optional)</Label>
        <div>
          <Label htmlFor="imageField">Image field array </Label>
          <Input
            type="text"
            id="imageField"
            name="imageField"
            placeholder="e.g., images"
          />
        </div>
        <div>
          <Label htmlFor="targetStorageBucket">Target storage bucket </Label>
          <Input
            type="text"
            id="targetStorageBucket"
            name="targetStorageBucket"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Processing..."
            : "Transfer Collection and Re-upload Images"}
        </Button>
      </form>
      {result && (
        <div
          className={`mt-4 p-4 rounded ${
            result.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
