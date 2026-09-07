/**
 * Shown the instant a nav item is clicked, so switching sections feels
 * immediate even while the server is still fetching. Without this the
 * browser sits on the previous page with nothing happening, which reads
 * as the app being broken rather than busy.
 */
export default function AdminLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-8" aria-hidden>
      <div className="flex flex-col gap-3 border-b border-hairline pb-6">
        <div className="h-6 w-44 rounded-full bg-silver-deep" />
        <div className="h-3.5 w-full max-w-[38rem] rounded-full bg-silver" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-28 rounded-card border border-hairline bg-white"
          />
        ))}
      </div>
    </div>
  );
}
