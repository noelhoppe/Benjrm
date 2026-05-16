import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import type { JSX } from "react"
import MarkdownPageComponent from "@/components/markdown/MarkdownPageComponent"
import Navbar from "@/components/Navbar"

const fetchImprintContent = async (): Promise<string> => {
    const response = await fetch("/imprint.md")
    const contentType = response.headers.get("content-type")

    // Check if response is not a html page
    if (!response.ok || contentType?.includes("text/html")) {
        // TODO: Redirect to 404 Page
        throw Error("Imprint content not found")
    }
    return response.text()
}

export default function ImprintPage(): JSX.Element {
    const {
        data: imprintContent,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["imprint"],
        queryFn: fetchImprintContent,
    })

    if (isLoading) {
        return (
            <div className="bg-background text-foreground min-h-full overflow-x-hidden">
                <Navbar />
                <div className="flex min-h-100 flex-col items-center justify-center gap-4">
                    <Loader2 className="text-primary h-10 w-10 animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Loading Imprint...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-background text-foreground min-h-full overflow-x-hidden">
                <Navbar />
                <div className="text-destructive bg-muted/20 flex min-h-100 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="mb-2 text-lg font-semibold">Error loading imprint</p>
                    <p className="text-sm opacity-70">
                        {error instanceof Error ? error.message : "Unknown error"}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background text-foreground min-h-full overflow-x-hidden">
            <Navbar />
            <MarkdownPageComponent content={imprintContent ?? ""} />
        </div>
    )
}
