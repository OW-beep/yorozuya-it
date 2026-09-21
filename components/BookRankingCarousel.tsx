import { getBookRanking } from "@/lib/bookRanking";
import BookRankingCarouselClient from "@/components/BookRankingCarouselClient";

// サーバー側でデータ取得を行い、表示はクライアントコンポーネントに委譲する。
// こうすることで、楽天APIへのリクエストはサーバー側だけで完結し、
// アプリID・アフィリエイトID・アクセスキーがブラウザ側に露出しない。
export default async function BookRankingCarousel() {
  const books = await getBookRanking();

  if (books.length === 0) return null;

  return (
    <section className="bg-washi-warm border-t border-b border-ink/10 py-8">
      <BookRankingCarouselClient books={books} />
    </section>
  );
}
