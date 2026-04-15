"use client";

import { Box, Image, Container } from "@mantine/core";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { BottomNavBar } from "../../components/common/BottomNavBar/BottomNavBar";
import { TopBarTab } from "../../components/common/TopBarTab";
import TopSecHome from "../../components/home/TopSecHome/TopSecHome";
import ServerSection from "../../components/home/ServerSection/ServerSection";
import NoticeSection from "../../components/home/NoticeSection/NoticeSection";
import { ActionCompleteModal } from "../../components/modal/ActionCompleteModal";

import { VpsResponse } from "../../types/server";
import { getWalletBalance, getServerList, checkLaunchServerEligibility, checkTopUpEligibility } from "../../utils/api";
import { WalletSummary } from "../../components/home/WalletSummary";
import { WelcomeModal } from "../../components/modal/WelcomeModal";
import { Storage } from "../../utils/storage";

export default function HomePage() {
  const t = useTranslations('home');
  const tAuth = useTranslations('auth');
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);
  const [topUpModalOpened, setTopUpModalOpened] = useState(false);
  const [maxServerModalOpened, setMaxServerModalOpened] = useState(false);

  // Add this useEffect after the welcomeModalOpened state declaration
  useEffect(() => {
    const welcomeStatus = Storage.getWelcomeShown();
    if (welcomeStatus === "pending") {
      setWelcomeModalOpened(true);
      Storage.setWelcomeShown("shown"); // Mark as shown
    }
  }, []);

  // Fetch wallet balance from API
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const data = await getWalletBalance();
        setBalance(data.balance);
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
      } finally {
      }
    };
    fetchWalletBalance();
  }, []);

  // Fetch server list
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const data: VpsResponse = await getServerList(1);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching servers:', error);
      } finally {
      }
    };

    fetchServers();
  });

  const handleTopUpClick = async () => {
    try {
      const data = await checkTopUpEligibility();
      if (data.eligible) {
        router.push("/topup")
      } else {
        setTopUpModalOpened(true);
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      alert(t('eligibilityCheckError'));
    }
  };

  const handleCreateVpsClick = async () => {
    try {
      const data = await checkLaunchServerEligibility();
      if (data.eligible) {
        router.push("/createvps");
      } else {
        setMaxServerModalOpened(true);
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      alert(t('eligibilityCheckError'));
    }
  };
  const [welcomeModalOpened, setWelcomeModalOpened] = useState(false);
  return (
    <Box>
      <TopBarTab logo="/brandIcons/brandwithNameHorizontal.svg" showLanguage={true} />
      <WalletSummary balance={balance ?? 0} onClick={() => router.push("/points")} />
      <Box pos="relative">
        {/* Background section */}
        <Box
          bg="var(--mantine-color-blue-0)"
          pt={80}
          pb={60}
        />

        {/* Floating Top Section */}
        <Container
          size="sm"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
          }}
        >
          <TopSecHome featureButtons={[
            {
              icon:
                <Image
                  src="/home/topup.svg"
                  alt={t('topUp')}
                  width={24}
                  height={24}
                />,
              label: t('topUp'),
              onClick: handleTopUpClick,
            },
            {
              icon: (
                <Image
                  src="/home/createVPS.svg"
                  alt={t('createVPS')}
                  width={24}
                  height={24}
                />
              ),
              label: t('createVPS'),
              onClick: handleCreateVpsClick,
            },
            {
              icon: (
                <Image
                  src="/home/transaction.svg"
                  alt={t('transaction')}
                  width={24}
                  height={24}
                />
              ),
              label: t('transaction'),
              onClick: () => router.push("/transaction?returnUrl=/home"),
            },
            {
              icon: (
                <Image
                  src="/home/activity.svg"
                  alt={t('activity')}
                  width={24}
                  height={24}
                />
              ),
              label: t('activity'),
              onClick: () => router.push("/activity"),
            },
          ]} upgradeButtonText={t('upgrade')} onUpgradeClick={() => router.push("/upgrade-tier")} />
        </Container>
        <Box>
          <NoticeSection title={t('notice')} />
        </Box>
        {/* Server Section */}
        <Box>
          <ServerSection serverCount={total} title={t('myServer')} />
        </Box>
      </Box>
      {/* <TopSecHome featureButtons={[
        {
          icon:
            <Image
              src="/home/topup.svg"
              alt={t('topUp')}
              width={24}
              height={24}
            />,
          label: t('topUp'),
          onClick: handleTopUpClick,
        },
        {
          icon: (
            <Image
              src="/home/createVPS.svg"
              alt={t('createVPS')}
              width={24}
              height={24}
            />
          ),
          label: t('createVPS'),
          onClick: handleCreateVpsClick,
        },
        {
          icon: (
            <Image
              src="/home/transaction.svg"
              alt={t('transaction')}
              width={24}
              height={24}
            />
          ),
          label: t('transaction'),
          onClick: () => router.push("/transaction"),
        },
        {
          icon: (
            <Image
              src="/home/activity.svg"
              alt={t('activity')}
              width={24}
              height={24}
            />
          ),
          label: t('activity'),
          onClick: () => router.push("/activity"),
        },
      ]} />
      <ServerSection serverCount={total} />*/}
      <BottomNavBar defaultActive="home" />

      <ActionCompleteModal
        opened={topUpModalOpened}
        onClose={() => setTopUpModalOpened(false)}
        title={t('noTopUpModal.title')}
        description={t('noTopUpModal.message')}
        imageSrc="/topup/topUpMax.svg"
        imageAlt={t('noTopUpModal.imageAlt')}
        positiveButton={t('noTopUpModal.gotItButton')}
        onPositive={() => setTopUpModalOpened(false)}
      />

      <ActionCompleteModal
        opened={maxServerModalOpened}
        onClose={() => setMaxServerModalOpened(false)}
        title={t('maximumServerReachedModal.title')}
        description={t('maximumServerReachedModal.message')}
        imageSrc="/home/maxServer.svg"
        imageAlt={t('maximumServerReachedModal.imageAlt')}
        positiveButton={t('maximumServerReachedModal.gotItButton')}
        onPositive={() => setMaxServerModalOpened(false)}
      />
      <WelcomeModal
        isOpen={welcomeModalOpened}
        onClose={() => {
          setWelcomeModalOpened(false);
        }}
        title={tAuth('welcomeTitle')}
        content={tAuth('welcomeDes')}
      />
    </Box>
  );
}
