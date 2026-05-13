import { Head, Link, usePage } from '@inertiajs/react';
import {
    FileCheck,
    FileText,
    ShieldCheck,
    Clock,
    ArrowRight,
    CheckCircle,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    const features = [
        {
            icon: FileText,
            title: 'Easy Document Upload',
            description: 'Upload and submit your documents with just a few clicks. Support for multiple file formats.',
        },
        {
            icon: ShieldCheck,
            title: 'Secure & Confidential',
            description: 'Your documents are protected with enterprise-grade security and encryption.',
        },
        {
            icon: Clock,
            title: 'Real-time Tracking',
            description: 'Track the status of your submissions anytime with unique tracking numbers.',
        },
        {
            icon: FileCheck,
            title: 'Digital Verification',
            description: 'Receive instant confirmation and digital receipts for all your submissions.',
        },
    ];

    return (
        <>
            <Head title="Welcome - E-Filing System" />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 sticky top-0 z-50">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <FileText className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">
                                E-Filing
                            </span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Sign In
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                            <div className="flex flex-col items-start space-y-8">
                                <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                    Online Document Submission
                                </div>
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                        Submit Documents
                                        <span className="text-primary"> Anywhere,</span>
                                        <br />
                                        <span className="text-primary">Anytime</span>
                                    </h1>
                                    <p className="max-w-xl text-lg text-muted-foreground">
                                        Streamline your document submission process with our secure,
                                        fast, and reliable e-filing system. Track your documents in
                                        real-time and receive instant confirmations.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <>
                                            {canRegister && (
                                                <Link
                                                    href={register()}
                                                    className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                                >
                                                    Create Account
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            )}
                                            <Link
                                                href={login()}
                                                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                            >
                                                Sign In
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Free to use</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Secure</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>24/7 Access</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl"></div>
                                <div className="relative rounded-2xl border bg-background p-8 shadow-xl dark:bg-slate-900">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900">
                                                <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    Document Submitted
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Tracking #EF-2024-001234
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-px bg-border"></div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Status
                                                </span>
                                                <span className="font-medium text-green-600">
                                                    Received
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Submitted
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    May 13, 2026 10:30 AM
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Document Type
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    Application Form
                                                </span>
                                            </div>
                                        </div>
                                        <div className="rounded-lg bg-muted p-4">
                                            <p className="text-xs text-muted-foreground mb-2">
                                                Confirmation Code
                                            </p>
                                            <p className="font-mono text-lg font-bold tracking-wider text-foreground">
                                                ABC123XYZ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t bg-white py-16 dark:bg-slate-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Why Choose E-Filing?
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Experience a modern way to submit and manage your documents
                            </p>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center p-6 rounded-xl border bg-background hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && canRegister && (
                    <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                                Ready to Get Started?
                            </h2>
                            <p className="mt-4 text-lg text-primary-foreground/80">
                                Create your free account today and experience the convenience
                                of digital document submission.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href={register()}
                                    className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-semibold text-primary shadow transition-colors hover:bg-white/90"
                                >
                                    Create Free Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                                <Link
                                    href={login()}
                                    className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t bg-background px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                                    <FileText className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                    E-Filing System
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                &copy; 2026 E-Filing System. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}