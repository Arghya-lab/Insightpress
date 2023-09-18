import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import AuthorInfoWidget from "../Components/AuthorInfoWidget";
import { useSelector } from "react-redux";
import EditBioModal from "../Components/EditBioModal";
import FeedContainer from "../Components/FeedContainer";

function AuthorPage() {
  const [blogs, setBlogs] = useState([]);
  // blogs contains array of => _id, {authorData: { authorId, author, avatarImgName }, title, summary,  content, featuredImgName,  createdAt, updatedAt, __v}
  const [fullAuthorData, setFullAuthorData] = useState({});
  //  fullAuthorData contains =>  _id, name, email, avatarImgName, bio, bookmarks, createdAt, updatedAt, __v
  const [isOwnPage, setIsOwnPage] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const authorId = useSelector((state) => state.auth.id);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const authorBlogsApi = `${apiBaseUrl}/api/blog/author/${id}?page=${pageIdx}`;
  const authorDataApi = `${apiBaseUrl}/api/author/${id}`;

  const fetchAuthorData = async () => {
    try {
      const res = await fetch(authorDataApi);
      const data = await res.json();
      setFullAuthorData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllBlogs = async () => {
    try {
      if (hasMore) {
        const res = await fetch(authorBlogsApi);
        const { data, totalBlogs } = await res.json();
        console.log(data, totalBlogs);
        setBlogs(blogs.concat(data));
        setPageIdx(pageIdx + 1);
        if (blogs.length === totalBlogs) {
          setHasMore(false);
        }
        console.log(pageIdx);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
    fetchAuthorData();
  }, [authorBlogsApi, authorDataApi]);

  useEffect(() => {
    if (fullAuthorData._id == authorId) {
      setIsOwnPage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullAuthorData]);

  return (
    <div>
      <Navbar />
      <div className="px-[calc((100vw-1280px)/2)] flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between">
        <div>
          <FeedContainer
            blogs={blogs}
            isOwnPage={isOwnPage}
            fetchMoreData={() => fetchAllBlogs()}
            hasMore={hasMore}
          />
        </div>
        {token ? <EditBioModal authorData={fullAuthorData} /> : undefined}
        <AuthorInfoWidget authorData={fullAuthorData} />
      </div>
    </div>
  );
}

export default AuthorPage;
