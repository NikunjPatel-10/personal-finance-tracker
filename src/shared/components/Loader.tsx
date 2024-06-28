import { Flex, Loader, rgba } from '@mantine/core';

export const LoaderWrapper = () => {
  return (
    <Flex
      justify="center"
      align="center"
      h="100%"
      w="100%"
      pos="absolute"
      bg={rgba('#000000', 0.2)}
      style={{ zIndex: 10000 }}
    >
      <Loader />
    </Flex>
  );
};
