export interface FlashProps extends Record<string, any> {
    flash?: {
        message?: string;
        type?: 'success' | 'error' | 'warning' | 'info';
        tracking_number?: string;
    };
}
