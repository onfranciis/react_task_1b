import React, { useCallback, useEffect, useState } from "react";
import AdminDashboardCard from "../components/AdminDashboardCard";
import UserIcon from "../../src/UserIcon.png";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CardData } from "../components/CardData";
import update from "immutability-helper";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router";
import MkdSDK from "../utils/MkdSDK";

const AdminDashboardPage = () => {
  const [cards, setCards] = useState([]);
  const [localPage, setLocalPage] = useState(1);
  const [fetchedPage, setFetchedPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { dispatch } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const sdk = new MkdSDK();
  const date = new Date();
  const todaysDay = date.toDateString();
  const [hour, minutes] = [date.getHours(), date.getMinutes()];

  const UrlPayload = {
    payload: {},
    page: localPage,
    limit: 10,
  };

  const sdkCheck = async () => {
    setLoading(true);
    const sdkResponse = await sdk.check(localStorage.getItem("role"));
    const response = await sdk.callRestAPI(UrlPayload, "VIDEO");

    if (!response.error) {
      setCards(response?.list);
      setNumOfPages(response?.num_pages);
      setFetchedPage(response?.page);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    sdkCheck();
  }, []);

  useEffect(() => {
    sdkCheck();
  }, [localPage]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const renderCard = useCallback((card, index) => {
    return (
      <AdminDashboardCard
        key={card?.id}
        id={card?.id}
        index={index}
        moveCard={moveCard}
        avatar={card?.photo}
        like={card?.like}
        title={card?.title}
        username={card?.username}
      />
    );
  }, []);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col text-base text-gray-700 gap-4 bg-[#111111] py-10 px-5">
        <div className="flex justify-between items-center flex-wrap gap-5">
          <p className="text-5xl text-white">APP</p>

          <button
            className="bg-[#9BFF00] rounded-full h-fit px-2 py-1  flex justify-center items-center flex-wrap"
            onClick={() => {
              dispatch({ type: "LOGOUT" });
              navigate("/admin/login");
            }}
          >
            <img src={UserIcon} alt="" height={24} width={24} />
            <p className="text-[#050505] text-sm">Logout</p>
          </button>
        </div>

        <div className="flex justify-between items-center text-white flex-wrap gap-5 ">
          <p className="text-xl">Today's leaderboard</p>

          <div className="flex items-center justify-center gap-2 bg-[#1D1D1D] px-3 py-2 rounded-lg text-xs flex-wrap">
            <p className="text-center">{todaysDay}</p>

            <span className="w-1 h-1 bg-[#696969] rounded-full"></span>

            <p className="bg-[#9BFF00] py-1 px-2 rounded text-black text-center">
              Submissions Open
            </p>

            <span className="w-1 h-1 bg-[#696969] rounded-full"></span>

            <p>{`${hour}:${minutes}`}</p>
          </div>
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className="overflow-scroll px-5">
            <table className="w-full min-w-[470px] table-auto border-separate border-spacing-0 border-spacing-y-2 overflow-scroll">
              <thead>
                <tr className="">
                  <th className="text-left pl-3">#</th>
                  <th className="w-fit">Author</th>
                  <th className="w-fit whitespace-nowrap">Most Liked</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card, index) => renderCard(card, index))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-white">
            Page {fetchedPage} {true ? `of ${numOfPages}` : `of ${numOfPages}`}
          </p>

          <p className="text-center h-1 mb-1 mt-[-8px]">
            {loading ? "Loading..." : ""}
          </p>

          <div className="w-full flex justify-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => {
                setLocalPage(1);
              }}
            >
              <p className="text-3xl bg-white px-2 rounded hover:bg-gray-200">
                {"<<"}
              </p>
            </button>

            <button
              onClick={() => {
                setLocalPage(localPage > 1 ? localPage - 1 : 1);
              }}
            >
              <p className="text-3xl bg-white px-2 rounded hover:bg-gray-200">
                {"<"}
              </p>
            </button>

            <button
              onClick={() => {
                setLocalPage(
                  localPage < numOfPages ? localPage + 1 : localPage
                );
              }}
            >
              <p className="text-3xl bg-white px-2 rounded hover:bg-gray-200">
                {">"}
              </p>
            </button>

            <button
              onClick={() => {
                setLocalPage(numOfPages);
              }}
            >
              <p className="text-3xl bg-white px-2 rounded hover:bg-gray-200">
                {">>"}
              </p>
            </button>
          </div>
        </DndProvider>
      </div>
    </>
  );
};

export default AdminDashboardPage;
