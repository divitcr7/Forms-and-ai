export default {
  providers: [
    {
      // Clerk provider configuration for Convex
      // Requires a JWT template named "convex" in Clerk Dashboard
      // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
