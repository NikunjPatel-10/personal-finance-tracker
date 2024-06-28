import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Drawer,
  Flex,
  Group,
  NumberInput,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, yupResolver } from '@mantine/form';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { format } from 'date-fns';
import deepEqual from 'deep-equal';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/auth/auth';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import {
  gender,
  userProfileConstants,
  userProfileInitialValues,
} from '../utility/constants/userProfile.constant';
import { genderEnum } from '../utility/enum/user.enum';
import {
  ICity,
  ICountry,
  IDropdownData,
  IEditUserProfile,
  IState,
  IUserData,
} from '../utility/models/user.model';
import {
  useGetCitiesQuery,
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserProfileMutation,
} from '../utility/services/user.service';
import { userProfileValidationSchema } from '../utility/validations/userProfile.validation';
import ChangeProfilePhoto from './ChangeProfilePhoto';

interface IProps {
  opened: boolean;
  close: () => void;
}

function UserProfile({ opened, close }: IProps) {
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width: 1600px)');
  const [isEditing, setIsEditing] = useState(false);
  const subjectId = localStorage.getItem('subjectId');
  const [userData, setUserData] = useState<IUserData>();
  const [countries, setCountries] = useState<IDropdownData[]>([]);
  const [states, setStates] = useState<IDropdownData[]>([]);
  const [cities, setCities] = useState<IDropdownData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<
    string | number | null
  >(0);
  const [selectedState, setSelectedState] = useState<string | number | null>(0);
  const [selectedCity, setSelectedCity] = useState<string | number | null>(0);
  const [selectedGender, setSelectedGender] = useState<string | number | null>(
    0
  );
  const [initials, setInitials] = useState<string>('');
  const [editedValues, setEditedValues] = useState<IEditUserProfile>();

  const { data: userDetails } = useGetUserQuery(subjectId!, {
    skip: !subjectId,
  });
  const { data: countryData } = useGetCountriesQuery();
  const { data: stateData } = useGetStatesQuery(selectedCountry!, {
    skip: !selectedCountry,
  });
  const { data: cityData } = useGetCitiesQuery(selectedState!, {
    skip: !selectedState,
  });
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [getUserTrigger] = useLazyGetUserQuery();

  const initialUserProfileValues: IEditUserProfile = userProfileInitialValues;

  const userProfileForm = useForm({
    initialValues: { ...initialUserProfileValues },
    validate: yupResolver(userProfileValidationSchema),
    validateInputOnBlur: true,
  });

  const [
    changeProfileModalOpened,
    { open: openChangeProfileModal, close: closeChangeProfileModal },
  ] = useDisclosure(false);

  const [crossModalOpened, { open: openCrossModal, close: closeCrossModal }] =
    useDisclosure(false);

  const [
    clearAllModalOpened,
    { open: openclearAllModal, close: closeClearAllModal },
  ] = useDisclosure(false);

  const [
    submitModalOpened,
    { open: openSubmitModal, close: closeSubmitModal },
  ] = useDisclosure(false);

  useEffect(() => {
    if (userDetails) {
      setUserData(userDetails.data);
    }
  }, [userDetails]);

  useEffect(() => {
    // patch user profile values in form
    if (userData) {
      setSelectedCountry(
        userData.countryId ? userData.countryId.toString() : '1'
      );
      setSelectedState(userData.stateId ? userData.stateId.toString() : '');
      setSelectedCity(userData.cityId ? userData.cityId.toString() : '');
      userProfileForm.setFieldValue('firstName', userData.firstName);
      userProfileForm.setValues({
        lastName: userData.lastName ? userData.lastName : '',
        phoneNumber: userData.phoneNumber ? userData.phoneNumber : '',
        address: userData.address ? userData.address : '',
        pincode: userData.pincode ? userData.pincode : '',
        image: userData.image,
        dateOfBirth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth)
          : null,
      });
      const initials = userData.lastName
        ? `${userData.firstName.charAt(0).toUpperCase()}${userData.lastName
            .charAt(0)
            .toUpperCase()}`
        : userData.firstName.charAt(0).toUpperCase();
      setInitials(initials);
      const gender = genderEnum[userData.genderId];
      setSelectedGender(gender);
    }
  }, [userData]);

  useEffect(() => {
    if (countryData) {
      const selectCountry =
        countryData.data.countriesList.length > 0
          ? countryData.data.countriesList.map((res: ICountry) => ({
              value: res.countryId.toString(),
              label: res.country,
            }))
          : [];

      setCountries(selectCountry);
    }
  }, [countryData]);

  useEffect(() => {
    if (stateData) {
      const selectState =
        stateData.data.statesList.length > 0
          ? stateData.data.statesList.map((res: IState) => ({
              value: res.stateId.toString(),
              label: res.state,
            }))
          : [];
      setStates(selectState);
    }
  }, [stateData]);

  useEffect(() => {
    if (cityData) {
      const selectCity =
        cityData.data.citiesList.length > 0
          ? cityData.data.citiesList.map((res: ICity) => ({
              value: res.cityId.toString(),
              label: res.city,
            }))
          : [];
      setCities(selectCity);
    }
  }, [cityData]);

  // trigger when user click on cross modal YES button
  const handleCrossYesButton = () => {
    closeCrossModal();
    close();
    userProfileForm.setFieldError('image', '');
  };

  // triggeron change of gender value
  const handleGenderChange = (value: string | null) => {
    setSelectedGender(value);
  };

  // Helper function to map form values to IEditUserProfile format
  const mapFormValuesToUserData = (values: IEditUserProfile) => {
    return {
      lastName: values.lastName ? values.lastName : '',
      phoneNumber: values.phoneNumber ? values.phoneNumber.toString() : '',
      genderId: values.genderId ? values.genderId : null,
      dateOfBirth: values.dateOfBirth
        ? format(values.dateOfBirth, 'yyyy-MM-dd')
        : null,
      address: values.address ? values.address : '',
      image: values.image ? values.image : '',
      countryId: values.countryId ? values.countryId : 1,
      stateId: values.stateId ? values.stateId : null,
      cityId: values.cityId ? values.cityId : null,
      pincode: values.pincode ? values.pincode : '',
    };
  };
  // trigger when user click on cross button
  const handleClose = () => {
    // check whether form values are changed or not
    const userDetails = mapFormValuesToUserData(userData!);
    const formData = mapFormValuesToUserProfile(userProfileForm.values);
    const formChanged = deepEqual(userDetails, formData);
    if (!formChanged) {
      openCrossModal();
    } else {
      close();
    }
  };

  //trigger when user click on submit modal YES button
  const handleSubmitYesButton = () => {
    closeSubmitModal();
    updateUserProfile({
      userId: userData! && userData.userId,
      userData: editedValues!,
    }).then((res: any) => {
      if ('data' in res) {
        showNotification({
          title: 'Success',
          message: res.data.message,
          color: 'green',
        });
        getUserTrigger(subjectId!).then((res) => {
          if (res.data) {
            dispatch(setUser(res.data.data));
            close();
          }
        });
      } else {
        closeSubmitModal();
        showNotification({
          title: 'Error',
          message: res.data.error,
          color: 'red',
        });
      }
    });
    setIsEditing(false);
    userProfileForm.reset();
  };

  // trigger when user click on clear all modal YES button
  const handleClearAllYesButton = () => {
    const firstName = userProfileForm.values.firstName;
    const countryId = userProfileForm.values.countryId;
    userProfileForm.reset();
    userProfileForm.setFieldValue('firstName', firstName);
    userProfileForm.setFieldValue('countryId', countryId);
    userProfileForm.setFieldValue('stateId', null);
    userProfileForm.setFieldValue('genderId', null);
    setSelectedState(null);
    setSelectedGender(null);
    setSelectedCity(null);
    closeClearAllModal();
  };

  // Helper function to map form values to IEditUserProfile format
  const mapFormValuesToUserProfile = (values: IEditUserProfile) => {
    return {
      lastName: values.lastName || '',
      phoneNumber: values.phoneNumber ? values.phoneNumber.toString() : '',
      genderId: selectedGender
        ? Number(genderEnum[selectedGender as any])
        : null,
      dateOfBirth: values.dateOfBirth
        ? format(values.dateOfBirth, 'yyyy-MM-dd')
        : null,
      address: values.address || '',
      image: values.image || '',
      countryId: selectedCountry ? Number(selectedCountry) : null,
      stateId: selectedState ? Number(selectedState) : null,
      cityId: selectedCity ? Number(selectedCity) : null,
      pincode: values.pincode ? values.pincode.toString() : '',
    };
  };

  // trigger when user submit the form
  const handleSubmitButton = (values: IEditUserProfile) => {
    const filteredValues = mapFormValuesToUserProfile(values);
    setEditedValues(filteredValues);
    openSubmitModal();
  };

  // trigger on click of edit profile button
  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!userData) {
    return null;
  }

  return (
    <>
      {/* start: Drawer */}
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Edit Profile"
        position="right"
        styles={{
          title: { fontSize: '20px', fontWeight: '700' },
          header: { padding: '20px', borderBottom: '1px solid #80808030' },
          content: {
            display: 'flex',
            flexDirection: 'column',
            flex: largeScreen ? '0 0 500px' : '0 0 430px',
          },
          body: { padding: '0px', flexGrow: 1 },
        }}
        overlayProps={{
          blur: 3,
          backgroundOpacity: 0.5,
        }}
        closeButtonProps={{
          icon: (
            <Text
              component="span"
              className="icon-close"
              c="var(--mantine-color-grey)"
              onClick={openCrossModal}
            ></Text>
          ),
        }}
      >
        {/* start: form */}
        <form
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          onSubmit={userProfileForm.onSubmit(handleSubmitButton)}
        >
          <Box px={'xl'} py={largeScreen ? '24' : '8'} style={{ flexGrow: 1 }}>
            {/* start: profile details */}
            <Flex mb={largeScreen ? 'lg' : 'sm'}>
              <Group pos="relative" mr="lg">
                <Avatar
                  src={userProfileForm.values.image}
                  w={largeScreen ? 120 : 100}
                  h={largeScreen ? 120 : 100}
                  radius="50%"
                  color="cyan"
                  styles={{
                    placeholder: { fontSize: largeScreen ? 40 : 36 },
                  }}
                  style={{ objectFit: 'cover' }}
                >
                  {initials}
                </Avatar>
                <ActionIcon
                  variant="filled"
                  radius="xl"
                  pos="absolute"
                  bottom="0"
                  left={largeScreen ? 80 : 70}
                  size={largeScreen ? 'xl' : 'lg'}
                  onClick={isEditing ? openChangeProfileModal : undefined}
                  style={{ border: '3px solid #fff' }}
                >
                  <span
                    className="icon-edit-profile"
                    style={{
                      color: '#fff',
                    }}
                  ></span>
                </ActionIcon>
              </Group>
              <Group gap="xs">
                <Box>
                  <Text size="xl" fw="bold" mb="-4px" tt="capitalize">
                    {userData.firstName} {userData.lastName}
                  </Text>
                  <Text c="var(--mantine-color-grey)" fw={500}>
                    {userData.emailId}
                  </Text>
                </Box>
                <Button
                  radius="xs"
                  fw={500}
                  p="xs"
                  fz={12}
                  lts={2}
                  onClick={handleEdit}
                  style={{ visibility: isEditing ? 'hidden' : 'visible' }}
                >
                  EDIT PROFILE
                </Button>
              </Group>
            </Flex>
            {/* end: profile details */}
            {/* start: personal information */}
            <Box py={largeScreen ? 'sm' : '0'}>
              <Text
                fw={600}
                c="var(--mantine-color-grey)"
                pb={largeScreen ? '8' : '4'}
                size={largeScreen ? 'md' : 'sm'}
              >
                PERSONAL INFORMATION
              </Text>
              <Flex gap={20} mb="sm">
                <TextInput
                  label="First Name"
                  placeholder="First Name"
                  w={'100%'}
                  size={largeScreen ? 'sm' : 'xs'}
                  {...userProfileForm.getInputProps('firstName')}
                  disabled
                />
                <TextInput
                  label="Last Name"
                  placeholder="Last Name"
                  w={'100%'}
                  size={largeScreen ? 'sm' : 'xs'}
                  {...userProfileForm.getInputProps('lastName')}
                  onChange={(e) => {
                    userProfileForm.setFieldValue(
                      'lastName',
                      e.target.value.trim()
                    );
                    userProfileForm.validateField('lastName');
                  }}
                  disabled={!isEditing}
                />
              </Flex>
              <Flex gap={20} mb="sm">
                <Select
                  label="Gender"
                  withCheckIcon={false}
                  allowDeselect={false}
                  placeholder="Gender"
                  data={gender}
                  w={'100%'}
                  size={largeScreen ? 'sm' : 'xs'}
                  disabled={!isEditing}
                  {...userProfileForm.getInputProps('genderId')}
                  value={selectedGender ? selectedGender.toString() : null}
                  onChange={handleGenderChange}
                />
                <DateInput
                  size={largeScreen ? 'sm' : 'xs'}
                  valueFormat="MM/DD/YYYY"
                  maxDate={new Date()}
                  label="Date of Birth"
                  placeholder="Date of Birth"
                  w={'100%'}
                  rightSection={<span className="icon-date"></span>}
                  rightSectionPointerEvents="none"
                  disabled={!isEditing}
                  {...userProfileForm.getInputProps('dateOfBirth')}
                  styles={{
                    input: {
                      cursor: 'pointer',
                    },
                  }}
                />
              </Flex>
            </Box>
            {/* end: personal information */}
            {/* start: contact information */}
            <Box py={largeScreen ? 'sm' : '0'}>
              <Text
                fw={600}
                c="var(--mantine-color-grey)"
                pb={largeScreen ? '8' : '4'}
                size={largeScreen ? 'md' : 'sm'}
              >
                CONTACT INFORMATION
              </Text>
              <NumberInput
                label="Phone"
                placeholder="Phone"
                mb="sm"
                maxLength={10}
                size={largeScreen ? 'sm' : 'xs'}
                hideControls
                {...userProfileForm.getInputProps('phoneNumber')}
                disabled={!isEditing}
              />
              <TextInput
                label="Address"
                placeholder="Address"
                mb="sm"
                size={largeScreen ? 'sm' : 'xs'}
                {...userProfileForm.getInputProps('address')}
                disabled={!isEditing}
              />
            </Box>
            {/* end: contact information */}
            <Box py={largeScreen ? 'sm' : '0'}>
              <Flex gap={20} mb="sm">
                <Select
                  label="Country"
                  placeholder="Country"
                  searchable
                  w={'100%'}
                  size={largeScreen ? 'sm' : 'xs'}
                  data={countries}
                  defaultValue={countries ? '1' : null}
                  {...userProfileForm.getInputProps('countryId')}
                  value={selectedCountry ? selectedCountry.toString() : null}
                  onChange={(value: string | null) => {
                    setSelectedCountry(Number(value));
                    userProfileForm.setFieldValue('countryId', value);
                  }}
                  disabled
                />
                <Select
                  label="State"
                  placeholder="State"
                  searchable
                  w={'100%'}
                  size={largeScreen ? 'sm' : 'xs'}
                  data={states}
                  {...userProfileForm.getInputProps('stateId')}
                  value={selectedState ? selectedState.toString() : null}
                  onChange={(value: any) => {
                    setSelectedState(Number(value));
                    userProfileForm.setFieldValue('stateId', value);
                    userProfileForm.setFieldValue('cityId', null);
                    setSelectedCity('');
                  }}
                  disabled={!isEditing}
                />
              </Flex>
              <Flex gap={20} mb="sm">
                <Select
                  label="City"
                  placeholder="City"
                  searchable
                  w={'100%'}
                  data={cities}
                  size={largeScreen ? 'sm' : 'xs'}
                  disabled={!selectedState || !isEditing}
                  {...userProfileForm.getInputProps('cityId')}
                  value={selectedCity ? selectedCity.toString() : null}
                  onChange={(value: string | null) => {
                    setSelectedCity(Number(value));
                    userProfileForm.setFieldValue('cityId', value);
                  }}
                />
                <NumberInput
                  label="Pin-Code"
                  placeholder="Pin-Code"
                  w={'100%'}
                  size={largeScreen ? 'sm' : 'xs'}
                  hideControls
                  maxLength={6}
                  {...userProfileForm.getInputProps('pincode')}
                  disabled={!isEditing}
                />
              </Flex>
            </Box>
          </Box>
          {/* start: button group */}
          {isEditing && (
            <Group
              justify="flex-end"
              p={'md'}
              style={{ borderTop: '1px solid #80808030' }}
            >
              <Button type="submit" radius="xs" fw={500} lts={2} hidden>
                SUBMIT
              </Button>
              <Button radius="xs" fw={500} lts={2} onClick={openclearAllModal}>
                CLEAR ALL
              </Button>
            </Group>
          )}
          {/* end: button group */}
        </form>
        {/* end: form */}
      </Drawer>
      {/* end: Drawer */}
      {changeProfileModalOpened && (
        <ChangeProfilePhoto
          opened={changeProfileModalOpened}
          close={closeChangeProfileModal}
          form={userProfileForm}
          initials={initials}
        />
      )}

      {/* confirmaton modal for cross icon */}
      {crossModalOpened && (
        <ConfirmationModal
          opened={crossModalOpened}
          confirmationMessage={userProfileConstants.confirmMessages.leave}
          positiveButtonText={userProfileConstants.buttonText.yes}
          negativeButtonText={userProfileConstants.buttonText.no}
          handlePositiveButton={handleCrossYesButton}
          handleNegativeButton={closeCrossModal}
        />
      )}

      {/* confirmaton modal for clear all button */}
      {clearAllModalOpened && (
        <ConfirmationModal
          opened={clearAllModalOpened}
          confirmationMessage={userProfileConstants.confirmMessages.clearAll}
          positiveButtonText={userProfileConstants.buttonText.yes}
          negativeButtonText={userProfileConstants.buttonText.no}
          handlePositiveButton={handleClearAllYesButton}
          handleNegativeButton={closeClearAllModal}
        />
      )}

      {/* confirmaton modal for submit button */}
      {submitModalOpened && (
        <ConfirmationModal
          opened={submitModalOpened}
          confirmationMessage={userProfileConstants.confirmMessages.submit}
          positiveButtonText={userProfileConstants.buttonText.yes}
          negativeButtonText={userProfileConstants.buttonText.no}
          handlePositiveButton={handleSubmitYesButton}
          handleNegativeButton={closeSubmitModal}
        />
      )}
    </>
  );
}

export default UserProfile;
