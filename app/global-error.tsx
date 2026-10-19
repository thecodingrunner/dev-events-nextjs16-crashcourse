'use client' // Error boundaries must be Client Components

export default function GlobalError({
                                        error,
                                        retry,
                                    }: {
    error: unknown
    retry: () => void
}) {
    return (
        // global-error must include html and body tags
        <html>
        <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => retry()}>Try again</button>
        </body>
        </html>
    )
}