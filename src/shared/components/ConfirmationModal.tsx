import { Button, Flex, Group, Image, Modal, Text } from '@mantine/core';

interface IProps {
  opened: boolean;
  confirmationMessage: string;
  imageSource?: string;
  positiveButtonText: string;
  negativeButtonText: string;
  handlePositiveButton: () => void;
  handleNegativeButton: () => void;
}

export const ConfirmationModal = ({
  opened,
  confirmationMessage,
  imageSource,
  positiveButtonText,
  negativeButtonText,
  handlePositiveButton,
  handleNegativeButton,
}: IProps) => {
  return (
    <>
      {/* start: modal */}
      <Modal
        opened={opened}
        onClose={handleNegativeButton}
        withCloseButton={false}
        centered
        radius="md"
        size="sm"
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 3,
        }}
        zIndex={1000}
      >
        <Flex align="center" justify="center" direction="column" p="24px">
          {imageSource && <Image src={imageSource} h={100} w={100}></Image>}
          <Text
            ta="center"
            mt="xs"
            mb="lg"
            lh="normal"
            style={{ fontSize: '22px', fontWeight: '600' }}
          >
            {confirmationMessage}
          </Text>
          {/* start: button group */}
          <Group mt="lg" gap="md" grow w="100%">
            <Button
              radius="sm"
              fw={500}
              lts={2}
              size="md"
              tt="uppercase"
              px={0}
              onClick={handlePositiveButton}
            >
              {positiveButtonText}
            </Button>
            <Button
              variant="outline"
              radius="sm"
              fw={500}
              lts={2}
              size="md"
              tt="uppercase"
              px={0}
              onClick={handleNegativeButton}
            >
              {negativeButtonText}
            </Button>
          </Group>
          {/* end: button group */}
        </Flex>
      </Modal>
      {/* end: modal */}
    </>
  );
};
