import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <h3 className="text-lg font-medium text-slate-900">Analyzing Web Page</h3>
          <p className="text-sm text-slate-600 text-center max-w-md">
            Extracting content, metadata, and structure from the provided URL...
          </p>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
              Fetching page content
            </span>
            <span>•</span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-slate-300 rounded-full mr-1"></div>
              Parsing metadata
            </span>
            <span>•</span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-slate-300 rounded-full mr-1"></div>
              Generating schemas
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
