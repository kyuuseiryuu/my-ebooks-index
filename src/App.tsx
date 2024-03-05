import { FormEvent, useCallback, useState } from 'react';
import { Grid, Input, Box, List, ListItem, ListItemContent, Typography, ListItemButton, IconButton } from '@mui/joy';
import Download from '@mui/icons-material/Download';
import { groupBy } from 'lodash';
import './App.css';
import { TreeNode } from './types';
import FolderTree from './components/FolderTree';
import rawData from './assets/result.json';

function getTreeData(data: typeof rawData) {
  const treeRoot: TreeNode[] = [];
  data.forEach(({ path }) => {
    const nodes = path.split('/');
    let currentList: TreeNode[] = treeRoot; 
    let fullPath = "";
    nodes.forEach((title, i) => {
      if (!title) return;
      const index = currentList.findIndex(e => e.title === title);
      fullPath += `/${title}`;
      if (index === -1) {
        const treeNode: TreeNode = {
          isLeaf: i === nodes.length - 1,
          key: fullPath,
          title: title,
          children: [],
        }
        currentList.push(treeNode);
        currentList = treeNode.children;
        return;
      }
      currentList = currentList[index].children;
    });
  });
  return treeRoot;
}

const treeData = getTreeData(rawData);

function App() {
  const [searchKey, setSearchKey] = useState('');
  const [showList, setShowList] = useState<typeof rawData>([]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    console.debug('submit', searchKey);
    const list = searchKey ? rawData.filter(e => e.path.includes(searchKey) || e.name.includes(searchKey)) : [];
    setShowList([...list]);
  }, [searchKey]);


  const handleClick = useCallback((node?: TreeNode) => {
    if (!node) return;
    const list = groupBy(rawData, 'path')[node.key];
    if (list) {
      console.debug(list);
      setShowList(list);
      setSearchKey('');
    }
  }, []);

  return (
    <Grid container spacing={2} height='100vh' overflow='auto' p={2}>
      <Grid xs={10} sm={4} md={4} xl={2} position='sticky' top={2}>
        <Box mt={1}>
          <form onSubmit={handleSubmit}>
            <Input size="lg" placeholder='搜索' value={searchKey} onChange={e => setSearchKey(e.target.value)} />
          </form>
        </Box>
        <Box maxHeight='800px' position='sticky' mt={1} overflow='auto'>
          <FolderTree treeData={treeData} onClick={e => handleClick(e)} />
        </Box>
      </Grid>
      <Grid m={1} xs={10} sm={6} md={6} xl={8} height='100%' display='flex' flexDirection='row' overflow='auto' flexWrap='wrap'>
        <List>
          {showList.map((e, i) => (
            <ListItem
              key={`${e.name}-${i}`}
              startAction={
                <IconButton>
                  <Download />
                </IconButton>
              }
            >
              <ListItemButton>
                <ListItemContent>
                  <Typography level='title-lg'>{e.name}</Typography>
                  <Typography level='body-sm'>{e.path}</Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default App;
