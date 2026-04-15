"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AuthPage } from '../components/auth/AuthPage';

import { Storage } from '../utils/storage';

//==============================================
import { Group, Stack, Text, Paper } from '@mantine/core';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = Storage.getToken();
    if (token) {
      router.replace("/home"); // Redirect to home page if token exists
    }
  }, [])
  
  ;

  return (
    <>
      <AuthPage />
      {/*Paper 就像是一个有background color的card底色*/}
      <Paper p="md" bg="#0b1622" style={{ width: '500px' }}>
        {/*最外层的大盒子，负责让 STOCK 和右边那堆数字分开 */}
        <Group justify='space-between' align='flex-end'>

          {/*左边：只放 STOCK */}
          <Group gap={4}>
            <Text fw={700} c="dimmed">STOCK</Text>
            <Text size="xs" c="dimmed">↕</Text>
          </Group>

          <Group gap="xl">
            {/*右边：再用一个 Group 把 Price 和 C(%) 并排包起来 */}
            <Stack gap={0} align='flex-end' w={80}>
              <Group gap={4}>
                <Text size='xs' fw={700} c="dimmed">Price</Text>
                <Text size="xs" c="dimmed">↕</Text>
              </Group>

              <Group gap={4}>
                <Text size="10px" c="dimmed">NTA</Text>
                <Text size="10px" c="dimmed">↕</Text>
              </Group>
            </Stack>

            <Stack gap={0} align='flex-end' w={80}>
              <Group gap={4}>
                <Text size='xs' fw={700} c="dimmed">C(%)</Text>
                <Text size="xs" c="dimmed">↕</Text>
              </Group>

              <Group gap={4}>
                <Text size="10px" c="dimmed">CHG</Text>
                <Text size="10px" c="dimmed">↕</Text>
              </Group>
            </Stack>

          </Group>
        </Group>

        <Group justify='space-between' align='center' mt="md">
          <Text fw={700} c="white" size="lg">5ER</Text>

          <Group gap="xl">
            <Stack gap={0} align='flex-end' w={80}>
              <Text c="white" fw={600} size="sm">0.275</Text>
              <Text c="dimmed" size="xs">0.090</Text>
            </Stack>

            <Stack gap={0} align='flex-end' w={80}>
              <Text c="green" fw={600} size="sm">+5.80%</Text>
              <Text c="green" size="xs">+0.015</Text>
            </Stack>
          </Group>

        </Group>
      </Paper>
    </>
  );
}


