export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const PRICING_COLORS: Record<string, string> = {
  Free: "bg-green-100 text-green-800",
  Freemium: "bg-blue-100 text-blue-800",
  Paid: "bg-purple-100 text-purple-800",
  Trial: "bg-yellow-100 text-yellow-800",
  Unknown: "bg-gray-100 text-gray-600",
};

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
