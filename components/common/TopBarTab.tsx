"use client";

import {
  Box,
  Text,
  Group,
  Indicator,
  ActionIcon,
  Button,
  Menu,
  Container,
  Image,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { IconBellFilled, IconLanguage, IconChevronDown } from "@tabler/icons-react";

import { getNotificationUnreadCount } from "../../utils/api";
import { Storage } from "../../utils/storage";
import { EditLanguageModal } from "../../components/modal/EditLanguageModal";

interface TopBarTabProps {
  title?: string;
  showLanguage?: boolean;
  logo?: string;
}

export function TopBarTab({ title, showLanguage = false, logo }: TopBarTabProps) {
  const router = useRouter();
  const currentLocale = useLocale();
  const [locale, setLocale] = useState(currentLocale);
  const [unreadCount, setUnreadCount] = useState(0);
  const [languageModalOpened, setLanguageModalOpened] = useState(false);


  useEffect(() => {
    // Fetch stored locale and update state
    const storedLocale = Storage.getLocale();
    if (storedLocale) {
      setLocale(storedLocale);
    }

    const fetchUnreadCount = async () => {
      try {
        const data = await getNotificationUnreadCount();
        setUnreadCount(data.unreadNotificationCount);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  const handleNotificationClick = () => {
    router.push("/notification");
  };

  const handleChangeLanguage = (newLocale: string) => {
    Storage.setLocale(newLocale);
    setLocale(newLocale);
    window.location.reload();
  };

  return (
    <Box
      style={{
        backgroundColor: "var(--mantine-color-blue-0)"
      }}
    >
      <Container size="sm" py="md">
        <Group
          wrap="nowrap"
          align="center"
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Language Selector or Spacer 
          <Box style={{ width: "100px", display: "flex", justifyContent: "flex-start" }}>
            {showLanguage && (
              <Menu shadow="md" width={150}>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    leftSection={<IconLanguage size={20} />}
                    style={{ whiteSpace: "nowrap", padding: 0 }}
                  >
                    {locale === "en" ? "English" : "中文"}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => handleChangeLanguage("en")}>English</Menu.Item>
                  <Menu.Item onClick={() => handleChangeLanguage("zh")}>中文</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Box>*/}
          {/* Left: Language Selector */}
          <Box style={{ width: "100px", display: "flex", justifyContent: "flex-start" }}>
            {showLanguage && (
              <>
                <Button
                  variant="white"
                  radius="xl"
                  size="sm"
                  px="md"
                  rightSection={<IconChevronDown size={14} />}
                  onClick={() => setLanguageModalOpened(true)}
                  styles={{
                    root: {
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {locale.toUpperCase()}
                </Button>
                <EditLanguageModal
                  opened={languageModalOpened}
                  onClose={() => setLanguageModalOpened(false)}
                  currentLocale={locale}
                  onApply={(newLocale) => {
                    Storage.setLocale(newLocale);
                    setLocale(newLocale);
                    setLanguageModalOpened(false);
                    window.location.reload();
                  }}
                />
              </>
            )}
          </Box>
          {/* Center: Logo or Title */}
          <Box
            style={{
              flexGrow: 1,
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {logo ? (
              <Image
                src={logo}
                alt="Logo"
                style={{
                  maxHeight: "40px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Text style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{title}</Text>
            )}
          </Box>

          {/* Right: Notification */}
          <Box style={{ width: "100px", display: "flex", justifyContent: "flex-end" }}>
            <Indicator
              color="var(--mantine-color-red-5)"
              size={unreadCount > 0 ? 10 : 0}
              offset={5}
              withBorder
              processing
            >
              <ActionIcon
                variant="white"
                radius="xl"
                onClick={handleNotificationClick}
                aria-label="Notifications"
              >
                <IconBellFilled size={24} />
              </ActionIcon>
            </Indicator>
          </Box>
        </Group>
      </Container>
    </Box >
  );
}
