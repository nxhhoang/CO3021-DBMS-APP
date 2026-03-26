'use client';
export default function ProductDetailPage({params}: {params: {id: string}}) {
    const { id } = params;

    return (
        <div>
            Product Detail Page - ID: {id}
        </div>
    );
}