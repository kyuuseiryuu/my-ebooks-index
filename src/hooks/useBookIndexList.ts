import data from '../assets/result.json';

interface BookItem {
  path: string;
  name: string;
}

const useBookIndexList = (): [BookItem[]] => {
  return [data as BookItem[]];
};

export default useBookIndexList;