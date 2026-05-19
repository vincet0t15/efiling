import { Head, router, usePage } from '@inertiajs/react';
import { 
    FileText, 
    Plus, 
    ArrowRight,
    FileUp,
    Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import Heading from '@/components/heading';
import documents from '@/routes/documents';
import documentTypes from '@/routes/document-types';

interface DashboardProps {
    stats?: {
        total: number;
        documentTypes?: Array<{
            document_type_id: number;
            name: string;
            count: number;
        }>;
    };
    recentDocuments?: Array<{
        id: number;
        title: string;
        tracking_number: string;
        status?: string;
        created_at: string;
        document_type?: {
            name: string;
        };
    }>;
    user?: {
        name: string;
    };
}

export default function Dashboard({ stats, recentDocuments, user }: DashboardProps) {
    const page = usePage();
    const authUser = page.props.auth?.user as { name: string } | undefined;
    const userName = user?.name || authUser?.name || 'User';

    // Default stats if not provided
    const dashboardStats = stats || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    };

    const documentTypeCards = dashboardStats.documentTypes?.length
        ? dashboardStats.documentTypes.map((docType, index) => ({
            title: docType.name,
            value: docType.count,
            icon: FileText,
            description: 'Documents',
            color: 'bg-blue-500',
            textColor: 'text-blue-500'
        }))
        : [];

    const quickActions = [
        {
            title: 'Upload Document',
            description: 'Submit a new document for processing',
            icon: FileUp,
            href: documents.create(),
            color: 'bg-primary'
        },
        {
            title: 'View Documents',
            description: 'Browse all your documents',
            icon: FileText,
            href: documents.index(),
            color: 'bg-secondary'
        },
        {
            title: 'Document Types',
            description: 'Manage document categories',
            icon: Settings,
            href: documentTypes.index(),
            color: 'bg-muted'
        }
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Heading
                            title={`Welcome back, ${userName.split(' ')[0]}!`}
                            description="Here's what's happening with your documents today."
                        />
                    </div>
                    <Button onClick={() => router.get(documents.create())}>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Document
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                                    <p className="text-3xl font-bold">{dashboardStats.total}</p>
                                    <p className="text-xs text-muted-foreground">All submitted documents</p>
                                </div>
                                <div className="rounded-lg bg-blue-500/10 p-3">
                                    <FileText className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {documentTypeCards.map((stat, index) => (
                        <Card key={index} className="relative overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                    </div>
                                    <div className={`rounded-lg p-3 ${stat.color}/10`}>
                                        <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickActions.map((action, index) => (
                        <Card 
                            key={index} 
                            className="cursor-pointer transition-shadow hover:shadow-lg"
                            onClick={() => router.get(action.href)}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <action.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{action.title}</p>
                                    <p className="text-sm text-muted-foreground">{action.description}</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Documents */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Recent Documents</CardTitle>
                            <CardDescription>Your latest document submissions</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.get(documents.index())}>
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentDocuments && recentDocuments.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tracking #</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentDocuments.slice(0, 5).map((doc) => (
                                        <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                {doc.tracking_number}
                                            </TableCell>
                                            <TableCell>{doc.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {doc.document_type?.name || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(doc.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.get(documents.show({ document: doc.id }));
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-4 text-muted-foreground">No documents yet</p>
                                <Button 
                                    className="mt-4" 
                                    variant="outline"
                                    onClick={() => router.get(documents.create())}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Upload your first document
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: documents.index(),
        },
    ],
};