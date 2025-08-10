import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExtractedData } from "@shared/schema";
import { CheckCircle, ChevronRight } from "lucide-react";

interface ExtractedDataPreviewProps {
  data: ExtractedData;
}

export function ExtractedDataPreview({ data }: ExtractedDataPreviewProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Extracted Data Preview</CardTitle>
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Successfully Scraped
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Page Title</label>
              <p className="mt-1 text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">
                {data.title}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Meta Description</label>
              <p className="mt-1 text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">
                {data.description || 'No description found'}
              </p>
            </div>
            
            {data.author && (
              <div>
                <label className="text-sm font-medium text-slate-700">Author</label>
                <p className="mt-1 text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">
                  {data.author}
                </p>
              </div>
            )}
            
            {data.datePublished && (
              <div>
                <label className="text-sm font-medium text-slate-700">Publication Date</label>
                <p className="mt-1 text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">
                  {new Date(data.datePublished).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {data.image && (
              <div>
                <label className="text-sm font-medium text-slate-700">Featured Image</label>
                <div className="mt-1 bg-slate-50 p-3 rounded-lg">
                  <img 
                    src={data.image.url} 
                    alt="Featured image" 
                    className="w-full h-24 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <p className="text-xs text-slate-600 mt-2 break-all">
                    {data.image.url}
                  </p>
                </div>
              </div>
            )}
            
            {data.articleSection && (
              <div>
                <label className="text-sm font-medium text-slate-700">Article Section</label>
                <p className="mt-1 text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">
                  {data.articleSection}
                </p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-slate-700">Breadcrumb Path</label>
              <div className="mt-1 text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-xs flex-wrap">
                  {data.breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className="flex items-center">
                      <span className={index === data.breadcrumbs.length - 1 ? "text-slate-600" : "text-blue-600"}>
                        {breadcrumb.name}
                      </span>
                      {index < data.breadcrumbs.length - 1 && (
                        <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
