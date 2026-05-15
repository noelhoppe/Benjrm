import { useQuery } from "@tanstack/react-query";
import MarkdownPageComponent from "@/components/markdown/MarkdownPageComponent";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

const fetchImprintContent = async (): Promise<string> => {
  const response = await fetch("/imprint.md");
  const contentType = response.headers.get("content-type");

  // Check if response is not a html page
  if (!response.ok || (contentType && contentType.includes("text/html"))) {
    // TODO: Redirect to 404 Page
    throw Error("Imprint content not found");
  }
  return response.text();
};

export default function ImprintPage() {
  const {
    data: imprintContent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["imprint"],
    queryFn: fetchImprintContent,
  });

  return (
    <div className="min-h-full bg-background text-foreground overflow-x-hidden">
      <Navbar />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">
              Loading Imprint...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-destructive p-8 text-center bg-muted/20 rounded-lg border border-dashed">
            <p className="font-semibold text-lg mb-2">Error loading imprint</p>
            <p className="text-sm opacity-70">
              {(error as Error).message}
            </p>
          </div>
        ) : (
          <MarkdownPageComponent
            content={imprintContent || ""}
          />
        )}
    </div>
  );
}
