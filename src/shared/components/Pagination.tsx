import { Button, Flex, Text } from '@mantine/core';

interface IProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  totalCount: number;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  pageSize,
  totalCount,
}: IProps) => {
  // Calculate range of results being displayed
  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalCount);

  /**
   * to display next page data
   */
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  /**
   * to display previous page data
   */
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <Flex pt={6} pb={12}>
      <Flex justify="center" align="center" gap="xs">
        Show <Text fw="bold">{startRange}</Text> to
        <Text fw="bold">{endRange}</Text> of <Text fw="bold">{totalCount}</Text>
        Results
      </Flex>
      <Button disabled={currentPage === 1} onClick={handlePrevPage} mx={10}>
        <span className="icon-prew"></span>
      </Button>
      <Button
        disabled={currentPage === Math.ceil(totalCount / pageSize)}
        onClick={handleNextPage}
        mx={10}
      >
        <span className="icon-next"></span>
      </Button>
    </Flex>
  );
};

export default Pagination;
