import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCoverLetters } from "@/actions/ai-cover-letter";
import CoverLetterList from "./_components/cover-letter-list";
import CoverLetterGenerator from "./_components/cover-letter-generator";

export default async function CoverLettersPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">Cover Letters</h1>
          <p className="text-muted-foreground">Generate and manage your AI cover letters</p>
        </div>
        <div>
          <Link href="/ai-cover-letter/new">
            <Button>New Cover Letter</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CoverLetterGenerator />
        </div>
        <div className="lg:col-span-2">
          <CoverLetterList coverLetters={coverLetters} />
        </div>
      </div>
    </div>
  );
}