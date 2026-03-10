export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Md Muntasir Hossain. All rights reserved.
        </p>
        <div className="text-sm text-slate-500 flex gap-4">
          <span>Beaumont, TX 77705</span>
        </div>
      </div>
    </footer>
  );
}
