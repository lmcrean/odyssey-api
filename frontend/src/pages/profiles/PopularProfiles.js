import React from "react";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";
import styles from "../../styles/modules/PopularProfiles.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import PopularProfilesSkeleton from "../../components/PopularProfilesSkeleton";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();
  const currentUser = useCurrentUser();

  return (
    <Container
      className={`${appStyles.Content} ${styles.PopularProfiles} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularProfiles.results.length ? (
        <>
          <p className={styles.PopularProfilesTitle}>Most followed profiles</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularProfiles.results
                .filter((profile) => profile.id !== currentUser?.profile_id)
                .slice(0, 4)
                .map((profile) => (
                  <Profile
                    key={profile.id}
                    profile={profile}
                    mobile
                    hideMessage={true}
                    hideFollow={true}
                    className={styles.ProfileItem}
                  />
                ))}
            </div>
          ) : (
            popularProfiles.results
              .filter((profile) => profile.id !== currentUser?.profile_id)
              .slice(0, 10)
              .map((profile) => (
                <Profile
                  key={profile.id}
                  profile={profile}
                  className={styles.ProfileItem}
                />
              ))
          )}
        </>
      ) : (
        <PopularProfilesSkeleton />
      )}
    </Container>
  );
};

export default PopularProfiles;