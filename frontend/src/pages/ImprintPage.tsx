import MarkdownPageComponent from "@/components/markdown/MarkdownPageComponent";
import Navbar from "@/components/Navbar";

const imprintContent = `
# Imprint Dummy

**Benjrm**  
Street Address 123  
12345 City  
Country

## Contact

- **Email:** [info@benjrm.de](mailto:info@benjrm.de)

`;

export default function ImprintPage() {
  return (
    <div className="min-h-full bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <MarkdownPageComponent content={imprintContent} />
    </div>
  );
}
