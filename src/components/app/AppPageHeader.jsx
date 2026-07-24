export default function AppPageHeader({ eyebrow, title, accent, children }) {
    return (
        <div className="border-b border-line bg-surface">
            <div className="container-app py-10 sm:py-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    {eyebrow && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-electric-600">
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="mt-3 mega text-[clamp(2rem,5vw,3.25rem)] text-body">
                        {title}
                        {accent && <span className="text-electric-500"> {accent}</span>}
                    </h1>
                </div>
                {children && <div className="flex flex-wrap gap-2 shrink-0">{children}</div>}
            </div>
        </div>
    );
}