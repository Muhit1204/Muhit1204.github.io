export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Md Muntasir Hossain. All rights reserved.
        </p>
        <div className="font-mono text-xs text-muted flex gap-4">
          <span>Beaumont, TX</span>
        </div>
      </div>
    </footer>
  );
}
