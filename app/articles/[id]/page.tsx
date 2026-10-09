"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArticleReader } from "@/components/reader/ArticleReader";
import { articleService } from "@/services";
import { Article } from "@/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ArticleDetailPage() {
  const params = useParams();
  const idOrSlug = (params?.id as string) || "multimodal-latent-diffusion-pathology";
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    articleService.getByIdOrSlug(idOrSlug).then((art) => {
      setArticle(art);
      setLoading(false);
    });
  }, [idOrSlug]);

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {loading ? (
          <div className="max-w-5xl mx-auto py-12 px-4">
            <LoadingSkeleton rows={6} />
          </div>
        ) : article ? (
          <ArticleReader article={article} />
        ) : (
          <div className="max-w-xl mx-auto py-20 px-4">
            <EmptyState
              title="Article Not Found"
              description="The requested research paper could not be found or has not yet been indexed."
              actionText="Browse Published Articles"
              onAction={() => window.location.assign("/articles")}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
