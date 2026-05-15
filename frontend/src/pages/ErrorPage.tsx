// frontend/src/pages/ErrorPage.tsx

type ErrorPageProps = {
    title: string
    message: string
}

export default function ErrorPage({ title, message }: ErrorPageProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
            <div className="text-center space-y-4 max-w-md">
                <h1 className="text-5xl font-bold text-[#00F2FF]">{title}</h1>
                <p className="text-lg text-muted-foreground">{message}</p>
            </div>
        </div>
    )
}
