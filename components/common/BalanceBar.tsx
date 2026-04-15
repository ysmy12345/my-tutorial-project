import { Paper, Text, Anchor, Group, Center, Image, Box } from "@mantine/core";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { getWalletBalance } from "../../utils/api";
import { formatBalance } from "../../utils/format";

interface BalanceBarProps {
  topup?: boolean;
  fullWidth?: boolean;
  onBalanceChecked?: (balance: number) => void;
}

export function BalanceBar({ topup, fullWidth, onBalanceChecked}: BalanceBarProps) {
  const t = useTranslations('balanceBar')
  const router = useRouter();
  const pathname = usePathname();
  const [balance, setBalance] = useState<number | null>(null);

  // Fetch wallet balance from API
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const data = await getWalletBalance();
        setBalance(data.balance);
        onBalanceChecked?.(data.balance);
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
      } finally {
      }
    };
    fetchWalletBalance();
  }, [onBalanceChecked]);

  const handleClick = () => {
    if (!pathname.includes('/points')) {
      sessionStorage.removeItem('points-selected-filter');
      router.push('/points');
    }
  };

  return (
    <Box style={{ position: "relative" }}>
      <Paper
        radius={fullWidth ? 0 : "md"}
        withBorder
        p="sm"
        mt={fullWidth ? 0 : "md"}
        bg="var(--mantine-color-dye-4)"
        style={{ width: fullWidth ? "100%" : "auto", cursor: "pointer" }}
        onClick={handleClick}
      >
        <Center>
          <Group gap="xs">
            <Image
              src="/server/wallet.svg"
              alt="coin"
              w={20}
              h={20}
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            />
            <Text c="white">
              {t("balanceLabel", { balance: formatBalance(balance ?? 0) })}
            </Text>
            {topup && (
              <Box style={{ position: "relative", display: "inline-block" }}>
                {balance !== undefined && balance! <= 0 && (
                  <Box
                    style={{
                      position: "absolute",
                      top: -30,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#ff0000ff",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      zIndex: 10,
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {t("lowBalance")}
                  </Box>
                )}
                <Anchor
                  c="white"
                  underline="not-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/topup');
                  }}
                >
                  {t("topup")}
                </Anchor>
              </Box>
            )}
          </Group>
        </Center>
      </Paper>
    </Box>
  );
}
