import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle, FileText, Route, Download, ExternalLink, Plus, HelpCircle } from "lucide-react";

interface SchemaResultsProps {
  schemas: {
    article?: any;
    breadcrumb?: any;
    faq?: any;
  };
  onProcessNew: () => void;
}

export function SchemaResults({ schemas, onProcessNew }: SchemaResultsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(
    schemas.article ? "article" : schemas.breadcrumb ? "breadcrumb" : "faq"
  );

  const copyToClipboard = async (text: string, schemaType: string) => {
    try {
      await navigator.clipboard.writeText(`<script type="application/ld+json">\n${text}\n</script>`);
      toast({
        title: "Success",
        description: `${schemaType} schema copied to clipboard!`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadSchema = (schema: any, filename: string) => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllSchemas = () => {
    const allSchemas = {
      ...(schemas.article && { article: schemas.article }),
      ...(schemas.breadcrumb && { breadcrumb: schemas.breadcrumb }),
      ...(schemas.faq && { faq: schemas.faq }),
    };
    downloadSchema(allSchemas, 'schemas.json');
  };

  const testWithGoogle = () => {
    window.open('https://search.google.com/test/rich-results', '_blank');
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Generated Schemas</CardTitle>
          <p className="text-sm text-slate-600">Copy and paste these schemas into your website's head section</p>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-slate-200 px-6">
              <TabsList className={`grid w-full ${
                [schemas.article, schemas.breadcrumb, schemas.faq].filter(Boolean).length === 3 ? 'grid-cols-3' :
                [schemas.article, schemas.breadcrumb, schemas.faq].filter(Boolean).length === 2 ? 'grid-cols-2' : 'grid-cols-1'
              } bg-transparent h-auto p-0`}>
                {schemas.article && (
                  <TabsTrigger 
                    value="article" 
                    className="border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none pb-4 pt-4"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Article Schema
                  </TabsTrigger>
                )}
                {schemas.breadcrumb && (
                  <TabsTrigger 
                    value="breadcrumb"
                    className="border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none pb-4 pt-4"
                  >
                    <Route className="w-4 h-4 mr-2" />
                    Breadcrumb Schema
                  </TabsTrigger>
                )}
                {schemas.faq && (
                  <TabsTrigger 
                    value="faq"
                    className="border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none pb-4 pt-4"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ Schema
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {schemas.article && (
              <TabsContent value="article" className="p-6 mt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-medium text-slate-900">Article Schema JSON-LD</h4>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Valid</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testWithGoogle()}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Validate
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(schemas.article, null, 2), "Article")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Code
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                      <code>{`<script type="application/ld+json">\n${JSON.stringify(schemas.article, null, 2)}\n</script>`}</code>
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(schemas.article, null, 2), "Article")}
                      className="absolute top-2 right-2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-slate-700">Minified Version</h5>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(JSON.stringify(schemas.article), "Article (Minified)")}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Minified
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-100 text-slate-900 p-3 rounded-lg overflow-x-auto text-xs max-h-32 border">
                        <code>{JSON.stringify(schemas.article)}</code>
                      </pre>
                      <button 
                        onClick={() => copyToClipboard(JSON.stringify(schemas.article), "Article (Minified)")}
                        className="absolute top-2 right-2 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            {schemas.breadcrumb && (
              <TabsContent value="breadcrumb" className="p-6 mt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-medium text-slate-900">Breadcrumb Schema JSON-LD</h4>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Valid</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testWithGoogle()}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Validate
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(schemas.breadcrumb, null, 2), "Breadcrumb")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Code
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                      <code>{`<script type="application/ld+json">\n${JSON.stringify(schemas.breadcrumb, null, 2)}\n</script>`}</code>
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(schemas.breadcrumb, null, 2), "Breadcrumb")}
                      className="absolute top-2 right-2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-slate-700">Minified Version</h5>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(JSON.stringify(schemas.breadcrumb), "Breadcrumb (Minified)")}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Minified
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-100 text-slate-900 p-3 rounded-lg overflow-x-auto text-xs max-h-32 border">
                        <code>{JSON.stringify(schemas.breadcrumb)}</code>
                      </pre>
                      <button 
                        onClick={() => copyToClipboard(JSON.stringify(schemas.breadcrumb), "Breadcrumb (Minified)")}
                        className="absolute top-2 right-2 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            {schemas.faq && (
              <TabsContent value="faq" className="p-6 mt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-medium text-slate-900">FAQ Schema JSON-LD</h4>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Valid</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testWithGoogle()}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Validate
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(schemas.faq, null, 2), "FAQ")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Code
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                      <code>{`<script type="application/ld+json">\n${JSON.stringify(schemas.faq, null, 2)}\n</script>`}</code>
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(schemas.faq, null, 2), "FAQ")}
                      className="absolute top-2 right-2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-slate-700">Minified Version</h5>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(JSON.stringify(schemas.faq), "FAQ (Minified)")}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Minified
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-100 text-slate-900 p-3 rounded-lg overflow-x-auto text-xs max-h-32 border">
                        <code>{JSON.stringify(schemas.faq)}</code>
                      </pre>
                      <button 
                        onClick={() => copyToClipboard(JSON.stringify(schemas.faq), "FAQ (Minified)")}
                        className="absolute top-2 right-2 text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center justify-center space-x-4">
        <Button 
          variant="outline"
          onClick={downloadAllSchemas}
        >
          <Download className="w-4 h-4 mr-2" />
          Download as JSON
        </Button>
        <Button 
          variant="outline"
          onClick={testWithGoogle}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Test with Google
        </Button>
        <Button 
          onClick={onProcessNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Process Another URL
        </Button>
      </div>
    </div>
  );
}
