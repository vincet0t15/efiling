---
name: laravel
description: Laravel PHP framework development including routing, controllers, Eloquent ORM, migrations, Blade templates, Inertia.js, and code optimization best practices.
---

# Laravel Development Skill

## Overview

This skill covers Laravel PHP framework development including full-stack and API development, database management with Eloquent, migrations, Blade templates, Inertia.js integration, and code optimization best practices.

## Code Optimization Best Practices

### 1. Database Queries

#### Always use eager loading to prevent N+1 queries
```php
// Bad - N+1 query problem
$documents = Document::all();
foreach ($documents as $document) {
    echo $document->user->name; // Each iteration triggers a query
}

// Good - Eager loading
$documents = Document::with(['user', 'documentType'])->get();

// Good - Lazy eager loading for conditional relationships
$documents = Document::get()->loadMissing(['files', 'updates']);
```

#### Use select() to limit columns
```php
// Bad - Fetches all columns
$users = User::where('active', true)->get();

// Good - Select only needed columns
$users = User::where('active', true)->select('id', 'name', 'email')->get();
```

#### Use chunk() for large datasets
```php
// Bad - Loads all records into memory
User::chunk(1000, function ($users) {
    foreach ($users as $user) {
        // process user
    }
});

// Good - Process in chunks to save memory
User::where('active', true)->chunk(100, function ($users) {
    foreach ($users as $user) {
        // process user
    }
});

// Alternative - cursor() for even better memory efficiency
foreach (User::where('active', true)->cursor() as $user) {
    // process user
}
```

#### Use exists() instead of count() for existence checks
```php
// Bad
if (User::where('email', $email)->count() > 0) {
    // exists
}

// Good
if (User::where('email', $email)->exists()) {
    // exists
}
```

#### Use whereHas for relationship filtering
```php
// Bad
$users = User::all()->filter(function ($user) {
    return $user->posts()->count() > 0;
});

// Good
$users = User::whereHas('posts', function ($query) {
    $query->where('published', true);
})->get();
```

### 2. Caching

#### Use cache for expensive operations
```php
// Good - Cache expensive queries
$stats = Cache::remember('dashboard_stats', 3600, function () {
    return [
        'total_documents' => Document::count(),
        'pending' => Document::where('status', 'pending')->count(),
        'approved' => Document::where('status', 'approved')->count(),
    ];
});
```

#### Use cache tags for organized caching
```php
// Good
Cache::tags(['documents', 'user_' . $userId])->put('key', $value, 3600);
```

### 3. Controller Best Practices

#### Use Form Requests for validation
```php
// Good - Separate validation logic
class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'document_type_id' => 'required|exists:document_types,id',
            'files' => 'required|array|min:1',
        ];
    }
}

// Controller
public function store(StoreDocumentRequest $request) {
    // Validation is automatically handled
}
```

#### Use resource classes for API responses
```php
// Good - Transform API responses consistently
class DocumentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'tracking_number' => $this->tracking_number,
            'document_type' => new DocumentTypeResource($this->whenLoaded('documentType')),
        ];
    }
}

// Usage
return DocumentResource::collection(Document::with(['documentType'])->get());
```

### 4. Model Best Practices

#### Use accessors and mutators for data transformation
```php
class Document extends Model
{
    // Accessor - format data when reading
    public function getFormattedSizeAttribute(): string
    {
        if (!$this->file_size) return '-';
        return number_format($this->file_size / 1024, 1) . ' KB';
    }

    // Mutator - format data when writing
    public function setTitleAttribute($value): void
    {
        $this->attributes['title'] = ucwords($value);
    }

    // Scope - reusable query scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}

// Usage
$pendingDocs = Document::pending()->get();
$recentDocs = Document::recent(30)->get();
```

#### Use relationships efficiently
```php
class Document extends Model
{
    // Define relationships with constraints for better performance
    public function latestUpdates()
    {
        return $this->hasMany(DocumentUpdate::class)->latest()->limit(10);
    }

    // Use 'with' to eager load by default
    protected $with = ['documentType', 'user'];

    // Use lazy loading disabled for security (optional)
    // protected $lazyLoading = true;
}
```

