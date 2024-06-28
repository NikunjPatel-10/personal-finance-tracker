import { Box, Grid, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useGetUserDeatilsQuery, useLazyGetUserDeatilsQuery } from '../utility/services/admin.service';
import { format } from 'date-fns';
import { IUserDetail } from '../utility/models/userDetail.model';

interface IProps {
  userId: number;
}

const UserDetails = ({ userId }: IProps) => {
  const [userDetails, setUserDetails] = useState<IUserDetail>();

  // api call for get user-details
  const { data: res } = useGetUserDeatilsQuery({
    userId: userId,
  });
  const [userDetail] = useLazyGetUserDeatilsQuery()

  useEffect(() => {
    if (res) {
      setUserDetails(res.data);
    }
  }, [res]);

  // get user details without page refresh
  useEffect(()=>{
    userDetail({
      userId:userId
    })
  },[])

  /**
   *
   * @param text The text to be rendered.
   * @returns A Text component displaying either the provided text or a hyphen.
   */
  const renderText = (userData: any) => (userData ? userData : '-');

  // to formatDate
  const formatedBirthDate =
    userDetails && userDetails.dateOfBirth
      ? format(userDetails.dateOfBirth, 'dd-MM-yyyy')
      : '-';

  return (
    <>
      {userDetails && (
        <Box>
          {/* First Grid section */}
          <Grid
            style={{ borderBottom: '2px solid #eeeff0', paddingBottom: '15px' }}
          >
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">Name</Text>
              <Text fw={500}>{renderText(userDetails.userName)}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">Phone Number</Text>
              <Text fw={500}>
                {userDetails.phoneNumber
                  ? `+91 ${userDetails.phoneNumber}`
                  : '-'}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">Date of Birth</Text>
              <Text fw={500}>{formatedBirthDate}</Text>
            </Grid.Col>
          </Grid>

          {/* Second Grid section  */}
          <Grid
            style={{ borderBottom: '2px solid #eeeff0', padding: '15px 0px' }}
          >
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">Gender</Text>
              <Text fw={500}>{renderText(userDetails.gender)}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">Address</Text>
              <Text fw={500} style={{ wordBreak: 'break-word' }}>
                {renderText(userDetails.address)}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">State</Text>
              <Text fw={500}>{renderText(userDetails.state)}</Text>
            </Grid.Col>
          </Grid>

          {/* Third Grid section  */}
          <Grid
            style={{ borderBottom: '2px solid #eeeff0', padding: '15px 0px' }}
          >
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">City</Text>
              <Text fw={500}>{renderText(userDetails.city)}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">Country</Text>
              <Text fw={500}>{renderText(userDetails.country)}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text c="var(--mantine-color-grey)">Zip</Text>
              <Text fw={500}>{renderText(userDetails.pincode)}</Text>
            </Grid.Col>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default UserDetails;
