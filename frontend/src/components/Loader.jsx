export function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{text}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-40 w-full" />
      <div className="p-4 flex flex-col gap-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 rounded-lg" />)}
        </div>
        <div className="skeleton h-9 rounded-lg" />
      </div>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here', description = '', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
          <Icon size={28} />
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {description && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>}
      </div>
    </div>
  );
}