### 5. Route Optimization

#### Use route caching in production
```bash
php artisan route:cache
php artisan route:clear
```

#### Use named routes for cleaner code
```php
// Routes
Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');

// Usage
route('documents.index');
<a href="{{ route('documents.index') }}">Documents</a>
router.get(documents.index())
```

### 6. Blade Template Optimization

#### Use component caching
```php
// Good - Cache expensive components
@php
    config(['cache.default' => 'array']);
@endphp

// Use lazy loading for heavy components
<heavy-component :data="$data" />
```

#### Use @json instead of json_encode
```php
// Good
<script>
    var documents = @json($documents);
    var csrfToken = @Csrf();
</script>
```

### 7. Middleware Optimization

#### Use middleware groups for organization
```php
// routes/web.php
Route::middleware(['web'])->group(function () {
    // Routes
});

// API routes
Route::middleware(['api', 'auth:sanctum'])->group(function () {
    // API Routes
});
```

### 8. Service Container Best Practices

#### Use dependency injection
```php
// Good - Type-hint dependencies in constructor
class DocumentService
{
    public function __construct(
        protected DocumentRepository $documents,
        protected FileStorageService $storage,
    ) {}

    public function create(array $data): Document
    {
        // Use injected dependencies
    }
}

// Controller
class DocumentController extends Controller
{
    public function __construct(
        protected DocumentService $documentService,
    ) {}

    public function store(StoreDocumentRequest $request)
    {
        $document = $this->documentService->create($request->validated());
    }
}
```

### 9. Queue Jobs for Heavy Processing

#### Move heavy tasks to queue
```php
// Good - Process in background
ProcessDocumentJob::dispatch($document);

// With specific queue
ProcessDocumentJob::dispatch($document)->onQueue('processing');

// With delay
ProcessDocumentJob::dispatch($document)->delay(now()->addMinutes(5));
```

### 10. Index Database Columns

#### Use migrations to add indexes
```php
// Good - Add indexes for frequently queried columns
Schema::table('documents', function (Blueprint $table) {
    $table->index('status');
    $table->index(['created_at', 'status']);
    $table->foreignId('document_type_id')->constrained();
});
```

## Inertia.js Best Practices

### Use eager loading in controllers
```php
public function index(Request $request): InertiaResponse
{
    $documents = Document::with(['documentType', 'user', 'files'])
        ->when($request->search, function ($query) use ($request) {
            $query->where('title', 'like', "%{$request->search}%");
        })
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('documents/index', [
        'data' => $document,
    ]);
}
```

### Use partial reloads for better UX
```php
// Good - Only reload necessary data
router.reload({ only: ['documents'] });

// For pagination
router.get(route('documents.index'), {
    page: 2
}, { replace: true });
```

### Use correct import syntax for Inertia
```php
// Good - Use default import for routes wrapper
import documents from '@/routes/documents';

// Good - Use Inertia components
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
```

## Common Artisan Commands

```bash
# Make controller with resources
php artisan make:controller DocumentController --resource --model=Document

# Make request
php artisan make:request StoreDocumentRequest

# Make migration
php artisan make:migration add_status_to_documents_table

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration
php artisan migrate:fresh

# Create model with migration and factory
php artisan make:model Document -mf

# Clear cache
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Route list
php artisan route:list

# Tinker - interactive console
php artisan tinker
```

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/ (Form Requests)
│   └── Middleware/
├── Models/
├── Providers/
├── Services/
database/
├── migrations/
├── seeders/
└── factories/
routes/
├── web.php
└── api.php
resources/
├── js/
│   ├── pages/
│   ├── components/
│   └── routes/
└── views/
    └── blade/
```

## Key Packages Used in This Project

- `inertiajs/inertia-laravel` - Server-side Inertia adapter
- `inertiajs/react` - React adapter for Inertia
- `laravel/fortify` - Authentication scaffolding
- `laravel/vite-plugin` - Vite integration
- `@laravel/vite-plugin-wayfinder` - Route generation