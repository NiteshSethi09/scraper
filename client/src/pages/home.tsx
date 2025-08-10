import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { URLInputForm } from "@/components/url-input-form";
import { LoadingState } from "@/components/loading-state";
import { ExtractedDataPreview } from "@/components/extracted-data-preview";
import { SchemaResults } from "@/components/schema-results";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { scrapeUrl } from "@/lib/api";
import { ScrapeRequest, SchemaResponse } from "@shared/schema";
import { Code, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { toast } = useToast();
  const [result, setResult] = useState<SchemaResponse | null>(null);

  const scrapeMutation = useMutation({
    mutationFn: scrapeUrl,
    onSuccess: (data) => {
      if (data.success && data.data) {
        setResult(data);
        toast({
          title: "Success",
          description: "URL scraped successfully and schemas generated!",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to scrape URL",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleScrapeSubmit = (data: ScrapeRequest) => {
    setResult(null);
    scrapeMutation.mutate(data);
  };

  const handleProcessNew = () => {
    setResult(null);
    scrapeMutation.reset();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Schema Generator</h1>
                <p className="text-xs text-slate-600">Article & Breadcrumb Schema Automation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <URLInputForm onSubmit={handleScrapeSubmit} isLoading={scrapeMutation.isPending} />

        {scrapeMutation.isPending && <LoadingState />}

        {scrapeMutation.isError && (
          <Card className="mb-8 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="font-medium">Scraping Failed</h3>
              </div>
              <p className="mt-2 text-sm text-red-700">
                {scrapeMutation.error instanceof Error ? scrapeMutation.error.message : "An error occurred while scraping the URL"}
              </p>
            </CardContent>
          </Card>
        )}

        {result && result.success && result.data && (
          <>
            <ExtractedDataPreview data={result.data.extractedData} />
            <SchemaResults schemas={result.data.schemas} onProcessNew={handleProcessNew} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Code className="text-white w-3 h-3" />
                </div>
                <span className="font-semibold text-slate-900">Schema Generator</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Automate the creation of structured data schemas for better SEO and search engine visibility.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">API Reference</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Schema.org Guide</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">SEO Best Practices</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Report Bug</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Feature Request</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              © 2025 Schema Generator. Built with modern web technologies.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
