import { PRICING_COLORS } from "@/lib/utils";

interface Props {
  pricing: string;
  className?: string;
}

export function PricingBadge({ pricing, className = "" }: Props) {
  const color = PRICING_COLORS[pricing] ?? PRICING_COLORS.Unknown;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {pricing}
    </span>
  );
}
