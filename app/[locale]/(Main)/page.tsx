import Overview from "@/components/Overview/Overview";
import { getTranslations } from "next-intl/server";

export default async function MainPage() {
  const t = await getTranslations("Dashboard.home");

  return (
    <section className="space-y-6">
      <Overview />
    </section>
  );
}
