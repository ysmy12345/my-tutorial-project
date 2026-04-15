"use client";
import { Group, Stack, Text, Table, ScrollArea } from '@mantine/core';
import { useState } from 'react';

const stocks = [
    { name: '5ER', price: '0.275', nta: '0.090', percent: '+5.80%', chg: '+0.015' },
    { name: 'AAX', price: '1.230', nta: '1.161', percent: '+3.40%', chg: '+0.040' },
    { name: 'SUNMED', price: '1.870', nta: '0.220', percent: '+0.50%', chg: '+0.010' },
    { name: 'ZETRIX', price: '0.785', nta: '48.020', percent: '+1.90%', chg: '+0.015' },
    { name: 'IOIPG', price: '3.880', nta: '4.530', percent: '+2.90%', chg: '+0.110' },
    { name: 'IJM', price: '2.300', nta: '2.890', percent: '+1.30%', chg: '+0.030' },
];

export const LandingPage = () =>{
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [reversed, setReversed] = useState(false);

    const sortedData = [...stocks].sort((a, b) => {
        if (!sortBy) return 0;

        const valA = a[sortBy as keyof typeof a];
        const valB = b[sortBy as keyof typeof b];

        if (reversed) {
            return String(valB).localeCompare(String(valA), undefined, { numeric: true });
        }
        return String(valA).localeCompare(String(valB), undefined, { numeric: true });
    });

    const handleSort = (field: string) => {
        setReversed(sortBy === field ? !reversed : false);
        setSortBy(field);
    };

    return(
    <>
    {/* ScrollArea 保证在手机screen上，如果form 太宽，可以左右scroll，不会content 爆 */}
    <ScrollArea>
      <Table verticalSpacing="sm" highlightOnHover bg="#0b1622">
        <Table.Thead>
          <Table.Tr>

            <Table.Th style={{cursor: 'pointer' }} onClick={() => handleSort('name')}>
                <Group gap={4}>
                    <Text fw={700} c={sortBy === 'name' ? 'white' : 'dimmed'} size="xs">
                        STOCK {sortBy === 'name' ? (reversed ? '↓' : '↑') : '↕'}
                    </Text>
                </Group>
            </Table.Th>     

            <Table.Th style={{ textAlign: 'right' }}>
              <Text fw={700} size="xs" style={{ cursor: 'pointer' }} c={sortBy === 'price' ? 'white' : 'dimmed'} onClick={() => handleSort('price')}>
                PRICE {sortBy === 'price' ? (reversed ? '↓' : '↑') : '↕'}
              </Text>

              <Text size="10px" style={{ cursor: 'pointer' }} c={sortBy === 'nta' ? 'white' : 'dimmed'} onClick={() => handleSort('nta')}>
                NTA {sortBy === 'nta' ? (reversed ? '↓' : '↑') : '↕'}
              </Text>
            </Table.Th>

            <Table.Th style={{ textAlign: 'right' }}>
              <Text fw={700} size="xs" style={{ cursor: 'pointer' }} c={sortBy === 'percent' ? 'white' : 'dimmed'} onClick={() => handleSort('percent')}>
                C(%) {sortBy === 'percent' ? (reversed ? '↓' : '↑') : '↕'}
              </Text>

              <Text size="10px" style={{ cursor: 'pointer' }} c={sortBy === 'chg' ? 'white' : 'dimmed'} onClick={() => handleSort('chg')}>
                CHG {sortBy === 'chg' ? (reversed ? '↓' : '↑') : '↕'}
              </Text>
            </Table.Th>

          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {sortedData.map((item, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Text fw={700} c="white">{item.name}</Text>
              </Table.Td>

              <Table.Td style={{textAlign: 'right'}}>
                <Stack gap={0} align="flex-end">
                  <Text fw={600} size='sm' c="white">{item.price}</Text>
                  <Text c="dimmed" size="xs">{item.nta}</Text>
                </Stack>
              </Table.Td>

              <Table.Td style={{textAlign: 'right'}}>
                <Stack gap={0} align="flex-end">
                  <Text c="green" fw={600} size="sm">{item.percent}</Text>
                  <Text c="green" size="xs">{item.chg}</Text>
                </Stack>
              </Table.Td>

            </Table.Tr>
          ))}
        </Table.Tbody>

      </Table>

    </ScrollArea>
    </>
  );
};