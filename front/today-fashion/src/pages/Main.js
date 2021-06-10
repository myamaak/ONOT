import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import TagsInput from '../components/TagsInput';
import { SERVER_URL } from '../config';
import { Container, Grid } from '@material-ui/core';
import { PCButton } from '../ui-components/@material-extend';
import ProductCard from '../components/ProductCard';
import InfiniteProductsMobile from '../components/InfiniteProductsMobile';
import InfiniteProductsTablet from '../components/InfiniteProductsTablet';
import InfiniteProductsPC from '../components/InfiniteProductsPC';
import { useMediaQuery } from '@material-ui/core';

const Main = (props) => {
  const isTablet = useMediaQuery('(min-width: 700px)');
  const isPC = useMediaQuery('(min-width: 1280px)');
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [screenSize, getScreenSize] = useState();

  // useEffect(() => {
  //   getScreenSize(window.innerWidth);
  // }, []);

  const handleSelectedTags = (items) => {
    setSearchKeywords(items);
    //items 목록에 따라 키워드 검색 결과 재호출해서 보여주기
  };

  return (
    <>
      <Container>
        <Grid item xs={12}>
          <Grid container spacing={1} style={{ marginTop: '10px' }}>
            <Grid>
              <img
                src="/image/navlogo.png"
                style={{ height: '30px', marginTop: '10px' }}
              />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={1}>
              <LogoutButton />
            </Grid>
            <Grid item xs={1}>
              <Link to="/mypage" style={{ textDecoration: 'none' }}>
                <PCButton>My Page</PCButton>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <TagsInput
        selectedTags={handleSelectedTags}
        fullWidth
        variant="outlined"
        id="tags"
        name="tags"
        placeholder="Search Item by Keyword"
      />
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        {isPC ? (
          <InfiniteProductsPC {...props} searchKeywords={searchKeywords} />
        ) : isTablet ? (
          <InfiniteProductsTablet {...props} searchKeywords={searchKeywords} />
        ) : (
          <InfiniteProductsMobile {...props} searchKeywords={searchKeywords} />
        )}
      </div>
    </>
  );
};

export default Main;
