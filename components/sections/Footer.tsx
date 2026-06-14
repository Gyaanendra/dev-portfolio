export default function Footer() {
  return (
    <footer className="w-full border-t border-border-custom mt-20 pt-8 pb-12 text-center text-[10px] text-muted font-mono bg-card/10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>
          © {new Date().getFullYear()} Gyanendra Prakash. Built with Next.js,
          Tailwind v4 & Editorial Minimalism.
        </span>
        <span className="text-muted/50 hover:text-accent cursor-default">
          {"<developer />"}
        </span>
      </div>
    </footer>
  );
}
