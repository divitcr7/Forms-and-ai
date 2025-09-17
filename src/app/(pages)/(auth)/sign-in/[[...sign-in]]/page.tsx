import { PageWrapper } from "@/components/wrappers/page-wrapper";
import { SignIn } from "@clerk/nextjs";
import { TestCredentialsNotice } from "@/components/auth/test-credentials-notice";

export default function SignInPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center min-w-screen my-[5rem]">
        <div className="w-full max-w-md">
          <TestCredentialsNotice />
        </div>
        <SignIn
          fallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        />
      </div>
    </PageWrapper>
  );
}
