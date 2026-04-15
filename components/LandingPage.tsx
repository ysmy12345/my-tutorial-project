"use client";
import { Group, Stack, Text, Table, ScrollArea } from '@mantine/core';

const stocks = [
    { name: '5ER', price: '0.275', nta: '0.090', percent: '+5.80%', chg: '+0.015' },
    { name: 'AAX', price: '1.230', nta: '1.161', percent: '+3.40%', chg: '+0.040' },
    { name: 'SUNMED', price: '1.870', nta: '0.220', percent: '+0.50%', chg: '+0.010' },
    { name: 'ZETRIX', price: '0.785', nta: '48.020', percent: '+1.90%', chg: '+0.015' },
    { name: 'IOIPG', price: '3.880', nta: '4.530', percent: '+2.90%', chg: '+0.110' },
    { name: 'IJM', price: '2.300', nta: '2.890', percent: '+1.30%', chg: '+0.030' },
];

export const LandingPage = () =>{

  return(
    <>
    {/* ScrollArea 保证在手机screen上，如果form 太宽，可以左右scroll，不会content 爆 */}
    <ScrollArea>
      <Table verticalSpacing="sm" highlightOnHover bg="#0b1622">
        <Table.Thead>
          <Table.Tr>

            <Table.Th>
              <Text fw={700} c="dimmed" size="xs">STOCK ↕</Text>
            </Table.Th>     

            <Table.Th style={{textAlign: 'right'}}>
              <Text fw={700} c="dimmed" size="xs">PRICE ↕</Text>
              <Text c="dimmed" size="10px">NTA ↕</Text>
            </Table.Th>

            <Table.Th style={{ textAlign: 'right' }}>
              <Text fw={700} c="dimmed" size="xs">C(%) ↕</Text>
              <Text c="dimmed" size="10px">CHG ↕</Text>
            </Table.Th>

          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {stocks.map((item, index) => (
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