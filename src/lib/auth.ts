/**
 * Demo auth: bypass protection when NEXT_PUBLIC_DEMO_MODE is 'true'.
 * Omit or set to 'false' to enable route protection (requires login to access /member, /admin).
 */
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
