"use client";

import { useParams } from "next/navigation";
import GuideForm from "../../../../components/admin/GuideForm";

export default function EditGuidePage() {
  const params = useParams<{ slug: string }>();
  return <GuideForm slug={params.slug} />;
}
