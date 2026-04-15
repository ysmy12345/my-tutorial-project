import { formatPoint, formatDate, formatDateTime } from "../utils/format";
export interface PointTransactionDetails {
  title: string;
  description?: string;
  breakdown: { key: string; value: string }[];
}

export interface PointTransaction {
  id: string;
  appId: string;
  walletId: string;
  type: "REDEEM" | "TOP_UP";
  amount: number;
  metadata: string;
  voided: boolean;
  voidForTransactionId: string | null;
  purpose: string;
  createdDate: string;
  refNo: string;
}

export interface PointHistoryResponse {
  items: PointTransaction[];
  total: number;
}

export function parseTransactionMetadata(transaction: PointTransaction, tPoint: any, tPayment: any) {
  try {
    const metadata =
      typeof transaction.metadata === "string"
        ? JSON.parse(transaction.metadata)
        : transaction.metadata;

    let title = "";
    let description = "";

    switch (transaction.purpose) {
      case "DAILY_USAGE":
        title = tPayment('dailyAccruedUsage');
        description = metadata?.chargeAt
          ? (tPoint.raw('asOf') as string).replace('{{date}}', formatDate(metadata.chargeAt))
          : "";
        break;

      case "LAUNCH_SERVER":
        title = tPayment('newServerCreation');
        description = metadata?.vpsId ? `VPS ${metadata.vpsId}` : "";
        break;

      case "TOP_UP":
        title = tPayment('topUp');
        description = tPayment('topUpValue', { point: formatPoint(transaction.amount), pointUnit: tPayment('pointUnit') });
        break;

      case "UPGRADE_SERVER":
        title = tPayment('vpsUpgrade');
        description = metadata?.vpsId ? `VPS ${metadata.vpsId}` : "";
        break;

      case "WINDOWS_LICENSE":
        title = tPayment('licenseFee');
        description = metadata?.chargeAt
          ? (tPoint.raw('asOf') as string).replace('{{date}}', formatDate(metadata.chargeAt))
          : "";
        break;

      case "UPGRADE_TIER":
        title = tPayment('upgradeTier');
        description = transaction.createdDate ? (tPoint.raw('asOf') as string).replace('{{date}}', formatDate(transaction.createdDate))
          : "";
        break;

      default:
        title = "";
        description = "";
        break;
    }
    return { title, description };
  } catch (error) {
    console.error("Error parsing metadata", error);
    return { title: "", description: "" };
  }
}

export function parsePointTransactionMetadata(
  transaction: any,
  tPoint: any,
  tPayment: any
): PointTransactionDetails {
  let title = "";
  let description: string | undefined = undefined;
  let breakdown: { key: string; value: string }[] = [];
  try {
    const metadata =
      typeof transaction.metadata === "string"
        ? JSON.parse(transaction.metadata)
        : transaction.metadata;

    if (transaction.purpose === "LAUNCH_SERVER") {
      title = tPayment('newServerCreation');
      if (metadata.costBreakdown) {
        breakdown = metadata.costBreakdown.map((item: any) => ({
          key:
            item.slug === "vps"
              ? `VPS ${item.value}`
              : `+ ${item.value} ${item.slug}`,
          value:
            item.points !== null ? `${formatPoint(item.points)} ${tPayment('pointUnit')}` : "-",
        }));
      }
    } else if (transaction.purpose === "DAILY_USAGE") {
      title = tPayment('dailyAccruedUsage');
      if (metadata.chargeAt) {
        description = (tPoint.raw('asOf') as string).replace('{{date}}', formatDate(metadata.chargeAt));
      }
      if (metadata.items) {
        breakdown = metadata.items.map((item: any) => ({
          key: `+ VPS ${item.vpsId}`,
          value: `${formatPoint(item.amount)} ${tPayment('pointUnit')}`,
        }));
      }
    } else if (transaction.purpose === "UPGRADE_SERVER") {
      title = tPayment('vpsUpgrade');
      const current = metadata.currentPlan;
      const target = metadata.targetPlan;


      breakdown = [
        {
          key: `VPS ${metadata.vpsId}`,
          value: target.setupPoint !== null ? `${formatPoint(target.setupPoint)} ${tPayment('pointUnit')}` : "-",
        },
        {
          key: `• CPU: ${tPayment('coreValue', { cpuCore: current.cpuCore})} → ${tPayment('coreValue', { cpuCore: target.cpuCore})} `,
          value: ``,
        },
        {
          key: `• RAM: ${tPayment('ram', { RAM: current.memory})} → ${tPayment('ram', { RAM: target.memory})} `,
          value: ``,
        },
        {
          key: `• ${tPayment('storageHeader')}: ${tPayment('storage', { storage: current.disk1Size})} → ${tPayment('storage', { storage: target.disk1Size})} NvME SSD`,
          value: ``,
        },
      ];
    } else if (transaction.purpose === "UPGRADE_TIER") {
      title = tPayment('upgradeTier');
      if (transaction.createdDate) {
        description = (tPoint.raw('asOf') as string).replace('{{date}}', formatDate(transaction.createdDate));
      }
      breakdown = [
        {
          key: tPayment('targetTierLevel'),
          value: `Level ${metadata.targetTierLevel || '-'}`,
        },
      ];
    }  else if (transaction.purpose === "WINDOWS_LICENSE") {
      title = tPayment('licenseFee');
      if (metadata.chargeAt) {
        description = (tPoint.raw('asOf') as string).replace('{{date}}', formatDate(metadata.chargeAt));
      }
      if (metadata.items) {
        breakdown = metadata.items.map((item: any) => ({
          key: `+ VPS ${item.vpsId}`,
          value: `${formatPoint(item.amount)} ${tPayment('pointUnit')}`,
        }));
      }
    }
  } catch (error) {
    console.error("Error parsing point transaction metadata:", error);
  }
  return { title, description, breakdown };
}
