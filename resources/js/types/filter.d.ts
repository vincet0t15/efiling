import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface FilterProps {
    search: string;
}

interface MyPageProps extends InertiaPageProps {
    filters: FilterProps;
}
