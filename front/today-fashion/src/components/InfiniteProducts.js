import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { SERVER_URL } from '../config';

const InfiniteProducts = ({ searchKeywords }) => {
  const AuthStr = `Bearer ${localStorage.getItem('access_token')}`;
  const [isBottom, setIsBottom] = useState(false);
  const [mainProducts, setMainProducts] = useState([]);
  // const [requestData, setRequestData] = useState({ pageNum: 0, dataSize: 10 });
  const [pageNum, setPageNum] = useState(0);
  const [dataSize, setDataSize] = useState(10);
  const dataSizeRef = useRef(dataSize);

  const [loading, setLoading] = useState(false);

  const setdataSizeRef = (cur) => {
    dataSizeRef.current = cur;
    setDataSize(cur);
  };
  //const [curScrollHeight, setScrollHeigth] =

  // const [itemNums, setItemNums] = useState(10);
  // TODO:
  // 스크롤을 완전히 끝까지 내리기 전에 새로운 데이터 호출하기
  // O 스크롤 속도에 따라 데이터 호출하는 양 다르게 조절하기?
  // 더이상 요청할 데이터가 없는 상황 관리하기

  axios.defaults.baseURL = SERVER_URL;
  axios.defaults.headers.common['Authorization'] = AuthStr;

  const getRecommendationResults = useCallback(async () => {
    try {
      const res = await axios.get('/result-cards');
      setMainProducts([...mainProducts].concat(res.data.products));
      setIsBottom(false);
    } catch (error) {
      console.log(error);
    }
  }, [mainProducts, dataSize]);
  // }, [mainProducts, requestData]);

  const getSearchResults = useCallback(async () => {
    try {
      await setLoading(true);
      const res = await axios.post('/result-search', {
        pageNum: pageNum,
        dataSize: dataSize,
        existingKeywords: searchKeywords,
      });
      console.log(res);
      if (pageNum === 0) {
        await setMainProducts(res.data.cards);
      } else {
        await setMainProducts([...mainProducts].concat(res.data.cards));
      }
      await setPageNum(pageNum + 1);
      await setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [mainProducts, pageNum, dataSize, searchKeywords]);

  const infiniteScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight + 500 >= scrollHeight) {
      //완전히 스크롤 끝에 다다르기 전에 isBottom 선언
      console.log('scroll end');
      console.log(dataSize, dataSizeRef);
      setIsBottom(true);
    }
  };

  const checkScrollSpeed = ((settings) => {
    settings = settings || {};

    let lastPos,
      newPos,
      timer,
      delta,
      delay = settings.delay || 50;

    function clear() {
      lastPos = null;
      delta = 0;
    }

    clear();

    return function () {
      newPos = window.scrollY;
      if (lastPos != null) {
        delta = newPos - lastPos;
      }
      lastPos = newPos;
      clearTimeout(timer);
      timer = setTimeout(clear, delay);
      return delta;
    };
  })();
  //즉시 실행을 해서 익명함수의 리턴 부분에 정의된 함수를 checkScrollSpeed에 할당

  const handleScrollSpeed = () => {
    const speed = checkScrollSpeed();
    console.log(speed);
    if (speed >= 200 && dataSizeRef.current === 10) {
      console.log('증가');
      setdataSizeRef(20);
    }
    if (speed < 200 && dataSizeRef.current === 20) {
      console.log('감소');
      setdataSizeRef(10);
    }
  };

  useEffect(() => {
    if (searchKeywords.length === 0) {
      getRecommendationResults();
    } else {
      getSearchResults();
    }
    window.addEventListener('scroll', handleScrollSpeed, true);
    window.addEventListener('scroll', infiniteScroll, true);
    return () => {
      window.removeEventListener('scroll', infiniteScroll, false);
      window.removeEventListener('scroll', handleScrollSpeed, false);
    };
  }, []);

  useEffect(() => {
    if (searchKeywords.length !== 0) {
      getSearchResults();
    } else {
      getRecommendationResults();
    }
  }, [searchKeywords]);

  useEffect(() => {
    console.log(loading);
    if (isBottom && !loading) {
      //더 불러오기
      setIsBottom(false); // api 호출할 수 있게되면 삭제!!
      console.log(dataSize, dataSizeRef);
      //
      if (searchKeywords.length === 0) {
        setTimeout(() => {
          setMainProducts([...mainProducts].concat([...mainProducts]));
        }, 500);
      } else {
        console.log(pageNum, dataSize);
        getSearchResults();
      }
      // setPageNum(pageNum + 1);
    }
  }, [isBottom, pageNum, mainProducts, loading, searchKeywords]);

  if (!mainProducts || mainProducts.length === 0) {
    return null;
  }

  return (
    <div className="products-container">
      {mainProducts.map((product, index) => (
        <div key={index}>
          <ProductCard productData={product} />
        </div>
      ))}
    </div>
  );
};

export default InfiniteProducts;
