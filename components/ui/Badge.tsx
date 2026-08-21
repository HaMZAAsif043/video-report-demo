type BadgeVariant = "success" | "warning" | "danger" | "info" | "purple" | "default";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
  purple: "bg-purple-light text-purple",
  default: "bg-gray-100 text-gray-600",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function VideoStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };
  return <Badge variant={map[status] || "default"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    pending: "warning",
    paid: "success",
    locked: "danger",
  };
  return <Badge variant={map[status] || "default"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

export function ExclusiveStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    pending: "warning",
    approved: "purple",
    rejected: "danger",
  };
  return <Badge variant={map[status] || "default"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

export function AccountStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    active: "success",
    frozen: "warning",
    suspended: "danger",
  };
  return <Badge variant={map[status] || "default"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}
