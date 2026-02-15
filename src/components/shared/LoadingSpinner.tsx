export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div
        className="animate-spin rounded-full border-2 border-border border-t-amber"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
