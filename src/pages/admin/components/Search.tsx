import { TextInput } from '@mantine/core';
import { useDispatch } from 'react-redux';

const Search = ({ searchTerm, setSearchQuery }: any) => {
  const dispatch = useDispatch();

  const searchTermHandler = (e: any) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <TextInput
      leftSectionPointerEvents="none"
      leftSection={
        <span
          className="icon icon-search"
          style={{ fontSize: '16px', cursor: 'pointer' }}
        ></span>
      }
      placeholder="Search here"
      w={'280px'}
      size="sm"
      value={searchTerm}
      onChange={searchTermHandler}
    />
  );
};

export default Search;
