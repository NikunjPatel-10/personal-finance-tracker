import { Text } from '@mantine/core';

function calculatePercentage(value: number, total: number) {
  return ((value / total) * 100).toFixed(2);
}

export default function CustomTooltip({ active, payload, data }: any) {
  if (active && payload && payload.length) {
    const total = data.reduce((acc: number, item: any) => acc + item.value, 0);
    const { value } = payload[0].payload;
    const percentage = calculatePercentage(value, total);

    return (
      <Text
        bg="white"
        p={5}
        fz="xs"
        fw="bold"
        style={{ borderRadius: 5, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
      >{`${percentage} %`}</Text>
    );
  }

  return null;
}
