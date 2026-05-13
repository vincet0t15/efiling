<?php

namespace App\Actions\Fortify;

use Closure;
use Illuminate\Http\Request;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\LoginRateLimiter;

class EnsureUserIsActive
{
    /**
     * Create a new middleware instance.
     */
    public function __construct(
        protected LoginRateLimiter $limiter
    ) {}

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = \App\Models\User::where(Fortify::username(), $request->{Fortify::username()})->first();

        if ($user && ! $user->is_active) {
            $this->limiter->clear($request);

            throw \Illuminate\Validation\ValidationException::withMessages([
                Fortify::username() => ['Your account is not active yet. Please contact an administrator to activate your account.'],
            ]);
        }

        return $next($request);
    }
}