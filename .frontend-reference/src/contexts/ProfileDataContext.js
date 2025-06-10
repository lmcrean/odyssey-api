import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFollow = async (clickedProfile) => {
    try {
      // First, retrieve the profile data to get the owner username
      const { data: profileData } = await axiosReq.get(`/profiles/${clickedProfile.id}/`);
      const ownerUsername = profileData.owner;

      if (!ownerUsername) {
        return {
          success: false,
          error: "Unable to retrieve owner username",
          statusCode: 400
        };
      }
  
      // Now, fetch the user data using the username
      const { data: userData } = await axiosReq.get(`/users/?username=${ownerUsername}`);

      if (!userData || !userData.results || userData.results.length === 0) {
        return {
          success: false,
          error: "Unable to retrieve user data",
          statusCode: 400
        };
      }

      const userId = userData.results.find(user => user.username === ownerUsername)?.id;

      if (!userId) {
        return {
          success: false,
          error: "Unable to retrieve user ID",
          statusCode: 400
        };
      }
  
      // Now use the userId to make the follow request
      const { data } = await axiosRes.post("/followers/", {
        followed: userId,
      });

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || JSON.stringify(err.response?.data) || "An error occurred while following.",
        statusCode: err.response?.status
      };
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      // Retrieve the profile data to get the owner username
      const { data: profileData } = await axiosReq.get(`/profiles/${clickedProfile.id}/`);
      const ownerUsername = profileData.owner;

      if (!ownerUsername) {
        return {
          success: false,
          error: "Unable to retrieve owner username for unfollow",
          statusCode: 400
        };
      }

      // Fetch the user data using the username
      const { data: userData } = await axiosReq.get(`/users/?username=${ownerUsername}`);

      if (!userData || !userData.results || userData.results.length === 0) {
        return {
          success: false,
          error: "Unable to retrieve user data for unfollow",
          statusCode: 400
        };
      }

      const userId = userData.results.find(user => user.username === ownerUsername)?.id;

      if (!userId) {
        return {
          success: false,
          error: "Unable to retrieve user ID for unfollow",
          statusCode: 400
        };
      }

      // Find the follower relationship ID
      const { data: followersData } = await axiosReq.get(`/followers/?followed=${userId}`);
      const followerRelationship = followersData.results.find(
        (follower) => follower.owner === currentUser.username
      );

      if (!followerRelationship) {
        return {
          success: false,
          error: "Follower relationship not found",
          statusCode: 404
        };
      }

      // Delete the follower relationship
      await axiosRes.delete(`/followers/${followerRelationship.id}/`);

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || JSON.stringify(err.response?.data) || "An error occurred while unfollowing.",
        statusCode: err.response?.status
      };
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );

        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.error("Error fetching popular profiles:", err);
      }
    };
  
    handleMount();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};