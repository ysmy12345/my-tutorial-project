"use client";

import { Box, Flex, UnstyledButton, Text, Container } from "@mantine/core";
import {
  IconHome,
  IconMessages,
  IconServer,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./BottomNavbar.module.css";

export function BottomNavBar({ defaultActive }: { defaultActive: string }) {
  const t = useTranslations('tab')
  const [active, setActive] = useState(defaultActive);
  const router = useRouter();

  const navItems = [
    { id: "home", icon: IconHome, label: t('home'), path: "/home" },
    { id: "messages", icon: IconMessages, label: t('messages'), path: "/messages" },
    { id: "server", icon: IconServer, label: t('server'), path: "/server" },
    { id: "profile", icon: IconUser, label: t('profile'), path: "/profile" },
  ];

  return (
    <Box className={styles.navBar}>
      <Container size="sm">
        <Flex justify="space-around" align="center">
          {navItems.map((item) => (
            <UnstyledButton
              key={item.id}
              className={`${styles.navButton} ${active === item.id ? styles.activeNavButton : ""
                }`}
              onClick={() => {
                setActive(item.id);
                router.push(item.path);
              }}
            >
              <item.icon
                size={24}
                className={styles.navIcon}
                stroke={active === item.id ? 1.5 : 1}
              />
              <Text size="xs" fw={active === item.id ? "bold" : "normal"}>
                {item.label}
              </Text>
            </UnstyledButton>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}
