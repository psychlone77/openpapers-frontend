import { PaperSearchBox } from "@/components/PaperSearchBox";
import { Breadcrumb, BreadcrumbItem } from "@/components/carbon";

export default function PapersPage() {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem 1.5rem",
      }}
    >
      <Breadcrumb noTrailingSlash style={{ marginBottom: "2rem" }}>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Papers</BreadcrumbItem>
      </Breadcrumb>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--cds-text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Examination Papers
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--cds-text-secondary)",
          }}
        >
          Select your subject, examination year, and paper format below.
        </p>
      </div>

      <PaperSearchBox />
    </div>
  );
}
