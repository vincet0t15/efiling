<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Fortify;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Override Fortify's RegisterResponse to prevent auto-login after registration
        $this->app->singleton(RegisterResponseContract::class, \App\Http\Responses\RegisterResponse::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthentication();
    }

    /**
     * Configure authentication behavior.
     */
    protected function configureAuthentication(): void
    {
        Fortify::authenticateThrough(function ($request) {
            return array_filter([
                config('fortify.limiters.login') ? null : \Laravel\Fortify\Actions\EnsureLoginIsNotThrottled::class,
                config('fortify.lowercase_usernames') ? \Laravel\Fortify\Actions\CanonicalizeUsername::class : null,
                \Laravel\Fortify\Features::enabled(\Laravel\Fortify\Features::twoFactorAuthentication()) ? \Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable::class : null,
                \App\Actions\Fortify\EnsureUserIsActive::class,
                \Laravel\Fortify\Actions\AttemptToAuthenticate::class,
                \Laravel\Fortify\Actions\PrepareAuthenticatedSession::class,
            ]);
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}