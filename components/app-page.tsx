'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Collection Transfer</h1>
      <form action="/transfer" method="POST" className="space-y-4">
        <div>
          <Label htmlFor="sourceApiKey">Source API Key</Label>
          <Input type="text" id="sourceApiKey" name="sourceApiKey" required />
        </div>
        <div>
          <Label htmlFor="sourceProjectId">Source Project ID</Label>
          <Input type="text" id="sourceProjectId" name="sourceProjectId" required />
        </div>
        <div>
          <Label htmlFor="targetApiKey">Target API Key</Label>
          <Input type="text" id="targetApiKey" name="targetApiKey" required />
        </div>
        <div>
          <Label htmlFor="targetProjectId">Target Project ID</Label>
          <Input type="text" id="targetProjectId" name="targetProjectId" required />
        </div>
        <div>
          <Label htmlFor="sourceCollection">Source Collection</Label>
          <Input type="text" id="sourceCollection" name="sourceCollection" required />
        </div>
        <div>
          <Label htmlFor="targetCollection">Target Collection</Label>
          <Input type="text" id="targetCollection" name="targetCollection" required />
        </div>
        <Button type="submit">Transfer Collection</Button>
      </form>
      <div className="mt-4">
        <Link href="/image-upload" className="text-blue-500 hover:underline">
          Go to Image Upload
        </Link>
      </div>
    </div>
  )
}