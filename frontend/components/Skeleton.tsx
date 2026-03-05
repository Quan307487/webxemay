'use client';

export function SkeletonBox({ w = '100%', h = '16px', radius = '6px' }: { w?: string; h?: string; radius?: string }) {
    return <div className="skeleton" style={{ width: w, height: h, borderRadius: radius }} />;
}

export function ProductCardSkeleton() {
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <SkeletonBox h="200px" radius="0" />
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SkeletonBox h="12px" w="60%" />
                <SkeletonBox h="16px" />
                <SkeletonBox h="16px" w="80%" />
                <SkeletonBox h="12px" w="40%" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <SkeletonBox h="24px" w="120px" />
                    <SkeletonBox h="36px" w="80px" radius="8px" />
                </div>
            </div>
        </div>
    );
}

export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="products-grid">
            {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
    );
}
