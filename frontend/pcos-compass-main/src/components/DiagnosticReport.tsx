import { useEffect, useState } from "react";
import { marked } from "marked";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  User, 
  Stethoscope, 
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface DiagnosticReportProps {
  report: string;
  patientName: string;
}

const DiagnosticReport = ({ report, patientName }: DiagnosticReportProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const parseMarkdown = async () => {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
      const parsed = await marked.parse(report);
      setHtmlContent(parsed);
    };
    parseMarkdown();
  }, [report]);

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/30 rounded-t-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <FileText className="h-6 w-6 text-primary" />
            Diagnostic Report
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Analysis Complete
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <User className="h-4 w-4" />
          <span className="font-medium">{patientName}</span>
          <span className="text-sm">• Generated on {new Date().toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
            <Stethoscope className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Diagnosis</p>
              <p className="font-semibold">PCOS Assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
            <AlertCircle className="h-8 w-8 text-accent-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className="font-semibold">Evaluated</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Action Plan</p>
              <p className="font-semibold">Included</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Detailed Analysis</h3>
        </div>

        <div 
          className="prose prose-sm max-w-none dark:prose-invert 
            prose-headings:text-foreground prose-headings:font-semibold
            prose-h1:text-2xl prose-h1:border-b prose-h1:pb-2 prose-h1:border-border
            prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-ul:text-muted-foreground prose-li:marker:text-primary
            prose-table:border prose-table:border-border prose-table:rounded-lg
            prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold
            prose-td:p-3 prose-td:border-t prose-td:border-border
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </CardContent>
    </Card>
  );
};

export default DiagnosticReport;
