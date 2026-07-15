import { permanentRedirect } from "next/navigation";

// Legacy URL — the account page now lives at /my-account.
export default function AccountRedirect() {
  permanentRedirect("/my-account");
}
