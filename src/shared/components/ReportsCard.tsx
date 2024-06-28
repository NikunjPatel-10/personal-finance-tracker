import { Flex, Paper, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface IProps {
  title: string;
  count: string;
  icon: string;
}

export default function ReportCards({ title, count, icon }: IProps) {
  const largeScreen = useMediaQuery('(min-width: 1600px)');

  return (
    <Paper shadow="xs" radius="md" p={largeScreen ? 'lg' : 'md'} w={'100%'}>
      <Flex justify="space-between" align="center">
        <Flex direction="column">
          <Text fz="sm" fw={600}>
            {title}
          </Text>
          <Text fz={largeScreen ? 40 : 28} fw={600} lh={1.3} mt={14}>
            {count}
          </Text>
        </Flex>
        <Text component="span" className={icon} fz={largeScreen ? 80 : 56}>
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
          <span className="path4"></span>
          <span className="path5"></span>
        </Text>
      </Flex>
    </Paper>
  );
}
