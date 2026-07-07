import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Headline, Lead } from "@/components/shared/Typography";
import { EmptyState } from "@/components/shared/EmptyState";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryTabs } from "@/components/CategoryTabs";
import { SkeletonCard } from "@/components/SkeletonCard";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useBookmarks, useHistory, useSummary, useKeyboardShortcuts } from "@/lib/hooks";
import { Newspaper } from "lucide-react";
import type { Article, Summary } from "@/lib/types/index";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("latest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<Summary | undefined>();
  const [summaryLoading, setSummaryLoading] = useState(false);

  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { addReadingEntry } = useHistory();
  const { getSummary, saveSummary } = useSummary();

  // Mock data - replace with actual API calls
  const mockArticles: Article[] = [
    {
      id: "1",
      title: "The Future of AI: What's Next in 2026",
      description: "Explore the latest developments in artificial intelligence and what experts predict for the coming year.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      url: "https://example.com/ai-future",
      urlToImage: "https://images.unsplash.com/photo-1677442d019cecf8f6b559f3b4e3b5f5?w=500&h=300&fit=crop",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { id: "techcrunch", name: "TechCrunch" },
      author: "John Doe",
      category: "technology",
    },
    {
      id: "2",
      title: "Global Markets Rally on Economic Optimism",
      description: "Stock markets worldwide show strong performance as economic indicators improve.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      url: "https://example.com/markets",
      urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { id: "bloomberg", name: "Bloomberg" },
      author: "Jane Smith",
      category: "business",
    },
    {
      id: "3",
      title: "Breakthrough in Cancer Research",
      description: "Scientists announce a major discovery in treating certain types of cancer.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      url: "https://example.com/cancer",
      urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { id: "nature", name: "Nature" },
      author: "Dr. Smith",
      category: "science",
    },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 500);
  }, [activeCategory]);

  const handleArticleClick = useCallback((article: Article) => {
    setSelectedArticle(article);
    addReadingEntry(article);
  }, [addReadingEntry]);

  const handleBookmark = useCallback((article: Article) => {
    if (isBookmarked(article.url)) {
      const bookmark = bookmarks.find((b) => b.article.url === article.url);
      if (bookmark) removeBookmark(bookmark.id);
    } else {
      addBookmark(article);
    }
  }, [bookmarks, isBookmarked, addBookmark, removeBookmark]);

  const handleSummarize = useCallback((article: Article) => {
    setSelectedArticle(article);
    setShowSummary(true);
    
    // Check if summary already exists
    const cached = getSummary(article.id);
    if (cached) {
      setCurrentSummary(cached);
    } else {
      // Simulate generating summary
      setSummaryLoading(true);
      setTimeout(() => {
        const mockSummary: Summary = {
          articleId: article.id,
          title: article.title,
          url: article.url,
          oneSentence: "This is a summary of the article.",
          tldr: "Key points about the article in brief.",
          bulletPoints: [
            "Point 1 about the article",
            "Point 2 about the article",
            "Point 3 about the article",
          ],
          executiveSummary: "Detailed summary of the article content.",
          keyTakeaways: ["Takeaway 1", "Takeaway 2"],
          sentiment: "neutral",
          bias: "low",
          importantNames: ["Name 1", "Name 2"],
          importantCompanies: ["Company 1"],
          timeline: ["Event 1", "Event 2"],
          keywords: ["keyword1", "keyword2", "keyword3"],
          factCheckConfidence: 85,
          actionItems: ["Action 1"],
          generatedAt: new Date().toISOString(),
        };
        setCurrentSummary(mockSummary);
        saveSummary(mockSummary);
        setSummaryLoading(false);
      }, 1500);
    }
  }, [getSummary, saveSummary]);

  useKeyboardShortcuts({
    "search-modal": () => {
      // TODO: Open search modal
    },
    "search-focus": () => {
      // TODO: Focus search bar
    },
    bookmark: () => {
      if (selectedArticle) {
        handleBookmark(selectedArticle);
      }
    },
    summarize: () => {
      if (selectedArticle) {
        handleSummarize(selectedArticle);
      }
    },
    close: () => {
      setShowSummary(false);
      setSelectedArticle(null);
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        title="News Feed"
        bookmarkCount={bookmarks.length}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showMenu={sidebarOpen}
      />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1">
          <div className="container max-w-6xl py-12 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Headline className="mb-2">Latest News</Headline>
              <Lead className="text-foreground/60 mb-8">
                Stay informed with the latest stories from around the world.
              </Lead>
            </motion.div>

            {/* Category tabs */}
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Articles grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {articles.map((article) => (
                  <motion.div
                    key={article.id}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 },
                    }}
                  >
                    <ArticleCard
                      article={article}
                      isBookmarked={isBookmarked(article.url)}
                      onBookmark={() => handleBookmark(article)}
                      onSummarize={() => handleSummarize(article)}
                      onClick={() => handleArticleClick(article)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState
                icon={Newspaper}
                title="No articles found"
                description="Try selecting a different category or search for specific topics."
              />
            )}
          </div>
        </main>
      </div>

      {/* Summary panel */}
      <SummaryPanel
        summary={currentSummary}
        isLoading={summaryLoading}
        onClose={() => {
          setShowSummary(false);
          setCurrentSummary(undefined);
        }}
        onSummarize={() => {
          if (selectedArticle) {
            handleSummarize(selectedArticle);
          }
        }}
      />
    </div>
  );
}
