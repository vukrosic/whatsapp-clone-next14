import { UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      This page can only be seen my authenticated users.
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  )
}
