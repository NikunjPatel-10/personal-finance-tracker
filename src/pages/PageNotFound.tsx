import { Anchor, Flex, Image, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import PageNotFoundImg from '../assets/images/icon-404.svg';

interface IProps {
  type?: string;
}

export const PageNotFound = ({ type }: IProps) => {
  const navigate = useNavigate();

  return (
    <Flex h={'100%'} align={'center'} justify={'center'} direction={'column'}>
      <Image src={PageNotFoundImg} h={180} w={180} />
      <Flex
        align={'center'}
        h={150}
        fw={'bold'}
        fz={180}
        c={'var(--mantine-color-secondary)'}
        mt={50}
      >
        {type === 'unauthorize' ? '401' : '404'}
      </Flex>
      <Text fz={40}>
        {type === 'unauthorize' ? 'Forbidden ' : 'Page Not Found'}
      </Text>
      <Text fz={18}>
        {type === 'unauthorize'
          ? "You don't have permission to access this resource."
          : "The page you are looking for doesn't exist or an other error occurred."}
      </Text>
      <Anchor fz={18} onClick={() => navigate('/')}>
        &larr;Go Back
      </Anchor>
    </Flex>
  );
};
