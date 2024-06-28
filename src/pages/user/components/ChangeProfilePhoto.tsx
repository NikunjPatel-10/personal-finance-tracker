import {
  Avatar,
  Box,
  Button,
  FileInput,
  Flex,
  Group,
  Modal,
  Slider,
  Text,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useEffect, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import {
  successToaster,
  supported_formates,
  userProfileValidationMessages,
} from '../utility/constants/userProfile.constant';
import { IEditUserProfile } from '../utility/models/user.model';

import { showNotification } from '@mantine/notifications';
import getCroppedImg from '../utility/functions/getImageCropped';
interface IProps {
  opened: boolean;
  close: () => void;
  form: UseFormReturnType<IEditUserProfile>;
  initials: string;
}
const ChangeProfilePhoto = ({ close, opened, form, initials }: IProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<string>();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>();

  useEffect(() => {
    setImage(form.values.image);
  }, [form.values.image]);

  const handleFileUpload = (file: File | null) => {
    if (file) {
      // check file type
      const validFileTypes = supported_formates;
      if (!validFileTypes.includes(file.type)) {
        form.setFieldError(
          'image',
          userProfileValidationMessages.profileImageFormatInvalid
        );
        return;
      }
      // check file size
      if (file.size > 1048576) {
        form.setFieldError(
          'image',
          userProfileValidationMessages.profileImageSizeInvalid
        );
      } else {
        setImage(URL.createObjectURL(file));
        form.setFieldError('image', null);
      }
    }
  };

  // triggers when cropped image performed
  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  // triggers when zooming image performed
  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  // get values of cropped image
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDelete = () => {
    setImage('');
    form.setFieldValue('image', '');
  };
  // save profile image
  const handleSubmit = async () => {
    try {
      if (image) {
        const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
        // Convert the cropped image to base64
        const base64Image = (await toBase64(croppedImageBlob)) as string;
        form.setFieldValue('image', base64Image);
        showNotification({
          title: 'Success',
          message: successToaster,
          color: 'green',
        });
      }
      close();
    } catch (e) {
      console.error(e);
    }
    form.setFieldError('image', '');
  };

  // Utility function to convert blob to base64
  const toBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleClose = () => {
    close();
    form.setFieldError('image', '');
  };
  return (
    <>
      {/* start: modal */}
      <Modal
        opened={opened}
        onClose={handleClose}
        centered
        radius="md"
        size="lg"
        transitionProps={{ transition: 'fade' }}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 3,
        }}
        title="Change Profile Photo"
        styles={{
          header: { paddingInline: 25, paddingBlock: 20 },
          title: { fontSize: 24, fontWeight: 700 },
          body: { paddingBottom: 25 },
        }}
        closeButtonProps={{
          icon: (
            <Text
              component="span"
              className="icon-close"
              c="var(--mantine-color-grey)"
            ></Text>
          ),
        }}
      >
        <Flex direction="column" align="center">
          <Box>
            <Box component="div" w={300} h={300} pos={'relative'}>
              {image || form.values.image ? (
                // start: image cropper
                <Cropper
                  image={image}
                  showGrid={false}
                  crop={crop}
                  cropShape="round"
                  zoom={zoom}
                  aspect={1}
                  onCropChange={onCropChange}
                  onCropComplete={onCropComplete}
                  onZoomChange={onZoomChange}
                  objectFit="cover"
                />
              ) : (
                // end: image cropper
                // display initials of user name, if profile image not present
                <Avatar
                  color="cyan"
                  h={300}
                  w={300}
                  radius="50%"
                  styles={{
                    placeholder: { fontSize: 80 },
                  }}
                >
                  {initials}
                </Avatar>
              )}
            </Box>

            {/* start: slider to zoom-in/zoom-out image */}
            <Slider
              defaultValue={1}
              step={0.1}
              min={1}
              max={3}
              onChange={setZoom}
              style={{ marginTop: 20 }}
              showLabelOnHover={false}
              size="xs"
              thumbSize={20}
              w="100%"
              disabled={image ? false : true}
            />
            {/* end: slider to zoom-in/zoom-out image */}
          </Box>
          {/* start: file input for uploading image */}
          <FileInput
            mt={16}
            mb={24}
            variant="unstyled"
            label={
              <Group className="cp" c="primary" gap={4} justify="center">
                <Text component="span" className="icon-plus"></Text>
                <Text fz={22} fw={500}>
                  Upload a new photo
                </Text>
              </Group>
            }
            accept="image/png,image/jpeg,image/jpg"
            color="primary"
            styles={{
              root: { display: 'flex', flexDirection: 'column' },
              input: { display: 'none' },
            }}
            {...form.getInputProps('image')}
            onChange={handleFileUpload}
          />
          {/* end: file input for uploading image */}
          {/* start: button group */}
          <Group>
            <Button
              type="submit"
              radius="xs"
              fw={500}
              lts={2}
              onClick={handleSubmit}
              disabled={
                form.getInputProps('image').error || !image ? true : false
              }
            >
              APPLY
            </Button>
            <Button
              radius="xs"
              fw={500}
              lts={2}
              color="var(--mantine-color-grey)"
              onClick={handleDelete}
            >
              DELETE
            </Button>
          </Group>
          {/* end: button group */}
        </Flex>
      </Modal>
      {/* end: modal */};
    </>
  );
};

export default ChangeProfilePhoto;
