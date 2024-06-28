import { Box, Grid, Text } from '@mantine/core';
import { formatTicks } from '../../../../shared/utility/functions/functions';
import { useAppSelector } from '../../../../store/store';
import { useGetReminderByIdQuery } from '../../utility/services/user.service';

interface IProps {
  reminderId: number;
}
export const ReminderDetails = ({ reminderId }: IProps) => {
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const { data: reminderDetails } = useGetReminderByIdQuery(
    {
      userId: userId,
      reminderId: reminderId,
    },
    { skip: !userId }
  );

  return (
    <Box>
      {/* start: grid first section */}
      <Grid
        style={{
          borderBottom: '1px solid rgba(134, 148, 170, 0.43)',
          marginTop: '10px',
          paddingBottom: '20px',
        }}
      >
        <Grid.Col span={6}>
          <Text c="#8694AA" size="14px" fw={500} mb={'10px'} lh={'17px'}>
            VALUE
          </Text>
          <Text
            fw={500}
            size="20px"
            c={'var(--mantine-color-secondary)'}
            lh={'25px'}
          >
            {formatTicks(reminderDetails?.data.value)}
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text c="#8694AA" size="14px" fw={500} mb={'10px'} lh={'17px'}>
            TITLE
          </Text>
          <Text
            fw={500}
            size="20px"
            c={'var(--mantine-color-secondary)'}
            lh={'25px'}
          >
            {reminderDetails?.data.title}
          </Text>
        </Grid.Col>
      </Grid>
      {/* end: grid first section */}

      {/* start: grid second section */}
      <Grid
        style={{
          borderBottom: '1px solid rgba(134, 148, 170, 0.43)',
          padding: '20px 0px',
        }}
      >
        <Grid.Col span={6}>
          <Text c="#8694AA" size="14px" fw={500} mb={'10px'} lh={'17px'}>
            TIME
          </Text>
          <Text
            fw={500}
            style={{ wordBreak: 'break-word' }}
            size="20px"
            c={'var(--mantine-color-secondary)'}
            lh={'25px'}
          >
            {reminderDetails?.data.reminderTime}
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text c="#8694AA" size="14px" fw={500} mb={'10px'} lh={'17px'}>
            ALERT
          </Text>
          <Text
            fw={500}
            size="20px"
            c={'var(--mantine-color-secondary)'}
            lh={'25px'}
          >
            {reminderDetails?.data.reminderAlert}
          </Text>
        </Grid.Col>
      </Grid>
      {/* end: grid second section */}
      {/* start: grid third section */}
      <Grid style={{ paddingTop: '20px' }}>
        <Grid.Col>
          <Text c="#8694AA" size="14px" fw={500} mb={'10px'} lh={'17px'}>
            NOTES
          </Text>
          <Text
            fw={500}
            size="20px"
            c={'var(--mantine-color-secondary)'}
            lh={'25px'}
          >
            {reminderDetails?.data.notes ? reminderDetails?.data.notes : '-'}
          </Text>
        </Grid.Col>
      </Grid>
      {/* end: grid third section */}
    </Box>
  );
};
