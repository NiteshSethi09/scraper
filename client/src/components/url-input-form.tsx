import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { scrapeRequestSchema, ScrapeRequest } from "@shared/schema";
import { Link, Clipboard } from "lucide-react";

interface URLInputFormProps {
  onSubmit: (data: ScrapeRequest) => void;
  isLoading: boolean;
}

export function URLInputForm({ onSubmit, isLoading }: URLInputFormProps) {
  const form = useForm<ScrapeRequest>({
    resolver: zodResolver(scrapeRequestSchema),
    defaultValues: {
      url: "",
      generateArticle: true,
      generateBreadcrumb: true,
      generateFaq: true,
    },
  });

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        form.setValue("url", text);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Enter URL to Scrape</CardTitle>
        <CardDescription className="text-sm text-slate-600">
          Paste any web page URL to automatically generate Article, Breadcrumb, and FAQ schemas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Website URL</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="https://example.com/article-page"
                        className="pl-10 pr-12"
                        {...field}
                      />
                    </FormControl>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-4 w-4 text-slate-400" />
                    </div>
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="h-4 w-4" />
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="generateArticle"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-slate-700">
                        Generate Article Schema
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generateBreadcrumb"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-slate-700">
                        Generate Breadcrumb Schema
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generateFaq"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-slate-700">
                        Generate FAQ Schema
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12l-6-6 1.41-1.41L10 9.17l4.59-4.58L16 6l-6 6z"/>
                </svg>
                Scrape & Generate
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
