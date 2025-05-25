import React, { useEffect, useState, useRef } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productsApi";
import ProductItem from "./product/ProductItem";
import Loader from "./layout/Loader";
import toast from "react-hot-toast";
import CustomPagination from "./layout/CustomPagination";
import { useSearchParams } from "react-router-dom";
import Filters from "./layout/Filters";

const Home = () => {
  let [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  const params = { page, keyword };

  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const filterRef = useRef(null);

  // Resize listener to toggle mobile/desktop layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click outside to close mobile filter
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showMobileFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target)
      ) {
        setShowMobileFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileFilter]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError, error?.data?.message]);

  const columnSize = keyword ? 6 : 3;

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Buy Best Products Online"} />
      <div className="row">
        {isMobile && (
          <div className="px-3 text-end">
            <button
              className="btn btn-shopper mt-3"
              onClick={() => setShowMobileFilter(true)}
            >
              Filters
            </button>
          </div>
        )}
        <div className="home-container">
          {isMobile && showMobileFilter && (
            <div className="offcanvas-backdrop show" style={{ zIndex: 1040 }}>
              <div
                className="offcanvas offcanvas-end show"
                ref={filterRef}
                style={{
                  visibility: "visible",
                  width: "100%",
                  backgroundColor: "#F5F7FA",
                  zIndex: 1045,
                  height: "100vh",
                  padding: "1rem",
                  overflowY: "auto",
                }}
              >
                <Filters
                  setShowMobileFilter={setShowMobileFilter}
                  isMobile={isMobile}
                />
              </div>
            </div>
          )}

          {!isMobile && (
            <div className="col-6 col-md-3 mt-5">
              {!isMobile && (
                <div className="border p-3" style={{ maxWidth: "300px" }}>
                  <Filters setShowMobileFilter={setShowMobileFilter} />
                </div>
              )}
            </div>
          )}
          <div className={`col-12 ${keyword ? "col-md-9" : "col-md-12"}`}>
            <section id="products" className={!isMobile ? "mt-2rem" : ""}>
              <div className="row product-container">
                {data?.products?.map((product, index) => (
                  <ProductItem
                    product={product}
                    columnSize={columnSize}
                    key={index}
                  />
                ))}
              </div>
            </section>

            <CustomPagination
              resPerPage={data?.resPerPage}
              filteredProductsCount={data?.filteredProductsCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
