import { PageWrapper } from "@/components/wrappers/page-wrapper";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center min-w-screen my-[5rem]">
        <SignIn
          fallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        />
      </div>
    </PageWrapper>
  );
}
